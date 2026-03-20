"""
Pydantic schemas for the CV Tailor feature (POST /api/v1/cv/tailor).

TailorRequest  — what the frontend sends (inline CV + job description).
TailorResponse — what the frontend receives (tailored CV + analysis metadata).

user_id is intentionally absent from TailorRequest; it is always extracted
from the JWT token via the CurrentUser dependency so it cannot be spoofed.
"""
from uuid import UUID

from app.schemas.common import BaseSchema, TimestampSchema
from app.schemas.cv import CVContent


class TailorRequest(BaseSchema):
    """Request body for POST /api/v1/cv/tailor."""

    cv_data: CVContent
    job_description: str
    template_id: UUID | None = None


class TailorResponse(BaseSchema):
    """
    Successful response from the CV tailor endpoint.

    tailored_cv          — full CV rewritten for the target role
    ats_score            — estimated ATS match score 0–100
    matched_keywords     — keywords found in both the CV and the job description
    missing_keywords     — important JD keywords absent from the CV
    improvements_made    — concise list of specific changes made
    suggestions          — actionable advice for the candidate
    tailor_history_id    — UUID of the saved history record (for future reference)
    """

    tailored_cv: CVContent
    ats_score: int
    matched_keywords: list[str]
    missing_keywords: list[str]
    improvements_made: list[str]
    suggestions: list[str]
    tailor_history_id: UUID


class TailorHistoryOut(TimestampSchema):
    """Lightweight representation of a saved tailor session (for list/audit views)."""

    id: UUID
    user_id: UUID
    template_id: UUID | None
    ats_score: int
    matched_keywords: list[str]
    missing_keywords: list[str]
