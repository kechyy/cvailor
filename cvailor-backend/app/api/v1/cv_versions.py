from uuid import UUID

from fastapi import APIRouter

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.cv_version import CVVersionList, CVVersionOut
from app.services.cv_version import CVVersionService

router = APIRouter()


@router.get("/{cv_id}/versions", response_model=CVVersionList)
async def list_versions(
    cv_id: UUID, db: DbSession, current_user: CurrentUser
) -> CVVersionList:
    """Return all saved versions of a CV in reverse chronological order."""
    return await CVVersionService(db).list_versions(cv_id, current_user.id)


@router.get("/{cv_id}/versions/{version_id}", response_model=CVVersionOut)
async def get_version(
    cv_id: UUID, version_id: UUID, db: DbSession, current_user: CurrentUser
) -> CVVersionOut:
    """Return a specific version snapshot."""
    return await CVVersionService(db).get_version(cv_id, version_id, current_user.id)


@router.post("/{cv_id}/restore-version/{version_id}", response_model=CVVersionOut)
async def restore_version(
    cv_id: UUID, version_id: UUID, db: DbSession, current_user: CurrentUser
) -> CVVersionOut:
    """
    Restore a historic version. Writes its content back to the CV
    and creates a new version snapshot labelled 'Restored from version N'.
    """
    return await CVVersionService(db).restore_version(cv_id, version_id, current_user.id)
