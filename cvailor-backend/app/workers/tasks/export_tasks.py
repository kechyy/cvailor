"""
Export Celery tasks.

Flow:
  1. API creates ExportJob with status=pending
  2. This task is dispatched with the job ID
  3. Task renders the CV to PDF using headless Chrome (playwright) or WeasyPrint
  4. Uploads the PDF to S3
  5. Updates ExportJob with file_url and status=completed

Note: For Phase 1, this task logs a placeholder.
      Phase 2: integrate playwright PDF render or WeasyPrint.
"""
import asyncio
from uuid import UUID

from app.workers.celery_app import celery_app
from app.core.logging import get_logger

logger = get_logger(__name__)


@celery_app.task(bind=True, name="exports.generate", max_retries=3, default_retry_delay=15)
def generate_export_task(self, job_id: str):
    """
    Generate PDF export and upload to S3.
    Updates the ExportJob record with the final file_url.
    """
    from app.core.database import AsyncSessionLocal
    from app.repositories.export_job import ExportJobRepository
    from app.models.export_job import ExportStatus

    async def _run():
        async with AsyncSessionLocal() as db:
            repo = ExportJobRepository(db)
            job = await repo.get_by_id(UUID(job_id))

            if not job:
                logger.error("export_task_job_not_found", job_id=job_id)
                return

            await repo.update(job, status=ExportStatus.processing)

            try:
                # ── Phase 1 placeholder ──────────────────────────────────────
                # TODO: Replace with actual render pipeline:
                #   1. Fetch CV content from DB
                #   2. Render HTML using the template registry
                #   3. Use playwright or WeasyPrint to generate PDF bytes
                #   4. Upload bytes to S3 using boto3
                #   5. Generate pre-signed URL
                # ─────────────────────────────────────────────────────────────

                import boto3
                # Placeholder: mark as completed with a placeholder URL
                file_url = f"https://placeholder.s3.amazonaws.com/exports/{job_id}.pdf"

                await repo.update(
                    job,
                    status=ExportStatus.completed,
                    file_url=file_url,
                    file_size=0,
                )
                logger.info("export_task_complete", job_id=job_id, file_url=file_url)

            except Exception as exc:
                await repo.update(
                    job,
                    status=ExportStatus.failed,
                    error_message=str(exc),
                )
                logger.error("export_task_render_failed", job_id=job_id, error=str(exc))
                raise

    try:
        asyncio.run(_run())
    except Exception as exc:
        raise self.retry(exc=exc)
