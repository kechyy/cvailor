from uuid import UUID

from pydantic import Field

from app.schemas.common import BaseSchema
from app.schemas.cv import CVContent, CVExperienceEntry


class GenerateSummaryRequest(BaseSchema):
    cv_id: UUID | None = None
    personal_info: dict
    experience: list[dict]
    target_role: str | None = None
    job_description: str | None = None


class GenerateSummaryResponse(BaseSchema):
    summary: str
    tokens_used: int


class RewriteExperienceRequest(BaseSchema):
    cv_id: UUID | None = None
    experience_entry: CVExperienceEntry
    job_description: str | None = None
    tone: str = "professional"   # professional | concise | impact-first


class RewriteExperienceResponse(BaseSchema):
    rewritten_bullets: list[str]
    tokens_used: int


class TailorCVRequest(BaseSchema):
    cv_id: UUID
    job_description: str = Field(min_length=100)
    target_company: str | None = None


class TailorCVResponse(BaseSchema):
    tailored_content: CVContent
    changes_summary: list[str]
    tokens_used: int


class TemplateRecommendationAIRequest(BaseSchema):
    cv_id: UUID | None = None
    target_role: str | None = None
    industry: str | None = None
    experience_level: str | None = None
    job_description: str | None = None


class ExtractKeywordsRequest(BaseSchema):
    job_description: str = Field(min_length=50)


class ExtractKeywordsResponse(BaseSchema):
    keywords: list[str]
    role: str | None = None
    industry: str | None = None
    experience_level: str | None = None
    tokens_used: int
