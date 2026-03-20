import uuid
import enum

from sqlalchemy import Enum, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class SuggestionType(str, enum.Enum):
    summary = "summary"
    experience_bullet = "experience_bullet"
    tailor_cv = "tailor_cv"
    cover_letter = "cover_letter"
    extract_keywords = "extract_keywords"
    template_recommendation = "template_recommendation"


class AISuggestion(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    Audit log of every AI generation call.
    Supports usage tracking, debugging, and future caching.
    """
    __tablename__ = "ai_suggestions"

    cv_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("cvs.id", ondelete="SET NULL"), nullable=True, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    suggestion_type: Mapped[SuggestionType] = mapped_column(
        Enum(SuggestionType), nullable=False, index=True
    )

    # Full input sent to the model (for debugging / replayability)
    input_payload: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Full output from the model
    output_payload: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    model_used: Mapped[str] = mapped_column(String(100), nullable=False)
    tokens_used: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
