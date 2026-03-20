"""
CvTailorHistory model — immutable audit record of every GPT-4 tailoring session.

One row is written per successful tailor call. Both the original and tailored
CV content are stored so neither version is ever destroyed. The table is also
used to enforce the per-user daily rate limit via a COUNT query.
"""
import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.user import User


class CvTailorHistory(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    Immutable record of a single CV tailoring session.

    - original_cv_content  preserves the user's CV exactly as submitted.
    - tailored_cv_content  stores the GPT-4 output mapped to CVContent shape.
    - Deleting the user cascades and removes all their history records.
    """

    __tablename__ = "cv_tailor_history"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    template_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("templates.id", ondelete="SET NULL"),
        nullable=True,
    )

    original_cv_content: Mapped[dict] = mapped_column(JSONB, nullable=False)
    tailored_cv_content: Mapped[dict] = mapped_column(JSONB, nullable=False)
    job_description: Mapped[str] = mapped_column(Text, nullable=False)

    ats_score: Mapped[int] = mapped_column(Integer, nullable=False)
    matched_keywords: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    missing_keywords: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    improvements_made: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    suggestions: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)

    # Relationships
    user: Mapped["User"] = relationship()

    def __repr__(self) -> str:
        return (
            f"<CvTailorHistory id={self.id} "
            f"user_id={self.user_id} ats_score={self.ats_score}>"
        )
