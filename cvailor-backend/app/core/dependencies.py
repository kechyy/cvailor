from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.repositories.user import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    """Extract and validate JWT; return the active User record."""
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise unauthorized

    try:
        user_id_str = decode_access_token(credentials.credentials)
        user_id = UUID(user_id_str)
    except (JWTError, ValueError):
        raise unauthorized

    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)

    if user is None or not user.is_active:
        raise unauthorized

    return user


async def get_current_verified_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Same as get_current_user but also enforces email verification."""
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email address not verified",
        )
    return current_user


# ── Convenient type aliases for route signatures ──────────────────────────────
DbSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]
VerifiedUser = Annotated[User, Depends(get_current_verified_user)]
