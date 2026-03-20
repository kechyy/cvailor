from fastapi import APIRouter

from app.core.dependencies import CurrentUser, DbSession
from app.schemas.cv import CVSummary
from app.schemas.dashboard import DashboardInsights, DashboardOverview
from app.services.dashboard import DashboardService

router = APIRouter()


@router.get("/overview", response_model=DashboardOverview)
async def get_overview(db: DbSession, current_user: CurrentUser) -> DashboardOverview:
    """
    Returns the full dashboard data in a single call:
    - stats (CVs created, avg ATS score, jobs applied, top template)
    - insights (top category, avg match, missing keywords, AI tips)
    - recent_cvs (last 5 CVs)

    Used by /dashboard page — replaces mockStats + mockInsights + mockCVs.
    """
    return await DashboardService(db).get_overview(current_user)


@router.get("/recent-cvs", response_model=list[CVSummary])
async def get_recent_cvs(db: DbSession, current_user: CurrentUser) -> list[CVSummary]:
    """Return the 5 most recently updated CVs. Used by dashboard CV list widget."""
    return await DashboardService(db).get_recent_cvs(current_user)


@router.get("/insights", response_model=DashboardInsights)
async def get_insights(db: DbSession, current_user: CurrentUser) -> DashboardInsights:
    """
    Returns AI-derived insights from the user's ATS analysis history.
    Used by InsightsPanel component — missing keywords, tips, avg match.
    """
    return await DashboardService(db).get_insights(current_user)
