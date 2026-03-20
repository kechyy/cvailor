from pydantic import EmailStr, Field, field_validator

from app.schemas.common import BaseSchema
from app.schemas.user import UserOut


class RegisterRequest(BaseSchema):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=255)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() or c in "!@#$%^&*" for c in v):
            raise ValueError("Password must contain at least one digit or special character")
        return v


class LoginRequest(BaseSchema):
    email: EmailStr
    password: str


class TokenPair(BaseSchema):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefreshRequest(BaseSchema):
    refresh_token: str


class AuthResponse(BaseSchema):
    tokens: TokenPair
    user: UserOut


class OAuthCallbackRequest(BaseSchema):
    code: str
    redirect_uri: str
