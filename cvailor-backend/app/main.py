from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import settings
from app.core.logging import configure_logging, get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup and shutdown logic."""
    configure_logging()
    logger.info("cvailor_api_starting", env=settings.APP_ENV)
    yield
    logger.info("cvailor_api_shutdown")


def create_application() -> FastAPI:
    app = FastAPI(
        title="Cvailor API",
        description="AI-powered CV builder backend",
        version="0.1.0",
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
        lifespan=lifespan,
    )

    # ── Middleware ────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    # ── Routes ────────────────────────────────────────────────────────────────
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    # ── Health check ─────────────────────────────────────────────────────────
    @app.get("/health", tags=["health"], include_in_schema=False)
    async def health() -> JSONResponse:
        return JSONResponse({"status": "ok", "env": settings.APP_ENV})

    return app


app = create_application()
