from uuid import UUID

from fastapi import APIRouter, Query

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.template import TemplateListResponse, TemplateOut, TemplateRecommendationOut
from app.services.template import TemplateService

router = APIRouter()


@router.get("", response_model=TemplateListResponse)
async def list_templates(
    db: DbSession,
    current_user: CurrentUser,
    category: str | None = Query(None, description="Filter by category tab (e.g. tech, finance)"),
    cv_id: UUID | None = Query(None, description="Pass CV ID to get personalized recommendation"),
) -> TemplateListResponse:
    """
    Returns the full template catalog with personalized recommendation flags.
    Used by /dashboard/templates page — drives the category tabs, AI banner,
    ATS score labels, and selected template state.
    """
    return await TemplateService(db).list_templates(
        category=category,
        current_user=current_user,
        cv_id=cv_id,
    )


@router.get("/recommended/{cv_id}", response_model=TemplateRecommendationOut)
async def get_recommended_template(
    cv_id: UUID,
    db: DbSession,
    current_user: CurrentUser,
) -> TemplateRecommendationOut:
    """
    Returns the best-fit template recommendation for a specific CV.
    Powers the AI recommendation banner on the templates page.
    """
    return await TemplateService(db).get_recommended(cv_id, current_user)


@router.get("/{template_id}", response_model=TemplateOut)
async def get_template(
    template_id: UUID,
    db: DbSession,
    current_user: CurrentUser,
) -> TemplateOut:
    """Return a single template by ID."""
    return await TemplateService(db).get_template(template_id)
