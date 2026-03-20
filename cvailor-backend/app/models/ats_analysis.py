import uuid

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.cv import CV
    from app.models.user import User


class ATSAnalysisRun(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    One ATS analysis result for a CV, optionally against a job description.

    score_breakdown mirrors the frontend ScoreBreakdown type:
      { keywordsMatch, experienceFit, skillsAlignment, summaryStrength }
    """
    __tablename__ = "ats_analysis_runs"

    cv_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("cvs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    # The job description used for keyword matching (nullable for generic analysis)
    job_description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Overall 0-100 score
    ats_score: Mapped[int] = mapped_column(Integer, nullable=False)

    # { keywordsMatch: int, experienceFit: int, skillsAlignment: int, summaryStrength: int }
    score_breakdown: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Keyword arrays matching the frontend KeywordChips component
    matched_keywords: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    missing_keywords: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)

    # Actionable improvement tips — list[str]
    tips: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)

    # Track which analysis version/model produced this result
    analysis_version: Mapped[str] = mapped_column(String(50), nullable=False, default="v1")

    cv: Mapped["CV"] = relationship(back_populates="ats_runs")
