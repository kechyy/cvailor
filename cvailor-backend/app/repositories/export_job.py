from uuid import UUID

from sqlalchemy import select, desc

from app.models.export_job import ExportJob, ExportStatus
from app.repositories.base import BaseRepository


class ExportJobRepository(BaseRepository[ExportJob]):
    model = ExportJob

    async def get_for_user(self, user_id: UUID, *, limit: int = 20) -> list[ExportJob]:
        result = await self.db.execute(
            select(ExportJob)
            .where(ExportJob.user_id == user_id)
            .order_by(desc(ExportJob.created_at))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_pending(self) -> list[ExportJob]:
        result = await self.db.execute(
            select(ExportJob).where(ExportJob.status == ExportStatus.pending)
        )
        return list(result.scalars().all())
