from app.schemas.common import BaseSchema
from app.schemas.cv import CVSummary


class DashboardStats(BaseSchema):
    """Mirrors the frontend DashboardStats type exactly."""
    cvsCreated: int
    cvsCreatedDelta: str
    avgAtsScore: int
    avgAtsDelta: str
    jobsApplied: int
    jobsAppliedDelta: str
    topTemplate: str
    topTemplateSub: str


class AiInsight(BaseSchema):
    """Mirrors the frontend AiInsight type."""
    id: str
    message: str
    type: str   # 'tip' | 'warning' | 'success'


class DashboardInsights(BaseSchema):
    """Mirrors the frontend DashboardInsights type."""
    topCategory: str
    avgMatch: int
    missingKeywords: list[str]
    tips: list[AiInsight]


class DashboardOverview(BaseSchema):
    stats: DashboardStats
    insights: DashboardInsights
    recent_cvs: list[CVSummary]
