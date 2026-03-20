from uuid import UUID

from sqlalchemy import select, func, desc
from sqlalchemy.orm import selectinload

from app.models.cv import CV, CVStatus
from app.repositories.base import BaseRepository


class CVRepository(BaseRepository[CV]):
    model = CV

    async def get_by_id_for_user(self, cv_id: UUID, user_id: UUID) -> CV | None:
        result = await self.db.execute(
            select(CV)
            .where(CV.id == cv_id, CV.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_user_cvs(
        self,
        user_id: UUID,
        *,
        status: CVStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[CV]:
        q = select(CV).where(CV.user_id == user_id)
        if status:
            q = q.where(CV.status == status)
        q = q.order_by(desc(CV.updated_at)).limit(limit).offset(offset)
        result = await self.db.execute(q)
        return list(result.scalars().all())

    async def count_user_cvs(self, user_id: UUID) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(CV).where(CV.user_id == user_id)
        )
        return result.scalar_one()

    async def get_recent_for_user(self, user_id: UUID, *, limit: int = 5) -> list[CV]:
        result = await self.db.execute(
            select(CV)
            .where(CV.user_id == user_id, CV.status != CVStatus.archived)
            .order_by(desc(CV.updated_at))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_avg_ats_score(self, user_id: UUID) -> float | None:
        result = await self.db.execute(
            select(func.avg(CV.ats_score))
            .where(CV.user_id == user_id, CV.ats_score.isnot(None))
        )
        avg = result.scalar_one_or_none()
        return round(float(avg), 1) if avg is not None else None
