"""
Export Service — manages PDF/DOCX export job lifecycle.

Flow:
  1. POST /exports/pdf → create ExportJob (status=pending)
  2. Dispatch Celery task: generate_export_task(job_id)
  3. Celery task: render CV → upload to S3 → update job to completed
  4. GET /exports/{job_id} → poll status + return file_url
"""
from datetime import UTC, datetime, timedelta
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.export_job import ExportFormat, ExportJob, ExportStatus
from app.models.user import User
from app.repositories.cv import CVRepository
from app.repositories.export_job import ExportJobRepository
from app.schemas.export import ExportCreateRequest, ExportJobOut


def _to_out(job: ExportJob) -> ExportJobOut:
    return ExportJobOut(
        id=job.id,
        cv_id=job.cv_id,
        format=job.format.value,
        status=job.status.value,
        file_url=job.file_url,
        file_size=job.file_size,
        error_message=job.error_message,
        expires_at=job.expires_at,
        created_at=job.created_at,
        updated_at=job.updated_at,
    )


class ExportService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.cv_repo = CVRepository(db)
        self.export_repo = ExportJobRepository(db)

    async def create_export(
        self, payload: ExportCreateRequest, user: User
    ) -> ExportJobOut:
        # Validate CV ownership
        cv = await self.cv_repo.get_by_id_for_user(payload.cv_id, user.id)
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")

        try:
            fmt = ExportFormat(payload.format)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Unsupported format: {payload.format}")

        expires_at = datetime.now(UTC) + timedelta(seconds=settings.S3_PRESIGNED_URL_EXPIRES)

        job = await self.export_repo.create(
            cv_id=payload.cv_id,
            user_id=user.id,
            format=fmt,
            status=ExportStatus.pending,
            expires_at=expires_at,
        )

        # Dispatch Celery task
        try:
            from app.workers.tasks.export_tasks import generate_export_task
            generate_export_task.delay(str(job.id))
        except Exception:
            # Don't fail the request if Celery is unreachable in dev
            pass

        return _to_out(job)

    async def get_export(self, job_id: UUID, user: User) -> ExportJobOut:
        job = await self.export_repo.get_by_id(job_id)
        if not job or job.user_id != user.id:
            raise HTTPException(status_code=404, detail="Export job not found")
        return _to_out(job)
