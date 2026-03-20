"""
CV Tailoring Service — GPT-4 powered CV optimisation for a specific job role.

Pipeline for each request:
  1. Check daily rate limit (DB count of today's history records for this user)
  2. Build structured prompt (system + user) from CV content + job description
  3. Call OpenAI GPT-4 with retry (3 attempts, exponential backoff on rate limit / timeout)
  4. Parse and validate JSON response; retry once if parsing fails
  5. Map GPT output to CVContent via Pydantic model_validate
  6. Persist both original and tailored content to cv_tailor_history
  7. Return typed TailorResponse — never expose raw AI output or internal errors

Uses the project's existing run_in_executor pattern for synchronous OpenAI calls
(same approach as AIService._call_claude).
"""
import asyncio
import json
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import RateLimitException, ServiceUnavailableException
from app.core.logging import get_logger
from app.models.user import User
from app.repositories.cv_tailor_history import CvTailorHistoryRepository
from app.schemas.cv import CVContent
from app.schemas.cv_tailor import TailorRequest, TailorResponse

logger = get_logger(__name__)

# Top-level keys the GPT response object must contain
_REQUIRED_KEYS = frozenset(
    {"tailored_cv", "ats_score", "matched_keywords", "missing_keywords",
     "improvements_made", "suggestions"}
)

# ── Prompts ───────────────────────────────────────────────────────────────────

_SYSTEM_PROMPT = """You are an expert CV writer and ATS optimization specialist with deep knowledge of recruitment across all industries.

You will receive a candidate CV and a job description. Your task is to tailor the CV to maximise ATS score and relevance for that specific role.

STRICT RULES YOU MUST FOLLOW:
- Never invent experience, qualifications or skills the candidate does not have
- Never change dates, company names or job titles
- Only rewrite how existing experience is described
- Always maintain first person implied tone (no "I" statements)
- All bullet points must start with strong action verbs
- Every responsibility should be rewritten to mirror language used in the job description where truthfully applicable
- Quantify achievements wherever the original hints at scale or impact
- Professional summary must directly address the role and company needs
- Skills section must list matching skills first
- Maintain ATS compliance at all times:
  * Standard section headings only
  * No tables, columns or graphics references
  * Spell out abbreviations on first use
  * Keyword density must feel natural not stuffed

OUTPUT RULES:
- You must return ONLY valid JSON
- No markdown, no backticks, no explanation text
- Follow this exact structure (preserve all original id values for experience and education):
{
  "tailored_cv": {
    "personal": {
      "fullName": "",
      "jobTitle": "",
      "email": "",
      "phone": "",
      "location": "",
      "linkedin": "",
      "website": "",
      "summary": ""
    },
    "experience": [
      {
        "id": "",
        "company": "",
        "role": "",
        "startDate": "",
        "endDate": "",
        "current": false,
        "bullets": []
      }
    ],
    "education": [
      {
        "id": "",
        "institution": "",
        "degree": "",
        "field": "",
        "year": ""
      }
    ],
    "skills": [],
    "languages": [],
    "certifications": []
  },
  "ats_score": 0,
  "matched_keywords": [],
  "missing_keywords": [],
  "improvements_made": [],
  "suggestions": []
}
- ats_score must be an integer 0–100
- matched_keywords: keywords present in both the CV and the job description
- missing_keywords: important job description keywords absent from the CV
- improvements_made: concise list of the specific changes made to the CV
- suggestions: actionable advice for the candidate to further strengthen their profile"""

_USER_PROMPT_TEMPLATE = """Here is the candidate CV:
{cv_data}

Here is the job description:
{job_description}

Tailor this CV for the role above following all rules provided."""


# ── OpenAI helpers ────────────────────────────────────────────────────────────

def _get_openai_client():
    """Lazy-import the OpenAI client (mirrors _get_anthropic_client in ai.py)."""
    try:
        from openai import OpenAI
        return OpenAI(api_key=settings.OPENAI_API_KEY)
    except ImportError:
        raise ServiceUnavailableException("OpenAI provider not installed.")


def _call_openai_sync(
    system: str,
    user_msg: str,
    *,
    model: str,
    temperature: float = 0.3,
    max_tokens: int = 4000,
) -> tuple[str, int]:
    """
    Synchronous GPT call — runs inside run_in_executor so it does not block
    the async event loop. Returns (raw_text, total_tokens).
    """
    client = _get_openai_client()
    response = client.chat.completions.create(
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user_msg},
        ],
    )
    content = response.choices[0].message.content or ""
    tokens = response.usage.total_tokens if response.usage else 0
    return content, tokens


# ── Service ───────────────────────────────────────────────────────────────────

