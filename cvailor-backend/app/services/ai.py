"""
AI Service — wraps Anthropic/OpenAI calls for all AI-assisted CV features.

Pattern for each operation:
  1. Build a structured prompt from CV content
  2. Call the model
  3. Parse and validate the structured response
  4. Log the suggestion to ai_suggestions table
  5. Return typed response

All prompts use system + user message format. Models used:
  - Fast operations (keywords, bullets): claude-haiku-4-5-20251001
  - Complex operations (tailor CV, full summary): claude-sonnet-4-6
"""
import json
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import get_logger
from app.models.ai_suggestion import SuggestionType
from app.models.user import User
from app.repositories.ai_suggestion import AISuggestionRepository
from app.repositories.cv import CVRepository
from app.schemas.ai import (
    ExtractKeywordsRequest,
    ExtractKeywordsResponse,
    GenerateSummaryRequest,
    GenerateSummaryResponse,
    RewriteExperienceRequest,
    RewriteExperienceResponse,
    TailorCVRequest,
    TailorCVResponse,
)
from app.schemas.cv import CVContent

logger = get_logger(__name__)


def _get_anthropic_client():
    try:
        import anthropic
        return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    except ImportError:
        raise HTTPException(status_code=503, detail="AI provider not installed")


def _call_claude(
    system: str,
    user_message: str,
    *,
    model: str | None = None,
    max_tokens: int = 1024,
) -> tuple[str, int]:
    """Synchronous Claude call. Called from async context via run_in_executor or Celery tasks."""
    client = _get_anthropic_client()
    resolved_model = model or settings.AI_MODEL_FAST

    response = client.messages.create(
        model=resolved_model,
        max_tokens=max_tokens,
        system=system,
        messages=[{"role": "user", "content": user_message}],
    )

    content = response.content[0].text
    tokens = response.usage.input_tokens + response.usage.output_tokens
    return content, tokens


