from sqlalchemy import Boolean, Enum, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

import enum
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.cv import CV


class TemplateLayout(str, enum.Enum):
    single = "single"
    sidebar_left = "sidebar-left"
    sidebar_right = "sidebar-right"


class Template(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    """
    CV template catalog record. Seeded on startup; not created by end users.

    categories and experience_levels are stored as JSONB arrays to support
    multi-category filtering without a junction table.
    """
    __tablename__ = "templates"

    # Identity
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    # Classification — drives category tab filtering
    # Primary category for default sort; categories[] for multi-filter
    primary_category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    categories: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    experience_levels: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    tags: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)

    # Visual / UX
    accent_color: Mapped[str] = mapped_column(String(20), nullable=False, default="#000000")
    layout: Mapped[TemplateLayout] = mapped_column(
        Enum(TemplateLayout, values_callable=lambda obj: [e.value for e in obj]),
        nullable=False,
        default=TemplateLayout.single,
    )
    preview_image_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)

    # ATS & recommendation
    ats_score: Mapped[int] = mapped_column(Integer, nullable=False, default=90)
    industry_reason: Mapped[str] = mapped_column(Text, nullable=False, default="")

    # Admin
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Flexible extra data (future: pricing tier, pro-only flag, etc.)
    extra_meta: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)

    # Relationships
    cvs: Mapped[list["CV"]] = relationship(back_populates="template")

    def __repr__(self) -> str:
        return f"<Template slug={self.slug}>"
