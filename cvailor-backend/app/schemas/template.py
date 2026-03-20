from uuid import UUID

from app.schemas.common import BaseSchema, TimestampSchema


class TemplateOut(TimestampSchema):
    """
    Full template response — used on /dashboard/templates page.
    Includes all fields needed by the TemplateCard component:
      - name, description, categories, atsScore, tags
      - isRecommended, recommendationReason (isRecommended set per-request)
      - layout, accentColor
    """
    id: UUID
    slug: str
    name: str
    description: str
    primary_category: str
    categories: list[str]
    experience_levels: list[str]
    tags: list[str]
    accent_color: str
    layout: str
    ats_score: int
    industry_reason: str
    preview_image_url: str | None
    thumbnail_url: str | None
    is_active: bool
    sort_order: int

    # Injected per-request by the recommendation service
    is_recommended: bool = False
    recommendation_reason: str = ""
    is_selected: bool = False


class TemplateListResponse(BaseSchema):
    items: list[TemplateOut]
    total: int


class TemplateRecommendationOut(BaseSchema):
    recommended_template_id: UUID
    recommended_slug: str
    reason: str
    score: float
    confidence: float
    alternatives: list[dict]
