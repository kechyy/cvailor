from uuid import UUID

from fastapi import APIRouter

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.ats import ATSAnalysisOut, ATSReviewRequest
from app.services.ats import ATSService

router = APIRouter()


@router.post("/review", response_model=ATSAnalysisOut)
async def review_cv(
    payload: ATSReviewRequest, db: DbSession, current_user: CurrentUser
) -> ATSAnalysisOut:
    """
    Run ATS analysis on a CV.
    Accepts an optional job_description for keyword matching.
    Caches the score on the CV record and persists the full analysis run.

    Used by /dashboard/cv/preview page — powers the AtsScoreMeter,
    ScoreBreakdown, KeywordChips, and tips list.
    """
    return await ATSService(db).review(payload, current_user)


@router.get("/cvs/{cv_id}/analysis/latest", response_model=ATSAnalysisOut | None)
async def get_latest_analysis(
    cv_id: UUID, db: DbSession, current_user: CurrentUser
) -> ATSAnalysisOut | None:
    """Return the most recent ATS analysis run for a CV. None if never analysed."""
    return await ATSService(db).get_latest(cv_id, current_user)
