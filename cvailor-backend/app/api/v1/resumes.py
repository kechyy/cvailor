from uuid import UUID

from fastapi import APIRouter

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.resume import UserResumeOut, UserResumeUpdateIn
from app.services.user_resume import UserResumeService

router = APIRouter()


@router.get("/template/by-slug/{template_slug}", response_model=UserResumeOut)
async def get_or_create_resume_by_slug(
    template_slug: str,
    db: DbSession,
    current_user: CurrentUser,
) -> UserResumeOut:
    """
    Get or create the authenticated user's resume for the given template slug.
    Creates an empty record if one does not exist yet (copy-on-write).
    Accepts a slug (e.g. "modern") so the frontend can use its already-known slug.
    """
    return await UserResumeService(db).get_or_create_by_slug(template_slug, current_user)


@router.patch("/{resume_id}", response_model=UserResumeOut)
async def update_resume(
    resume_id: UUID,
    payload: UserResumeUpdateIn,
    db: DbSession,
    current_user: CurrentUser,
) -> UserResumeOut:
    """
    Persist updated CV content for a user's resume.
    Called by the debounced auto-save in the editor (every 500 ms of inactivity).
    """
    return await UserResumeService(db).update(resume_id, payload, current_user)
