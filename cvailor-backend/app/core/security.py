from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Password ──────────────────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── JWT ───────────────────────────────────────────────────────────────────────

def create_access_token(subject: str | Any, extra: dict | None = None) -> str:
    expire = datetime.now(UTC) + timedelta(
        minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": str(subject), "exp": expire, "type": "access"}
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: str | Any) -> str:
    expire = datetime.now(UTC) + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": str(subject), "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT. Raises JWTError on failure."""
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])


def decode_access_token(token: str) -> str:
    """Return user ID (sub) from a valid access token."""
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise JWTError("Not an access token")
        subject: str = payload["sub"]
        return subject
    except (JWTError, KeyError) as exc:
        raise JWTError("Invalid access token") from exc


def decode_refresh_token(token: str) -> str:
    """Return user ID (sub) from a valid refresh token."""
    try:
        payload = decode_token(token)
        if payload.get("type") != "refresh":
            raise JWTError("Not a refresh token")
        return payload["sub"]
    except (JWTError, KeyError) as exc:
        raise JWTError("Invalid refresh token") from exc
