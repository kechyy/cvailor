from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.template import TemplateRepository
from app.schemas.template import TemplateListResponse, TemplateOut, TemplateRecommendationOut
from app.services.recommendation import RecommendationService


class TemplateService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = TemplateRepository(db)
        self.recommendation_svc = RecommendationService(db)

    async def list_templates(
        self,
        *,
        category: str | None = None,
        current_user: User | None = None,
        cv_id: UUID | None = None,
    ) -> TemplateListResponse:
        if category and category != "all":
            templates = await self.repo.get_by_category(category)
        else:
            templates = await self.repo.get_active()

        # Determine recommended template for personalization banner
        recommended_id: UUID | None = None
        reason_map: dict[UUID, str] = {}

        if current_user and cv_id:
            try:
                rec = await self.recommendation_svc.recommend_for_cv(cv_id, current_user)
                recommended_id = rec.recommended_template_id
                reason_map[recommended_id] = rec.reason
            except Exception:
                pass

        # Resolve selected template from CV
        selected_id: UUID | None = None
        if cv_id:
            from app.repositories.cv import CVRepository
            cv_repo = CVRepository(self.db)
            cv = await cv_repo.get_by_id(cv_id)
            if cv:
                selected_id = cv.template_id

        items = []
        for t in templates:
            out = TemplateOut.model_validate(t)
            out.is_recommended = (t.id == recommended_id)
            out.recommendation_reason = reason_map.get(t.id, t.industry_reason)
            out.is_selected = (t.id == selected_id)
            items.append(out)

        return TemplateListResponse(items=items, total=len(items))

    async def get_template(self, template_id: UUID) -> TemplateOut:
        template = await self.repo.get_by_id(template_id)
        if not template:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
        return TemplateOut.model_validate(template)

    async def get_recommended(
        self, cv_id: UUID, current_user: User
    ) -> TemplateRecommendationOut:
        return await self.recommendation_svc.recommend_for_cv(cv_id, current_user)
