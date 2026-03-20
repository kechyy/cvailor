"""
AI Celery tasks — for long-running AI operations that should not block HTTP requests.

Primary use case: CV tailoring (can take 10–30s with large CVs).
"""
import asyncio
from uuid import UUID

from app.workers.celery_app import celery_app
from app.core.logging import get_logger

logger = get_logger(__name__)


@celery_app.task(bind=True, name="ai.tailor_cv", max_retries=2, default_retry_delay=60)
def tailor_cv_task(self, cv_id: str, user_id: str, job_description: str, target_company: str | None = None):
    """
    Background CV tailoring task.
    Stores the result in the ai_suggestions table.
    Client can poll or receive via WebSocket (future).
    """
    from app.core.database import AsyncSessionLocal
    from app.services.ai import AIService
    from app.repositories.user import UserRepository
    from app.schemas.ai import TailorCVRequest

    async def _run():
        async with AsyncSessionLocal() as db:
            user_repo = UserRepository(db)
            user = await user_repo.get_by_id(UUID(user_id))
            if not user:
                return

            service = AIService(db)
            payload = TailorCVRequest(
                cv_id=UUID(cv_id),
                job_description=job_description,
                target_company=target_company,
            )
            result = await service.tailor_cv(payload, user)
            logger.info(
                "ai_tailor_task_complete",
                cv_id=cv_id,
                changes_count=len(result.changes_summary),
            )

    try:
        asyncio.run(_run())
    except Exception as exc:
        logger.error("ai_tailor_task_failed", cv_id=cv_id, error=str(exc))
        raise self.retry(exc=exc)
