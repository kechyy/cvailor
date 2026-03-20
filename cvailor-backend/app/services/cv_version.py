from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.cv import CVRepository
from app.repositories.cv_version import CVVersionRepository
from app.schemas.cv import CVContent
from app.schemas.cv_version import CVVersionList, CVVersionOut


class CVVersionService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.cv_repo = CVRepository(db)
        self.version_repo = CVVersionRepository(db)

    async def list_versions(self, cv_id: UUID, user_id: UUID) -> CVVersionList:
        await self._assert_ownership(cv_id, user_id)
        versions = await self.version_repo.get_versions_for_cv(cv_id)
        return CVVersionList(
            cv_id=cv_id,
            total=len(versions),
            versions=[self._to_out(v) for v in versions],
        )

    async def get_version(
        self, cv_id: UUID, version_id: UUID, user_id: UUID
    ) -> CVVersionOut:
        await self._assert_ownership(cv_id, user_id)
        version = await self.version_repo.get_by_id(version_id)
        if not version or version.cv_id != cv_id:
            raise HTTPException(status_code=404, detail="Version not found")
        return self._to_out(version)

    async def restore_version(
        self, cv_id: UUID, version_id: UUID, user_id: UUID
    ) -> CVVersionOut:
        """Restore a historic version by writing its content back to the CV."""
        await self._assert_ownership(cv_id, user_id)
        version = await self.version_repo.get_by_id(version_id)
        if not version or version.cv_id != cv_id:
            raise HTTPException(status_code=404, detail="Version not found")

        cv = await self.cv_repo.get_by_id(cv_id)
        new_version_number = cv.current_version + 1
        cv = await self.cv_repo.update(
            cv,
            content=version.content,
            current_version=new_version_number,
        )

        # Snapshot the restored state
        new_snapshot = await self.version_repo.create(
            cv_id=cv_id,
            version_number=new_version_number,
            content=version.content,
            change_summary=f"Restored from version {version.version_number}",
        )
        return self._to_out(new_snapshot)

    async def _assert_ownership(self, cv_id: UUID, user_id: UUID) -> None:
        cv = await self.cv_repo.get_by_id_for_user(cv_id, user_id)
        if not cv:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CV not found")

    @staticmethod
    def _to_out(version) -> CVVersionOut:
        return CVVersionOut(
            id=version.id,
            cv_id=version.cv_id,
            version_number=version.version_number,
            content=CVContent.model_validate(version.content),
            change_summary=version.change_summary,
            created_at=version.created_at,
        )
