import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.cv import CV
    from app.models.export_job import ExportJob
    from app.models.user_resume import UserResume

import enum


class UserPlan(str, enum.Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"


class OAuthProvider(str, enum.Enum):
    google = "google"
    github = "github"
    linkedin = "linkedin"


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str | None] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)

    plan: Mapped[UserPlan] = mapped_column(
        Enum(UserPlan), nullable=False, default=UserPlan.free
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    oauth_accounts: Mapped[list["UserOAuthAccount"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    cvs: Mapped[list["CV"]] = relationship(back_populates="user")
    resumes: Mapped[list["UserResume"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email}>"


class UserOAuthAccount(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "user_oauth_accounts"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    provider: Mapped[OAuthProvider] = mapped_column(Enum(OAuthProvider), nullable=False)
    provider_user_id: Mapped[str] = mapped_column(String(255), nullable=False)
    access_token: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    refresh_token: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship(back_populates="oauth_accounts")
