import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

import enum

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.template import Template
    from app.models.cv_version import CVVersion
    from app.models.ats_analysis import ATSAnalysisRun
    from app.models.export_job import ExportJob


class CVStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    archived = "archived"


class CV(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    Central CV record. CV content is stored as structured JSONB.

    Rationale for JSONB over normalized tables:
    - CV sections (experience, education, skills) evolve freely per user.
    - Frontend renders directly from this JSON structure.
    - ATS/AI services consume and return JSON payloads.
    - Versioning is snapshot-based — each CVVersion stores a full content copy.
    - Avoids 10-table join queries for a single CV render.
    - Schema can evolve without migrations when adding optional fields.
    """
    __tablename__ = "cvs"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    template_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("templates.id", ondelete="SET NULL"), nullable=True
    )

    # User-facing name: "Google SWE 2025", "Meta UX Lead"
    title: Mapped[str] = mapped_column(String(300), nullable=False, default="Untitled CV")
    slug: Mapped[str | None] = mapped_column(String(350), nullable=True, index=True)

    # The full CV content — maps exactly to the frontend CVData type:
    # { personal: {...}, experience: [...], education: [...],
    #   skills: [...], languages: [...], certifications: [...], jobContext: {...} }
    content: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    status: Mapped[CVStatus] = mapped_column(
        Enum(CVStatus), nullable=False, default=CVStatus.draft, index=True
    )

    # Cached ATS score from the latest analysis run; nullable until first analysis
    ats_score: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Tracks the most recent version number for display purposes
    current_version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="cvs")
    template: Mapped["Template | None"] = relationship(back_populates="cvs")
    versions: Mapped[list["CVVersion"]] = relationship(
        back_populates="cv", cascade="all, delete-orphan", order_by="CVVersion.version_number"
    )
    ats_runs: Mapped[list["ATSAnalysisRun"]] = relationship(
        back_populates="cv", cascade="all, delete-orphan"
    )
    export_jobs: Mapped[list["ExportJob"]] = relationship(
        back_populates="cv", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<CV id={self.id} title={self.title!r}>"
