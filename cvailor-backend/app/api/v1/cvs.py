from uuid import UUID

from fastapi import APIRouter, status

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.common import MessageResponse
from app.schemas.cv import (
    CVCreateRequest,
    CVOut,
    CVSelectTemplateRequest,
    CVSummary,
    CVUpdateRequest,
)
from app.services.cv import CVService

router = APIRouter()


@router.post("", response_model=CVOut, status_code=status.HTTP_201_CREATED)
async def create_cv(
    payload: CVCreateRequest,
    db: DbSession,
    current_user: CurrentUser,
) -> CVOut:
    """
    Create a new CV. Called at the end of the 5-step CV builder flow.
    Also creates the first version snapshot automatically.
    """
    return await CVService(db).create(current_user, payload)


@router.get("", response_model=list[CVSummary])
async def list_cvs(db: DbSession, current_user: CurrentUser) -> list[CVSummary]:
    """Return all CVs for the authenticated user. Used by /dashboard/cvs page."""
    return await CVService(db).list_for_user(current_user)


@router.get("/{cv_id}", response_model=CVOut)
async def get_cv(cv_id: UUID, db: DbSession, current_user: CurrentUser) -> CVOut:
    """Return full CV content including all sections. Used by editor and preview pages."""
    return await CVService(db).get(cv_id, current_user)


@router.patch("/{cv_id}", response_model=CVOut)
async def update_cv(
    cv_id: UUID,
    payload: CVUpdateRequest,
    db: DbSession,
    current_user: CurrentUser,
) -> CVOut:
    """
    Partial update of CV content, title, template, or status.
    Creates a new version snapshot on each successful save.
    """
    return await CVService(db).update(cv_id, current_user, payload)


@router.delete("/{cv_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cv(cv_id: UUID, db: DbSession, current_user: CurrentUser) -> None:
    """Permanently delete a CV and all its versions/exports."""
    await CVService(db).delete(cv_id, current_user)


@router.post("/{cv_id}/select-template", response_model=CVOut)
async def select_template(
    cv_id: UUID,
    payload: CVSelectTemplateRequest,
    db: DbSession,
    current_user: CurrentUser,
) -> CVOut:
    """
    Associate a template with a CV. Called when user selects a template
    on /dashboard/templates and is linked to a specific CV.
    """
    return await CVService(db).select_template(cv_id, current_user, payload)


@router.post("/{cv_id}/duplicate", response_model=CVOut, status_code=status.HTTP_201_CREATED)
async def duplicate_cv(cv_id: UUID, db: DbSession, current_user: CurrentUser) -> CVOut:
    """Create a copy of an existing CV with all its content."""
    return await CVService(db).duplicate(cv_id, current_user)
