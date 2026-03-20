import uuid

from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.cv import CV


class CVVersion(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    Immutable snapshot of a CV's content at a point in time.
    Created automatically on every save of CVStatus.active CVs.
    """
    __tablename__ = "cv_versions"

    cv_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("cvs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)

    # Full content snapshot — identical structure to cv.content
    content: Mapped[dict] = mapped_column(JSONB, nullable=False)

    # Optional human-readable summary: "Added Google experience", "Updated summary"
    change_summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    cv: Mapped["CV"] = relationship(back_populates="versions")
