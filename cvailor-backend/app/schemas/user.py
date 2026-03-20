from datetime import datetime
from uuid import UUID

from pydantic import EmailStr, Field

from app.schemas.common import BaseSchema, TimestampSchema


class UserOut(TimestampSchema):
    id: UUID
    email: EmailStr
    full_name: str
    avatar_url: str | None = None
    plan: str
    is_active: bool
    is_verified: bool


class UserUpdateRequest(BaseSchema):
    full_name: str | None = Field(None, min_length=1, max_length=255)
    avatar_url: str | None = None