class CvTailorService:
    """Orchestrates the full CV tailoring pipeline."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.history_repo = CvTailorHistoryRepository(db)

    async def tailor(self, payload: TailorRequest, user: User) -> TailorResponse:
        """
        Main entry point. Rate-checks, calls GPT-4, persists history, returns result.

        Args:
            payload: validated TailorRequest (cv_data + job_description + optional template_id)
            user:    authenticated User from JWT — user_id is never taken from the request body

        Raises:
            RateLimitException:         user exceeded CV_TAILOR_DAILY_LIMIT today
            ServiceUnavailableException: OpenAI unavailable after retries or JSON parsing failed
        """
        await self._check_rate_limit(user.id)

        user_msg = _USER_PROMPT_TEMPLATE.format(
            cv_data=json.dumps(payload.cv_data.model_dump(), indent=2),
            job_description=payload.job_description,
        )

        raw, tokens = await self._call_with_retry(_SYSTEM_PROMPT, user_msg)
        parsed = await self._parse_and_validate_response(raw, user_msg)

        tailored_content = CVContent.model_validate(parsed["tailored_cv"])

        history = await self.history_repo.create(
            user_id=user.id,
            template_id=payload.template_id,
            original_cv_content=payload.cv_data.model_dump(),
            tailored_cv_content=tailored_content.model_dump(),
            job_description=payload.job_description,
            ats_score=parsed["ats_score"],
            matched_keywords=parsed["matched_keywords"],
            missing_keywords=parsed["missing_keywords"],
            improvements_made=parsed["improvements_made"],
            suggestions=parsed["suggestions"],
        )
        await self.db.commit()
        await self.db.refresh(history)

        logger.info(
            "cv_tailor_success",
            user_id=str(user.id),
            ats_score=parsed["ats_score"],
            tokens=tokens,
            history_id=str(history.id),
        )

        return TailorResponse(
            tailored_cv=tailored_content,
            ats_score=parsed["ats_score"],
            matched_keywords=parsed["matched_keywords"],
            missing_keywords=parsed["missing_keywords"],
            improvements_made=parsed["improvements_made"],
            suggestions=parsed["suggestions"],
            tailor_history_id=history.id,
        )

    # ── Private helpers ───────────────────────────────────────────────────────

    async def _check_rate_limit(self, user_id: UUID) -> None:
        """
        Raise RateLimitException if the user has already reached their
        daily tailoring limit (CV_TAILOR_DAILY_LIMIT, default 10).
        """
        count = await self.history_repo.count_today_for_user(user_id)
        if count >= settings.CV_TAILOR_DAILY_LIMIT:
            raise RateLimitException(
                message=(
                    f"You have reached your daily limit of "
                    f"{settings.CV_TAILOR_DAILY_LIMIT} tailoring requests. "
                    "Try again tomorrow."
                ),
            )

    async def _call_with_retry(
        self, system: str, user_msg: str
    ) -> tuple[str, int]:
        """
        Call OpenAI GPT-4 with exponential backoff on rate-limit / timeout errors.
        Makes up to 3 attempts (waits: 2 s, 4 s before attempts 2 and 3).
        Raises ServiceUnavailableException after all attempts are exhausted.
        """
        import openai  # local import — mirrors existing anthropic import pattern

        max_attempts = 3
        loop = asyncio.get_event_loop()

        for attempt in range(1, max_attempts + 1):
            try:
                raw, tokens = await loop.run_in_executor(
                    None,
                    lambda: _call_openai_sync(
                        system,
                        user_msg,
                        model=settings.CV_TAILOR_MODEL,
                        temperature=0.3,
                        max_tokens=4000,
                    ),
                )
                return raw, tokens

            except (openai.RateLimitError, openai.APITimeoutError) as exc:
                if attempt < max_attempts:
                    wait = 2 ** attempt  # 2 s → 4 s
                    logger.warning(
                        "openai_retry",
                        attempt=attempt,
                        wait_seconds=wait,
                        error=str(exc),
                    )
                    await asyncio.sleep(wait)
                else:
                    logger.error("openai_rate_limit_exhausted", error=str(exc))
                    raise ServiceUnavailableException(
                        "Our AI service is temporarily unavailable due to high demand. "
                        "Please try again in a moment."
                    )

            except openai.APIError as exc:
                logger.error("openai_api_error", error=str(exc), attempt=attempt)
                if attempt < max_attempts:
                    await asyncio.sleep(2 ** attempt)
                else:
                    raise ServiceUnavailableException(
                        "Our AI service encountered an error. Please try again in a moment."
                    )

            except Exception as exc:
                logger.error("openai_unexpected_error", error=str(exc), exc_info=True)
                raise ServiceUnavailableException(
                    "Our AI service is temporarily unavailable. Please try again."
                )

        raise ServiceUnavailableException("AI service unavailable after retries.")

    async def _parse_and_validate_response(
        self, raw: str, original_user_msg: str
    ) -> dict:
        """
        Parse the GPT JSON response and verify all required keys are present.
        If the first attempt fails, retries once with an explicit correction
        instruction. Raises ServiceUnavailableException if both attempts fail.
        """
        data = self._try_parse_json(raw)
        if data and _REQUIRED_KEYS.issubset(data.keys()):
            return data

        # First parse failed — ask GPT to fix the JSON
        logger.warning("openai_json_parse_failed_retrying")
        fix_msg = (
            f"{original_user_msg}\n\n"
            "Your previous response could not be parsed as valid JSON. "
            "Return ONLY the JSON object with no markdown fences, no backticks, "
            "and no explanation text."
        )
        raw2, _ = await self._call_with_retry(_SYSTEM_PROMPT, fix_msg)
        data2 = self._try_parse_json(raw2)
        if data2 and _REQUIRED_KEYS.issubset(data2.keys()):
            return data2

        logger.error("openai_json_parse_failed_twice")
        raise ServiceUnavailableException(
            "Our AI service returned an unexpected response. Please try again."
        )

    @staticmethod
    def _try_parse_json(text: str) -> dict | None:
        """
        Attempt JSON parsing. Strips accidental markdown fences before second try.
        Returns None (not raises) on parse failure so the caller can decide.
        """
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            stripped = (
                text.strip()
                .removeprefix("```json")
                .removeprefix("```")
                .removesuffix("```")
                .strip()
            )
            try:
                return json.loads(stripped)
            except json.JSONDecodeError:
                return None
