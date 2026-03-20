"""Repository for CvTailorHistory records."""
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import func, select

from app.models.cv_tailor_history import CvTailorHistory
from app.repositories.base import BaseRepository


class CvTailorHistoryRepository(BaseRepository[CvTailorHistory]):
    """Data access layer for cv_tailor_history table."""

    model = CvTailorHistory

    async def count_today_for_user(self, user_id: UUID) -> int:
        """
        Return the number of tailoring requests made by this user since
        midnight UTC today. Used to enforce the daily rate limit.
        """
        today_start = datetime.now(UTC).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        result = await self.db.execute(
            select(func.count())
            .select_from(CvTailorHistory)
            .where(
                CvTailorHistory.user_id == user_id,
                CvTailorHistory.created_at >= today_start,
            )
        )
        return result.scalar_one()
