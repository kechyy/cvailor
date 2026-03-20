"""
ATS Celery tasks.

Use case: batch ATS re-scoring when the analysis engine is updated.
Async ATS review (for long JDs) can also be offloaded here.
"""
import asyncio
from uuid import UUID

from app.workers.celery_app import celery_app
from app.core.logging import get_logger

logger = get_logger(__name__)


@celery_app.task(bind=True, name="ats.run_analysis", max_retries=3, default_retry_delay=30)
def run_ats_analysis_task(self, cv_id: str, user_id: str, job_description: str | None = None):
    """
    Asynchronous ATS analysis task.
    Runs the same ATSService.review() logic but from a background worker.
    """
    from app.core.database import AsyncSessionLocal
    from app.services.ats import ATSService
    from app.repositories.user import UserRepository
    from app.schemas.ats import ATSReviewRequest

    async def _run():
        async with AsyncSessionLocal() as db:
            user_repo = UserRepository(db)
            user = await user_repo.get_by_id(UUID(user_id))
            if not user:
                logger.error("ats_task_user_not_found", user_id=user_id)
                return

            service = ATSService(db)
            payload = ATSReviewRequest(cv_id=UUID(cv_id), job_description=job_description)
            result = await service.review(payload, user)
            logger.info("ats_task_complete", cv_id=cv_id, score=result.ats_score)

    try:
        asyncio.run(_run())
    except Exception as exc:
        logger.error("ats_task_failed", cv_id=cv_id, error=str(exc))
        raise self.retry(exc=exc)
