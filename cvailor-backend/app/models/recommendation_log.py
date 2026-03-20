import uuid
from typing import Optional

from sqlalchemy import Boolean, Float, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class RecommendationLog(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    Tracks every template recommendation made by the recommendation engine.
    Supports A/B testing and feedback loops for improving recommendation quality.
    """
    __tablename__ = "recommendation_logs"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    cv_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("cvs.id", ondelete="SET NULL"), nullable=True
    )
    recommended_template_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("templates.id", ondelete="CASCADE"), nullable=False
    )

    reason: Mapped[str] = mapped_column(Text, nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)

    # Input context used for the recommendation decision
    input_factors: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Null = not yet interacted with; True = user selected it; False = user ignored it
    was_accepted: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
