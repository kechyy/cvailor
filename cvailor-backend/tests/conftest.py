"""
Test configuration and fixtures.

Uses an in-memory SQLite database for speed.
Each test gets a clean session via function-scoped fixtures.
"""
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.dependencies import get_current_user
from app.core.database import get_db
from app.main import app
from app.models.base import Base
from app.models.user import User

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture(scope="session")
async def engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def db(engine) -> AsyncSession:
    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )
    async with session_factory() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def test_user(db: AsyncSession) -> User:
    from app.core.security import hash_password
    from app.repositories.user import UserRepository

    repo = UserRepository(db)
    user = await repo.create(
        email="test@cvailor.com",
        hashed_password=hash_password("TestPass1!"),
        full_name="Test User",
        is_verified=True,
        is_active=True,
    )
    return user


@pytest_asyncio.fixture
async def client(db: AsyncSession, test_user: User) -> AsyncClient:
    """HTTP test client with authentication pre-wired."""

    async def override_get_db():
        yield db

    async def override_get_current_user():
        return test_user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as c:
        yield c

    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def unauthed_client() -> AsyncClient:
    """HTTP test client without authentication."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as c:
        yield c
