from uuid import UUID

from sqlalchemy import select, desc

from app.models.ai_suggestion import AISuggestion, SuggestionType
from app.repositories.base import BaseRepository


class AISuggestionRepository(BaseRepository[AISuggestion]):
    model = AISuggestion

    async def get_for_cv(
        self,
        cv_id: UUID,
        *,
        suggestion_type: SuggestionType | None = None,
        limit: int = 20,
    ) -> list[AISuggestion]:
        q = select(AISuggestion).where(AISuggestion.cv_id == cv_id)
        if suggestion_type:
            q = q.where(AISuggestion.suggestion_type == suggestion_type)
        q = q.order_by(desc(AISuggestion.created_at)).limit(limit)
        result = await self.db.execute(q)
        return list(result.scalars().all())
