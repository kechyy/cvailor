from uuid import UUID

from sqlalchemy import select

from app.models.user import OAuthProvider, User, UserOAuthAccount
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_oauth(
        self, provider: OAuthProvider, provider_user_id: str
    ) -> User | None:
        result = await self.db.execute(
            select(User)
            .join(UserOAuthAccount, UserOAuthAccount.user_id == User.id)
            .where(
                UserOAuthAccount.provider == provider,
                UserOAuthAccount.provider_user_id == provider_user_id,
            )
        )
        return result.scalar_one_or_none()

    async def email_exists(self, email: str) -> bool:
        user = await self.get_by_email(email)
        return user is not None


class OAuthAccountRepository(BaseRepository[UserOAuthAccount]):
    model = UserOAuthAccount

    async def get_by_provider(
        self, user_id: UUID, provider: OAuthProvider
    ) -> UserOAuthAccount | None:
        result = await self.db.execute(
            select(UserOAuthAccount).where(
                UserOAuthAccount.user_id == user_id,
                UserOAuthAccount.provider == provider,
            )
        )
        return result.scalar_one_or_none()
