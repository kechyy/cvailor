from uuid import UUID

from sqlalchemy import select, desc

from app.models.ats_analysis import ATSAnalysisRun
from app.repositories.base import BaseRepository


class ATSAnalysisRepository(BaseRepository[ATSAnalysisRun]):
    model = ATSAnalysisRun

    async def get_latest_for_cv(self, cv_id: UUID) -> ATSAnalysisRun | None:
        result = await self.db.execute(
            select(ATSAnalysisRun)
            .where(ATSAnalysisRun.cv_id == cv_id)
            .order_by(desc(ATSAnalysisRun.created_at))
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def get_all_for_cv(self, cv_id: UUID) -> list[ATSAnalysisRun]:
        result = await self.db.execute(
            select(ATSAnalysisRun)
            .where(ATSAnalysisRun.cv_id == cv_id)
            .order_by(desc(ATSAnalysisRun.created_at))
        )
        return list(result.scalars().all())
