# Import all models here so Alembic can discover them
from app.models.user import User, UserOAuthAccount  # noqa: F401
from app.models.template import Template  # noqa: F401
from app.models.cv import CV  # noqa: F401
from app.models.cv_version import CVVersion  # noqa: F401
from app.models.ai_suggestion import AISuggestion  # noqa: F401
from app.models.ats_analysis import ATSAnalysisRun  # noqa: F401
from app.models.export_job import ExportJob  # noqa: F401
from app.models.recommendation_log import RecommendationLog  # noqa: F401
from app.models.job_match import JobMatchRun  # noqa: F401
from app.models.user_resume import UserResume  # noqa: F401
from app.models.cv_tailor_history import CvTailorHistory  # noqa: F401