class AIService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.cv_repo = CVRepository(db)
        self.suggestion_repo = AISuggestionRepository(db)

    async def generate_summary(
        self, payload: GenerateSummaryRequest, user: User
    ) -> GenerateSummaryResponse:
        system = (
            "You are an expert CV writer. Generate a concise 3–4 sentence professional "
            "summary for the provided candidate profile. The summary should be ATS-optimised, "
            "written in first-person implied (no 'I'), and tailored to the target role. "
            "Return ONLY the summary text — no labels, no extra explanation."
        )

        user_msg = f"""Candidate profile:
Name: {payload.personal_info.get('fullName', '')}
Target Role: {payload.target_role or payload.personal_info.get('jobTitle', '')}
Experience: {json.dumps(payload.experience[:3], indent=2)}
{'Job Description: ' + payload.job_description if payload.job_description else ''}"""

        import asyncio
        loop = asyncio.get_event_loop()
        text, tokens = await loop.run_in_executor(
            None, lambda: _call_claude(system, user_msg)
        )

        await self._log(
            user=user,
            cv_id=payload.cv_id,
            suggestion_type=SuggestionType.summary,
            input_payload=payload.model_dump(),
            output_payload={"summary": text},
            tokens=tokens,
        )

        return GenerateSummaryResponse(summary=text.strip(), tokens_used=tokens)

    async def rewrite_experience(
        self, payload: RewriteExperienceRequest, user: User
    ) -> RewriteExperienceResponse:
        system = (
            "You are a senior CV coach. Rewrite the provided work experience bullets to be "
            "more impactful, ATS-optimised, and quantified. Use the XYZ formula: "
            "'Accomplished X as measured by Y by doing Z'. "
            "Return a JSON object: {\"bullets\": [\"...\", \"...\", \"...\"]}. "
            "Return ONLY the JSON — no markdown, no explanation."
        )

        entry = payload.experience_entry
        user_msg = f"""Role: {entry.role} at {entry.company}
Original bullets:
{chr(10).join(f'- {b}' for b in entry.bullets)}
{'Job description context: ' + payload.job_description if payload.job_description else ''}
Tone: {payload.tone}"""

        import asyncio
        loop = asyncio.get_event_loop()
        raw, tokens = await loop.run_in_executor(
            None, lambda: _call_claude(system, user_msg)
        )

        try:
            parsed = json.loads(raw)
            bullets = parsed.get("bullets", [])
        except (json.JSONDecodeError, KeyError):
            bullets = [b.strip("- ").strip() for b in raw.split("\n") if b.strip()]

        await self._log(
            user=user,
            cv_id=payload.cv_id,
            suggestion_type=SuggestionType.experience_bullet,
            input_payload=payload.model_dump(),
            output_payload={"bullets": bullets},
            tokens=tokens,
        )

        return RewriteExperienceResponse(rewritten_bullets=bullets, tokens_used=tokens)

    async def extract_keywords(
        self, payload: ExtractKeywordsRequest, user: User
    ) -> ExtractKeywordsResponse:
        system = (
            "You are an ATS analyst. Extract structured information from the job description. "
            "Return ONLY valid JSON:\n"
            "{\"keywords\": [...], \"role\": \"...\", \"industry\": \"...\", \"experience_level\": \"...\"}\n"
            "experience_level must be one of: entry, mid, senior, executive."
        )

        import asyncio
        loop = asyncio.get_event_loop()
        raw, tokens = await loop.run_in_executor(
            None,
            lambda: _call_claude(system, payload.job_description, max_tokens=512),
        )

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = {"keywords": [], "role": None, "industry": None, "experience_level": None}

        await self._log(
            user=user,
            cv_id=None,
            suggestion_type=SuggestionType.extract_keywords,
            input_payload={"job_description": payload.job_description[:500]},
            output_payload=parsed,
            tokens=tokens,
        )

        return ExtractKeywordsResponse(
            keywords=parsed.get("keywords", []),
            role=parsed.get("role"),
            industry=parsed.get("industry"),
            experience_level=parsed.get("experience_level"),
            tokens_used=tokens,
        )

    async def tailor_cv(
        self, payload: TailorCVRequest, user: User
    ) -> TailorCVResponse:
        """
        Tailors the full CV content to a specific job description.
        Uses the powerful model — queued via Celery for long operations.
        Returns tailored CVContent + a list of changes made.
        """
        cv = await self.cv_repo.get_by_id_for_user(payload.cv_id, user.id)
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")

        system = (
            "You are an expert CV tailoring specialist. Given a CV in JSON format and a job description, "
            "rewrite the CV to maximise ATS match without fabricating experience. "
            "Adjust the summary, reframe bullet points, and reorder skills. "
            "Return a JSON object with two keys:\n"
            "  'tailored_content': the full updated CV JSON (same structure as input)\n"
            "  'changes': list of short strings describing each change made\n"
            "Return ONLY valid JSON."
        )

        user_msg = f"""CV Content:
{json.dumps(cv.content, indent=2)}

Job Description:
{payload.job_description}

Target Company: {payload.target_company or 'Not specified'}"""

        import asyncio
        loop = asyncio.get_event_loop()
        raw, tokens = await loop.run_in_executor(
            None,
            lambda: _call_claude(
                system, user_msg,
                model=settings.AI_MODEL_POWERFUL,
                max_tokens=4096,
            ),
        )

        try:
            parsed = json.loads(raw)
            tailored_dict = parsed.get("tailored_content", cv.content)
            changes = parsed.get("changes", [])
        except json.JSONDecodeError:
            tailored_dict = cv.content
            changes = ["Could not parse AI response — original content preserved"]

        tailored_content = CVContent.model_validate(tailored_dict)

        await self._log(
            user=user,
            cv_id=payload.cv_id,
            suggestion_type=SuggestionType.tailor_cv,
            input_payload={"cv_id": str(payload.cv_id), "jd_preview": payload.job_description[:300]},
            output_payload={"changes": changes},
            tokens=tokens,
            model=settings.AI_MODEL_POWERFUL,
        )

        return TailorCVResponse(
            tailored_content=tailored_content,
            changes_summary=changes,
            tokens_used=tokens,
        )

    # ── Internal logging ──────────────────────────────────────────────────────

    async def _log(
        self,
        *,
        user: User,
        cv_id: UUID | None,
        suggestion_type: SuggestionType,
        input_payload: dict,
        output_payload: dict,
        tokens: int,
        model: str | None = None,
    ) -> None:
        try:
            await self.suggestion_repo.create(
                user_id=user.id,
                cv_id=cv_id,
                suggestion_type=suggestion_type,
                input_payload=input_payload,
                output_payload=output_payload,
                model_used=model or settings.AI_MODEL_FAST,
                tokens_used=tokens,
            )
        except Exception as exc:
            logger.warning("ai_suggestion_log_failed", error=str(exc))
