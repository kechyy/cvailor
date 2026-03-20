from fastapi import APIRouter

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.ai import (
    ExtractKeywordsRequest,
    ExtractKeywordsResponse,
    GenerateSummaryRequest,
    GenerateSummaryResponse,
    RewriteExperienceRequest,
    RewriteExperienceResponse,
    TailorCVRequest,
    TailorCVResponse,
    TemplateRecommendationAIRequest,
)
from app.schemas.template import TemplateRecommendationOut
from app.services.ai import AIService
from app.services.recommendation import RecommendationService

router = APIRouter()


@router.post("/generate-summary", response_model=GenerateSummaryResponse)
async def generate_summary(
    payload: GenerateSummaryRequest, db: DbSession, current_user: CurrentUser
) -> GenerateSummaryResponse:
    """
    Generate an ATS-optimised professional summary.
    Called from StepPersonal summary field and the preview page refresh button.
    """
    return await AIService(db).generate_summary(payload, current_user)


@router.post("/rewrite-experience", response_model=RewriteExperienceResponse)
async def rewrite_experience(
    payload: RewriteExperienceRequest, db: DbSession, current_user: CurrentUser
) -> RewriteExperienceResponse:
    """
    Rewrite a single experience entry's bullets using the XYZ formula.
    Called from the StepExperience inline AI button.
    """
    return await AIService(db).rewrite_experience(payload, current_user)


@router.post("/tailor-cv", response_model=TailorCVResponse)
async def tailor_cv(
    payload: TailorCVRequest, db: DbSession, current_user: CurrentUser
) -> TailorCVResponse:
    """
    Tailor the full CV to a job description.
    Called from StepJobDesc after pasting the job description.
    Returns tailored CVContent + list of changes.
    """
    return await AIService(db).tailor_cv(payload, current_user)


@router.post("/template-recommendation", response_model=TemplateRecommendationOut)
async def recommend_template(
    payload: TemplateRecommendationAIRequest, db: DbSession, current_user: CurrentUser
) -> TemplateRecommendationOut:
    """
    Return a template recommendation from explicit signals.
    Called from the AI recommendation banner on /dashboard/templates.
    """
    svc = RecommendationService(db)
    return await svc.recommend_from_signals(
        target_role=payload.target_role,
        industry=payload.industry,
        experience_level=payload.experience_level,
        job_description=payload.job_description,
    )


@router.post("/extract-job-keywords", response_model=ExtractKeywordsResponse)
async def extract_keywords(
    payload: ExtractKeywordsRequest, db: DbSession, current_user: CurrentUser
) -> ExtractKeywordsResponse:
    """
    Extract ATS keywords, role, industry, and experience level from a job description.
    Called from StepJobDesc to populate jobContext.extractedKeywords.
    """
    return await AIService(db).extract_keywords(payload, current_user)
