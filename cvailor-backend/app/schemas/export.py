from datetime import datetime
from uuid import UUID

from app.schemas.common import BaseSchema


class ExportCreateRequest(BaseSchema):
    cv_id: UUID
    format: str = "pdf"   # pdf | docx


class ExportJobOut(BaseSchema):
    id: UUID
    cv_id: UUID
    format: str
    status: str
    file_url: str | None
    file_size: int | None
    error_message: str | None
    expires_at: datetime | None
    created_at: datetime
    updated_at: datetime
