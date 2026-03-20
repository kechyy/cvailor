from uuid import UUID

from sqlalchemy import select, desc

from app.models.cv_version import CVVersion
from app.repositories.base import BaseRepository


class CVVersionRepository(BaseRepository[CVVersion]):
    model = CVVersion

    async def get_versions_for_cv(self, cv_id: UUID) -> list[CVVersion]:
        result = await self.db.execute(
            select(CVVersion)
            .where(CVVersion.cv_id == cv_id)
            .order_by(desc(CVVersion.version_number))
        )
        return list(result.scalars().all())

    async def get_version(self, cv_id: UUID, version_number: int) -> CVVersion | None:
        result = await self.db.execute(
            select(CVVersion).where(
                CVVersion.cv_id == cv_id,
                CVVersion.version_number == version_number,
            )
        )
        return result.scalar_one_or_none()

    async def get_latest(self, cv_id: UUID) -> CVVersion | None:
        result = await self.db.execute(
            select(CVVersion)
            .where(CVVersion.cv_id == cv_id)
            .order_by(desc(CVVersion.version_number))
            .limit(1)
        )
        return result.scalar_one_or_none()
