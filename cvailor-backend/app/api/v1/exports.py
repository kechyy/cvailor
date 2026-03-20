from uuid import UUID

from fastapi import APIRouter, status

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.export import ExportCreateRequest, ExportJobOut
from app.services.export import ExportService

router = APIRouter()


@router.post("/pdf", response_model=ExportJobOut, status_code=status.HTTP_202_ACCEPTED)
async def create_pdf_export(
    payload: ExportCreateRequest, db: DbSession, current_user: CurrentUser
) -> ExportJobOut:
    """
    Queue a PDF export job. Returns immediately with job_id and status=pending.
    Client polls GET /exports/{job_id} until status=completed.
    Used by /dashboard/download page.
    """
    payload.format = "pdf"
    return await ExportService(db).create_export(payload, current_user)


@router.get("/{job_id}", response_model=ExportJobOut)
async def get_export_status(
    job_id: UUID, db: DbSession, current_user: CurrentUser
) -> ExportJobOut:
    """
    Poll export job status. When status=completed, file_url contains
    a pre-signed S3 URL valid for the configured expiry window.
    """
    return await ExportService(db).get_export(job_id, current_user)
