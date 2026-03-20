from uuid import UUID

from sqlalchemy import select

from app.models.user_resume import UserResume
from app.repositories.base import BaseRepository


class UserResumeRepository(BaseRepository[UserResume]):
    model = UserResume

    async def get_by_user_and_template(
        self, user_id: UUID, template_id: UUID
    ) -> UserResume | None:
        result = await self.db.execute(
            select(UserResume).where(
                UserResume.user_id == user_id,
                UserResume.template_id == template_id,
            )
        )
        return result.scalar_one_or_none()

    async def list_for_user(self, user_id: UUID) -> list[UserResume]:
        result = await self.db.execute(
            select(UserResume).where(UserResume.user_id == user_id)
        )
        return list(result.scalars().all())
