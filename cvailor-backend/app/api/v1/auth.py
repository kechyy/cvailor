from fastapi import APIRouter, Depends

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    TokenPair,
    TokenRefreshRequest,
)
from app.schemas.user import UserOut
from app.services.auth import AuthService

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=201)
async def register(payload: RegisterRequest, db: DbSession) -> AuthResponse:
    """Create a new account. Returns token pair + user profile."""
    return await AuthService(db).register(payload)


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, db: DbSession) -> AuthResponse:
    """Authenticate with email/password. Returns token pair + user profile."""
    return await AuthService(db).login(payload)


@router.post("/refresh", response_model=TokenPair)
async def refresh(payload: TokenRefreshRequest, db: DbSession) -> TokenPair:
    """Exchange a refresh token for a new token pair."""
    return await AuthService(db).refresh(payload.refresh_token)


@router.post("/logout")
async def logout(current_user: CurrentUser) -> dict:
    """
    Client-side logout. Tokens are stateless JWTs — client discards them.
    Future: add a token denylist via Redis for early revocation.
    """
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserOut)
async def me(current_user: CurrentUser) -> UserOut:
    """Return the authenticated user's profile."""
    return UserOut.model_validate(current_user)
