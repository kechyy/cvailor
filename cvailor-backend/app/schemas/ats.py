from uuid import UUID

from app.schemas.common import BaseSchema


class ScoreBreakdown(BaseSchema):
    """Mirrors the frontend ScoreBreakdown type."""
    keywordsMatch: int
    experienceFit: int
    skillsAlignment: int
    summaryStrength: int


class ATSReviewRequest(BaseSchema):
    cv_id: UUID
    job_description: str | None = None


class ATSAnalysisOut(BaseSchema):
    id: UUID
    cv_id: UUID
    ats_score: int
    score_breakdown: ScoreBreakdown
    matched_keywords: list[str]
    missing_keywords: list[str]
    tips: list[str]
    analysis_version: str
    job_description: str | None


class ATSJobStatusResponse(BaseSchema):
    job_id: str
    status: str   # pending | processing | completed | failed
    result: ATSAnalysisOut | None = None
