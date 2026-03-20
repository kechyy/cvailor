from datetime import datetime
from uuid import UUID

from app.schemas.common import BaseSchema
from app.schemas.cv import CVContent


class CVVersionOut(BaseSchema):
    id: UUID
    cv_id: UUID
    version_number: int
    content: CVContent
    change_summary: str | None
    created_at: datetime


class CVVersionList(BaseSchema):
    cv_id: UUID
    versions: list[CVVersionOut]
    total: int
