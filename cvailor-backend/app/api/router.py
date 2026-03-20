from fastapi import APIRouter

from app.api.v1 import (
    ai,
    ats,
    auth,
    cv_tailor,
    cv_versions,
    cvs,
    dashboard,
    exports,
    resumes,
    templates,
    users,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
api_router.include_router(cvs.router, prefix="/cvs", tags=["cvs"])
api_router.include_router(cv_versions.router, prefix="/cvs", tags=["cv-versions"])
api_router.include_router(ats.router, prefix="/ats", tags=["ats"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(exports.router, prefix="/exports", tags=["exports"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
api_router.include_router(cv_tailor.router, prefix="/cv", tags=["cv-tailor"])
