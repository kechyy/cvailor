from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserOut, UserUpdateRequest


class UserService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.user_repo = UserRepository(db)

    async def get_profile(self, user: User) -> UserOut:
        return UserOut.model_validate(user)

    async def update_profile(self, user: User, payload: UserUpdateRequest) -> UserOut:
        updates = payload.model_dump(exclude_none=True)
        if not updates:
            return UserOut.model_validate(user)

        updated = await self.user_repo.update(user, **updates)
        return UserOut.model_validate(updated)
