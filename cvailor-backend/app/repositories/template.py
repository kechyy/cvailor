from sqlalchemy import select
from sqlalchemy.dialects.postgresql import JSONB

from app.models.template import Template
from app.repositories.base import BaseRepository


class TemplateRepository(BaseRepository[Template]):
    model = Template

    async def get_by_slug(self, slug: str) -> Template | None:
        result = await self.db.execute(select(Template).where(Template.slug == slug))
        return result.scalar_one_or_none()

    async def get_active(self) -> list[Template]:
        result = await self.db.execute(
            select(Template)
            .where(Template.is_active == True)  # noqa: E712
            .order_by(Template.sort_order)
        )
        return list(result.scalars().all())

    async def get_by_category(self, category: str) -> list[Template]:
        """Filter templates where the given category is in the categories JSONB array."""
        result = await self.db.execute(
            select(Template)
            .where(
                Template.is_active == True,  # noqa: E712
                Template.categories.cast(JSONB).contains([category]),
            )
            .order_by(Template.sort_order)
        )
        return list(result.scalars().all())

    async def get_many_by_ids(self, ids: list) -> list[Template]:
        from uuid import UUID
        result = await self.db.execute(
            select(Template).where(Template.id.in_(ids))
        )
        return list(result.scalars().all())
