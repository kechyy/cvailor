from typing import Any, Generic, TypeVar
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """
    Generic repository providing standard CRUD operations.
    All business logic lives in services — repositories are pure DB access.
    """

    model: type[ModelT]

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, record_id: UUID) -> ModelT | None:
        result = await self.db.execute(select(self.model).where(self.model.id == record_id))
        return result.scalar_one_or_none()

    async def get_all(self, *, limit: int = 50, offset: int = 0) -> list[ModelT]:
        result = await self.db.execute(select(self.model).limit(limit).offset(offset))
        return list(result.scalars().all())

    async def create(self, **kwargs: Any) -> ModelT:
        instance = self.model(**kwargs)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def update(self, instance: ModelT, **kwargs: Any) -> ModelT:
        for key, value in kwargs.items():
            setattr(instance, key, value)
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def delete(self, instance: ModelT) -> None:
        await self.db.delete(instance)
        await self.db.flush()

    async def count(self) -> int:
        result = await self.db.execute(select(func.count()).select_from(self.model))
        return result.scalar_one()
