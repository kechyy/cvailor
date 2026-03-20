import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.template import Template


class UserResume(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    Per-user copy-on-write resume content for a given template.

    One record per (user, template) pair.  When a user first opens the editor
    for a template, a new record is created with empty/default content.
    All subsequent edits are saved here; the canonical template record is
    never modified.
    """
    __tablename__ = "user_resumes"
    __table_args__ = (
        UniqueConstraint("user_id", "template_id", name="uq_user_resumes_user_template"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    template_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("templates.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Full CV content — same shape as the frontend CVData type:
    # { personal: {...}, experience: [...], education: [...],
    #   skills: [...], languages: [...], certifications: [...], jobContext: {...} }
    content: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="resumes")
    template: Mapped["Template"] = relationship()

    def __repr__(self) -> str:
        return f"<UserResume user_id={self.user_id} template_id={self.template_id}>"
