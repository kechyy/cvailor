"""
ATS Analysis Service.

Implements rule-based ATS scoring that mirrors the frontend ScoreBreakdown type.
Designed to be replaced or augmented by AI-based analysis in Phase 2.

Scoring dimensions:
  keywordsMatch    — job description keyword overlap with CV content
  experienceFit    — experience count, seniority signals, date quality
  skillsAlignment  — skills[] overlap with JD keywords
  summaryStrength  — presence and length of summary
"""
import re
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.ats_analysis import ATSAnalysisRepository
from app.repositories.cv import CVRepository
from app.schemas.ats import ATSAnalysisOut, ATSReviewRequest, ScoreBreakdown


COMMON_ATS_STOPWORDS = {
    "and", "the", "of", "to", "in", "for", "with", "a", "an", "is", "are",
    "be", "will", "have", "has", "on", "at", "by", "from", "or", "we", "our",
    "you", "your", "their", "this", "that", "as", "it", "its", "about",
}


def _tokenize(text: str) -> set[str]:
    words = re.findall(r"[a-zA-Z][a-zA-Z0-9+#.-]{1,}", text.lower())
    return {w for w in words if w not in COMMON_ATS_STOPWORDS and len(w) > 2}


def _extract_cv_text(content: dict) -> str:
    """Flatten all textual CV content into one string for keyword matching."""
    parts: list[str] = []

    personal = content.get("personal", {})
    parts.append(personal.get("jobTitle", ""))
    parts.append(personal.get("summary", "") or "")

    for exp in content.get("experience", []):
        parts.append(exp.get("role", ""))
        parts.append(exp.get("company", ""))
        parts.extend(exp.get("bullets", []))

    for edu in content.get("education", []):
        parts.append(edu.get("degree", ""))
        parts.append(edu.get("field", ""))

    parts.extend(content.get("skills", []))
    parts.extend(content.get("certifications", []))

    return " ".join(parts)


def _score_keywords(cv_tokens: set[str], jd_tokens: set[str]) -> tuple[int, list[str], list[str]]:
    if not jd_tokens:
        return 80, list(cv_tokens)[:5], []
    matched = cv_tokens & jd_tokens
    missing = jd_tokens - cv_tokens
    score = min(100, int(len(matched) / len(jd_tokens) * 100))
    return score, sorted(matched)[:20], sorted(missing)[:10]


def _score_experience(content: dict) -> int:
    experiences = content.get("experience", [])
    if not experiences:
        return 30
    score = min(90, 40 + len(experiences) * 15)
    # Boost if bullets are present
    total_bullets = sum(len(e.get("bullets", [])) for e in experiences)
    if total_bullets >= 6:
        score = min(100, score + 10)
    return score


def _score_skills(content: dict, jd_tokens: set[str]) -> int:
    skills = {s.lower() for s in content.get("skills", [])}
    if not jd_tokens or not skills:
        return 60 if skills else 30
    overlap = skills & jd_tokens
    return min(100, 50 + int(len(overlap) / max(len(jd_tokens), 1) * 100))


def _score_summary(content: dict) -> int:
    summary = content.get("personal", {}).get("summary", "") or ""
    if not summary:
        return 40
    word_count = len(summary.split())
    if word_count < 20:
        return 55
    if word_count < 50:
        return 75
    return 90


def _generate_tips(
    breakdown: ScoreBreakdown, missing_keywords: list[str]
) -> list[str]:
    tips: list[str] = []

    if missing_keywords:
        tip_kws = ", ".join(f"'{k}'" for k in missing_keywords[:3])
        tips.append(f"Add {tip_kws} to your CV — they appear in the job description")

    if breakdown.summaryStrength < 60:
        tips.append(
            "Write a 3–5 sentence professional summary to improve ATS parsing "
            "and recruiter first impression (+15 pts potential)"
        )
    if breakdown.skillsAlignment < 70:
        tips.append(
            "Expand your skills section to mirror the language used in the job description"
        )
    if breakdown.experienceFit < 60:
        tips.append(
            "Add 3 achievement-focused bullets per role — quantified impact scores highest in ATS"
        )
    if breakdown.keywordsMatch < 50:
        tips.append(
            "Tailor your CV language to match the job description keywords more closely"
        )

    return tips[:4]  # Surface max 4 tips


class ATSService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.cv_repo = CVRepository(db)
        self.ats_repo = ATSAnalysisRepository(db)

    async def review(self, payload: ATSReviewRequest, user: User) -> ATSAnalysisOut:
        cv = await self.cv_repo.get_by_id_for_user(payload.cv_id, user.id)
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")

        content = cv.content or {}
        cv_text = _extract_cv_text(content)
        cv_tokens = _tokenize(cv_text)

        jd_tokens: set[str] = set()
        if payload.job_description:
            jd_tokens = _tokenize(payload.job_description)

        kw_score, matched, missing = _score_keywords(cv_tokens, jd_tokens)
        exp_score = _score_experience(content)
        skill_score = _score_skills(content, jd_tokens)
        summary_score = _score_summary(content)

        breakdown = ScoreBreakdown(
            keywordsMatch=kw_score,
            experienceFit=exp_score,
            skillsAlignment=skill_score,
            summaryStrength=summary_score,
        )

        # Weighted overall score
        overall = int(
            kw_score * 0.40
            + exp_score * 0.25
            + skill_score * 0.20
            + summary_score * 0.15
        )

        tips = _generate_tips(breakdown, missing)

        # Persist analysis run
        run = await self.ats_repo.create(
            cv_id=cv.id,
            user_id=user.id,
            job_description=payload.job_description,
            ats_score=overall,
            score_breakdown=breakdown.model_dump(),
            matched_keywords=matched,
            missing_keywords=missing,
            tips=tips,
            analysis_version="v1",
        )

        # Cache score on CV record
        await self.cv_repo.update(cv, ats_score=overall)

        return ATSAnalysisOut(
            id=run.id,
            cv_id=run.cv_id,
            ats_score=run.ats_score,
            score_breakdown=breakdown,
            matched_keywords=matched,
            missing_keywords=missing,
            tips=tips,
            analysis_version=run.analysis_version,
            job_description=run.job_description,
        )

    async def get_latest(self, cv_id: UUID, user: User) -> ATSAnalysisOut | None:
        cv = await self.cv_repo.get_by_id_for_user(cv_id, user.id)
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")

        run = await self.ats_repo.get_latest_for_cv(cv_id)
        if not run:
            return None

        breakdown = ScoreBreakdown(**run.score_breakdown)
        return ATSAnalysisOut(
            id=run.id,
            cv_id=run.cv_id,
            ats_score=run.ats_score,
            score_breakdown=breakdown,
            matched_keywords=run.matched_keywords,
            missing_keywords=run.missing_keywords,
            tips=run.tips,
            analysis_version=run.analysis_version,
            job_description=run.job_description,
        )
