"""
Rule-based Template Recommendation Engine.

Design principles:
  - Deterministic and explainable (no black-box ML)
  - Inputs: target role, industry, experience level, ATS preference, CV content
  - Output: recommended template + reason + score + alternatives
  - Easy to extend with ML scoring later without breaking the interface

Scoring:
  Each template gets a base relevance score (0.0–1.0) computed from:
    1. Industry match rules
    2. Experience level rules
    3. ATS preference adjustment
    4. Creative vs conservative preference
  The highest scorer is recommended; next two are alternatives.
"""
from dataclasses import dataclass, field
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.cv import CVRepository
from app.repositories.template import TemplateRepository
from app.schemas.template import TemplateRecommendationOut


# ── Scoring config ────────────────────────────────────────────────────────────

# Base scores per template slug for each industry keyword
INDUSTRY_SCORES: dict[str, dict[str, float]] = {
    "tech": {
        "modern": 0.95, "professional": 0.75, "classic": 0.55,
        "creative": 0.50, "executive": 0.45, "academic": 0.35, "healthcare": 0.20,
    },
    "finance": {
        "classic": 0.95, "executive": 0.85, "professional": 0.70,
        "modern": 0.50, "academic": 0.40, "healthcare": 0.20, "creative": 0.15,
    },
    "creative": {
        "creative": 0.95, "modern": 0.70, "professional": 0.55,
        "classic": 0.40, "academic": 0.30, "executive": 0.25, "healthcare": 0.20,
    },
    "academic": {
        "academic": 0.95, "classic": 0.70, "professional": 0.55,
        "modern": 0.45, "executive": 0.35, "healthcare": 0.30, "creative": 0.20,
    },
    "healthcare": {
        "healthcare": 0.95, "classic": 0.75, "professional": 0.65,
        "academic": 0.50, "modern": 0.40, "executive": 0.35, "creative": 0.15,
    },
    "executive": {
        "executive": 0.95, "classic": 0.80, "professional": 0.65,
        "modern": 0.45, "academic": 0.30, "healthcare": 0.25, "creative": 0.20,
    },
    "general": {
        "professional": 0.80, "modern": 0.75, "classic": 0.70,
        "executive": 0.55, "academic": 0.45, "healthcare": 0.40, "creative": 0.40,
    },
}

EXPERIENCE_BOOSTS: dict[str, dict[str, float]] = {
    "entry": {"modern": 0.10, "professional": 0.05},
    "mid": {"modern": 0.05, "professional": 0.05},
    "senior": {"executive": 0.10, "classic": 0.05},
    "executive": {"executive": 0.20, "classic": 0.10},
}

REASONS: dict[str, str] = {
    "modern": (
        "Clean metrics-first formatting and FAANG-aligned structure make Modern the "
        "top performer for tech roles in ATS systems like Greenhouse and Lever."
    ),
    "classic": (
        "Single-column serif layout is the standard expectation in finance, law, "
        "and consulting — maximises ATS parse accuracy at 99%."
    ),
    "professional": (
        "Left-sidebar layout balances skills visibility with experience depth, "
        "ideal for versatile roles across multiple industries."
    ),
    "executive": (
        "Two-panel structure separates leadership impact from competencies — "
        "matches how executive search firms assess senior candidates."
    ),
    "academic": (
        "Education-first layout with dedicated publication and research sections — "
        "designed for academic hiring committees and university ATS systems."
    ),
    "healthcare": (
        "Certifications and licence numbers placed prominently — optimised for NHS "
        "and hospital ATS systems that parse clinical credentials first."
    ),
    "creative": (
        "Bold visual design for design studios and agencies that evaluate CVs as "
        "designed PDFs rather than parsed text."
    ),
}


def _detect_industry(content: dict) -> str:
    """Infer industry from CV content when not explicitly provided."""
    text = " ".join([
        content.get("personal", {}).get("jobTitle", ""),
        " ".join(content.get("skills", [])),
        " ".join(
            e.get("role", "") for e in content.get("experience", [])
        ),
    ]).lower()

    if any(w in text for w in ("engineer", "developer", "software", "data", "ml", "ai", "tech")):
        return "tech"
    if any(w in text for w in ("finance", "banking", "analyst", "accounting", "audit")):
        return "finance"
    if any(w in text for w in ("design", "ux", "ui", "creative", "art director")):
        return "creative"
    if any(w in text for w in ("professor", "researcher", "phd", "postdoc", "academic")):
        return "academic"
    if any(w in text for w in ("nurse", "doctor", "clinical", "physician", "healthcare")):
        return "healthcare"
    if any(w in text for w in ("director", "ceo", "cto", "vp ", "chief", "c-suite")):
        return "executive"
    return "general"


