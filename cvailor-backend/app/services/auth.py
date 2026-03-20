from fastapi import HTTPException, status
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, TokenPair
from app.schemas.user import UserOut


class AuthService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.user_repo = UserRepository(db)

    async def register(self, payload: RegisterRequest) -> AuthResponse:
        if await self.user_repo.email_exists(payload.email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )

        user = await self.user_repo.create(
            email=payload.email,
            hashed_password=hash_password(payload.password),
            full_name=payload.full_name,
            is_verified=False,
        )

        tokens = self._issue_tokens(user)
        return AuthResponse(tokens=tokens, user=UserOut.model_validate(user))

    async def login(self, payload: LoginRequest) -> AuthResponse:
        user = await self.user_repo.get_by_email(payload.email)

        if not user or not user.hashed_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        if not verify_password(payload.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is disabled",
            )

        tokens = self._issue_tokens(user)
        return AuthResponse(tokens=tokens, user=UserOut.model_validate(user))

    async def refresh(self, refresh_token: str) -> TokenPair:
        try:
            user_id_str = decode_refresh_token(refresh_token)
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        from uuid import UUID
        user = await self.user_repo.get_by_id(UUID(user_id_str))
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
            )

        return self._issue_tokens(user)

    def _issue_tokens(self, user: User) -> TokenPair:
        return TokenPair(
            access_token=create_access_token(str(user.id)),
            refresh_token=create_refresh_token(str(user.id)),
        )
