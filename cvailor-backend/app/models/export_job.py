import uuid
import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.cv import CV
    from app.models.user import User


class ExportFormat(str, enum.Enum):
    pdf = "pdf"
    docx = "docx"


class ExportStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class ExportJob(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "export_jobs"

    cv_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("cvs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    format: Mapped[ExportFormat] = mapped_column(Enum(ExportFormat), nullable=False)
    status: Mapped[ExportStatus] = mapped_column(
        Enum(ExportStatus), nullable=False, default=ExportStatus.pending, index=True
    )

    # S3 pre-signed URL or CDN URL once completed
    file_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)

    # URL expires after N seconds (configurable in settings)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    cv: Mapped["CV"] = relationship(back_populates="export_jobs")