def _detect_experience_level(content: dict) -> str:
    exp_count = len(content.get("experience", []))
    job_title = content.get("personal", {}).get("jobTitle", "").lower()

    if any(w in job_title for w in ("junior", "associate", "intern", "graduate")):
        return "entry"
    if any(w in job_title for w in ("director", "vp", "chief", "c-suite", "head of")):
        return "executive"
    if any(w in job_title for w in ("senior", "lead", "principal", "staff")):
        return "senior"
    if exp_count <= 1:
        return "entry"
    if exp_count <= 3:
        return "mid"
    return "senior"


class RecommendationService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.cv_repo = CVRepository(db)
        self.template_repo = TemplateRepository(db)

    async def recommend_for_cv(
        self, cv_id: UUID, user: User
    ) -> TemplateRecommendationOut:
        cv = await self.cv_repo.get_by_id_for_user(cv_id, user.id)
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")

        content = cv.content or {}
        industry = _detect_industry(content)
        experience_level = _detect_experience_level(content)

        return await self._compute_recommendation(
            industry=industry,
            experience_level=experience_level,
            ats_preference=True,  # Default to ATS-priority; override when UI provides signal
        )

    async def recommend_from_signals(
        self,
        *,
        target_role: str | None,
        industry: str | None,
        experience_level: str | None,
        ats_preference: bool = True,
        creative_preference: bool = False,
    ) -> TemplateRecommendationOut:
        """Direct recommendation from explicit signals (for the AI endpoint)."""
        resolved_industry = industry or "general"
        resolved_level = experience_level or "mid"
        return await self._compute_recommendation(
            industry=resolved_industry,
            experience_level=resolved_level,
            ats_preference=ats_preference,
            creative_preference=creative_preference,
        )

    async def _compute_recommendation(
        self,
        *,
        industry: str,
        experience_level: str,
        ats_preference: bool = True,
        creative_preference: bool = False,
    ) -> TemplateRecommendationOut:
        # Start from industry base scores
        scores: dict[str, float] = dict(
            INDUSTRY_SCORES.get(industry, INDUSTRY_SCORES["general"])
        )

        # Apply experience level boosts
        for slug, boost in EXPERIENCE_BOOSTS.get(experience_level, {}).items():
            scores[slug] = min(1.0, scores.get(slug, 0.0) + boost)

        # ATS preference: penalise creative
        if ats_preference and not creative_preference:
            scores["creative"] = max(0.0, scores.get("creative", 0.5) - 0.25)

        # Creative preference: boost creative, penalise classic
        if creative_preference:
            scores["creative"] = min(1.0, scores.get("creative", 0.5) + 0.25)
            scores["classic"] = max(0.0, scores.get("classic", 0.5) - 0.15)

        # Rank by score
        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        best_slug, best_score = ranked[0]

        # Resolve template DB records
        templates = await self.template_repo.get_active()
        slug_to_template = {t.slug: t for t in templates}

        best_template = slug_to_template.get(best_slug)
        if not best_template:
            raise HTTPException(status_code=500, detail="Recommendation engine could not resolve template")

        alternatives = []
        for slug, score in ranked[1:3]:
            t = slug_to_template.get(slug)
            if t:
                alternatives.append({
                    "template_id": str(t.id),
                    "slug": slug,
                    "score": round(score, 2),
                    "reason": REASONS.get(slug, ""),
                })

        # Confidence: gap between top-2 scores
        confidence = round(best_score - (ranked[1][1] if len(ranked) > 1 else 0), 2)

        return TemplateRecommendationOut(
            recommended_template_id=best_template.id,
            recommended_slug=best_slug,
            reason=REASONS[best_slug],
            score=round(best_score, 2),
            confidence=min(1.0, confidence + 0.5),
            alternatives=alternatives,
        )
