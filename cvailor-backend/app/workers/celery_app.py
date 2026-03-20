from celery import Celery

from app.core.config import settings

celery_app = Celery(
    "cvailor",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.workers.tasks.ats_tasks",
        "app.workers.tasks.ai_tasks",
        "app.workers.tasks.export_tasks",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_routes={
        "app.workers.tasks.export_tasks.*": {"queue": "exports"},
        "app.workers.tasks.ats_tasks.*": {"queue": "ats"},
        "app.workers.tasks.ai_tasks.*": {"queue": "ai"},
    },
)
