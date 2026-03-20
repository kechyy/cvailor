from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.cv import CVRepository
from app.repositories.ats_analysis import ATSAnalysisRepository
from app.schemas.cv import CVSummary
from app.schemas.dashboard import AiInsight, DashboardInsights, DashboardOverview, DashboardStats
from app.services.cv import _to_cv_summary


class DashboardService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.cv_repo = CVRepository(db)
        self.ats_repo = ATSAnalysisRepository(db)

    async def get_overview(self, user: User) -> DashboardOverview:
        stats = await self._compute_stats(user)
        insights = await self._compute_insights(user)
        recent_cvs = await self._recent_cvs(user)

        return DashboardOverview(
            stats=stats,
            insights=insights,
            recent_cvs=recent_cvs,
        )

    async def get_recent_cvs(self, user: User, *, limit: int = 5) -> list[CVSummary]:
        cvs = await self.cv_repo.get_recent_for_user(user.id, limit=limit)
        return [_to_cv_summary(cv) for cv in cvs]

    async def get_insights(self, user: User) -> DashboardInsights:
        return await self._compute_insights(user)

    # ── Private helpers ───────────────────────────────────────────────────────

    async def _compute_stats(self, user: User) -> DashboardStats:
        total_cvs = await self.cv_repo.count_user_cvs(user.id)
        avg_ats = await self.cv_repo.get_avg_ats_score(user.id)

        # Derive top template from most-recent CVs
        recent = await self.cv_repo.get_recent_for_user(user.id, limit=10)
        top_template = "None yet"
        top_sub = "No CVs yet"

        if recent:
            # Count template usage; most common wins
            from collections import Counter
            slugs = [cv.template_id for cv in recent if cv.template_id]
            if slugs:
                most_common = Counter(slugs).most_common(1)[0][0]
                top_template = str(most_common)[:8]  # short UUID; enriched by caller if needed
                top_sub = "Most used template"

        return DashboardStats(
            cvsCreated=total_cvs,
            cvsCreatedDelta="+1 this week",    # TODO: real delta calculation
            avgAtsScore=int(avg_ats or 0),
            avgAtsDelta="↑ vs last month",
            jobsApplied=0,                     # Future: jobs module
            jobsAppliedDelta="–",
            topTemplate=top_template,
            topTemplateSub=top_sub,
        )

    async def _compute_insights(self, user: User) -> DashboardInsights:
        """
        Derive insights from the user's latest ATS analysis runs.
        Falls back to sane defaults when no analysis exists yet.
        """
        recent_cvs = await self.cv_repo.get_recent_for_user(user.id, limit=5)

        all_missing: list[str] = []
        all_matched: list[str] = []
        scores: list[int] = []
        top_category = "general"

        for cv in recent_cvs:
            run = await self.ats_repo.get_latest_for_cv(cv.id)
            if run:
                all_missing.extend(run.missing_keywords or [])
                all_matched.extend(run.matched_keywords or [])
                scores.append(run.ats_score)

            # Infer category from personal.jobTitle
            content = cv.content or {}
            job_title = content.get("personal", {}).get("jobTitle", "").lower()
            if any(w in job_title for w in ("engineer", "developer", "data", "ml", "tech")):
                top_category = "tech"
            elif any(w in job_title for w in ("design", "ux", "ui", "creative")):
                top_category = "creative"
            elif any(w in job_title for w in ("finance", "analyst", "accounting")):
                top_category = "finance"

        # Deduplicate and surface top missing keywords
        from collections import Counter
        missing_counter = Counter(all_missing)
        top_missing = [kw for kw, _ in missing_counter.most_common(5)]

        avg_match = int(sum(scores) / len(scores)) if scores else 0

        tips: list[AiInsight] = []
        if top_missing:
            tips.append(AiInsight(
                id="t1",
                message=f"Add '{top_missing[0]}' to your skills — it's missing across multiple CVs",
                type="warning",
            ))
        if avg_match > 85:
            tips.append(AiInsight(
                id="t2",
                message=f"Great ATS performance! Your CVs average {avg_match}% match rate",
                type="success",
            ))
        elif avg_match > 0:
            tips.append(AiInsight(
                id="t3",
                message="Try adding more role-specific keywords to boost your ATS score",
                type="tip",
            ))

        return DashboardInsights(
            topCategory=top_category,
            avgMatch=avg_match,
            missingKeywords=top_missing,
            tips=tips,
        )

    async def _recent_cvs(self, user: User) -> list[CVSummary]:
        return await self.get_recent_cvs(user, limit=5)
