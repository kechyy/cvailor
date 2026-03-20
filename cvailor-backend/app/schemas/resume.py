from uuid import UUID

from app.schemas.common import BaseSchema, TimestampSchema


class UserResumeOut(TimestampSchema):
    id: UUID
    user_id: UUID
    template_id: UUID
    content: dict


class UserResumeUpdateIn(BaseSchema):
    content: dict
