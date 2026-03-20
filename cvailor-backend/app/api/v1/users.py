from fastapi import APIRouter

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.user import UserOut, UserUpdateRequest
from app.services.user import UserService

router = APIRouter()


@router.get("/me", response_model=UserOut)
async def get_me(current_user: CurrentUser, db: DbSession) -> UserOut:
    """Return the authenticated user's full profile."""
    return await UserService(db).get_profile(current_user)


@router.patch("/me", response_model=UserOut)
async def update_me(
    payload: UserUpdateRequest,
    current_user: CurrentUser,
    db: DbSession,
) -> UserOut:
    """Update mutable profile fields (full_name, avatar_url)."""
    return await UserService(db).update_profile(current_user, payload)
