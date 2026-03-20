import uuid
import enum

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class JobMatchStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"


class JobMatchRun(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    Future-ready scaffold for job-tailoring feature.
    Stores the result of matching a CV against a specific job posting.
    Not wired to the main flow yet — designed to integrate cleanly later.
    """
    __tablename__ = "job_match_runs"

    cv_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("cvs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    job_title: Mapped[str] = mapped_column(String(300), nullable=False)
    company_name: Mapped[str | None] = mapped_column(String(300), nullable=True)
    job_description: Mapped[str] = mapped_column(Text, nullable=False)

    match_score: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # { matched: [...], gaps: [...] }
    key_matches: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    gaps: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Optional tailored CV content produced by the AI
    tailored_content: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    status: Mapped[JobMatchStatus] = mapped_column(
        Enum(JobMatchStatus), nullable=False, default=JobMatchStatus.pending
    )
