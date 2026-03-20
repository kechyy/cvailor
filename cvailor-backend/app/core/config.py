from functools import lru_cache
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────────────────
    APP_ENV: Literal["development", "staging", "production"] = "development"
    APP_DEBUG: bool = False
    APP_SECRET_KEY: str = "dev-secret-change-in-production"
    API_V1_PREFIX: str = "/api/v1"

    # ── Database ─────────────────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://cvailor:cvailor@localhost:5432/cvailor"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20

    # ── JWT ──────────────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = "dev-jwt-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ── Redis / Celery ────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # ── AI ───────────────────────────────────────────────────────────────────
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    AI_DEFAULT_PROVIDER: Literal["anthropic", "openai"] = "anthropic"
    AI_MODEL_FAST: str = "claude-haiku-4-5-20251001"
    AI_MODEL_POWERFUL: str = "claude-sonnet-4-6"

    # ── CV Tailor (GPT-4 feature) ─────────────────────────────────────────────
    CV_TAILOR_DAILY_LIMIT: int = 10
    CV_TAILOR_MODEL: str = "gpt-4-turbo"

    # ── AWS S3 ───────────────────────────────────────────────────────────────
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "eu-west-1"
    S3_BUCKET_NAME: str = "cvailor-exports"
    S3_PRESIGNED_URL_EXPIRES: int = 3600

    # ── OAuth ─────────────────────────────────────────────────────────────────
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""

    # ── CORS ──────────────────────────────────────────────────────────────────
    CORS_ORIGINS: str = "http://localhost:3000"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors(cls, v: str) -> str:
        return v  # stored as string; parsed in main.py

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
