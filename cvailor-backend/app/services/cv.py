import uuid
from uuid import UUID

from fastapi import HTTPException, status
from slugify import slugify
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.cv import CV, CVStatus
from app.models.user import User
from app.repositories.cv import CVRepository
from app.repositories.cv_version import CVVersionRepository
from app.repositories.template import TemplateRepository
from app.schemas.cv import (
    CVContent,
    CVCreateRequest,
    CVOut,
    CVSelectTemplateRequest,
    CVSummary,
    CVUpdateRequest,
)


def _to_cv_out(cv: CV) -> CVOut:
    content = CVContent.model_validate(cv.content) if cv.content else CVContent()
    return CVOut(
        id=cv.id,
        user_id=cv.user_id,
        template_id=cv.template_id,
        title=cv.title,
        slug=cv.slug,
        content=content,
        status=cv.status.value if cv.status else "draft",
        ats_score=cv.ats_score,
        current_version=cv.current_version,
        created_at=cv.created_at,
        updated_at=cv.updated_at,
    )


def _to_cv_summary(cv: CV) -> CVSummary:
    content = cv.content or {}
    personal = content.get("personal", {})
    job_context = content.get("jobContext", {})
    return CVSummary(
        id=cv.id,
        title=cv.title,
        status=cv.status.value if cv.status else "draft",
        ats_score=cv.ats_score,
        template_id=cv.template_id,
        created_at=cv.created_at,
        updated_at=cv.updated_at,
        target_role=personal.get("jobTitle"),
        company=job_context.get("targetCompany"),
    )


class CVService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.cv_repo = CVRepository(db)
        self.version_repo = CVVersionRepository(db)
        self.template_repo = TemplateRepository(db)

    async def create(self, user: User, payload: CVCreateRequest) -> CVOut:
        # Validate template exists if provided
        if payload.template_id:
            template = await self.template_repo.get_by_id(payload.template_id)
            if not template:
                raise HTTPException(status_code=404, detail="Template not found")

        slug = self._make_slug(payload.title, user.id)
        cv = await self.cv_repo.create(
            user_id=user.id,
            template_id=payload.template_id,
            title=payload.title,
            slug=slug,
            content=payload.content.model_dump(),
            status=CVStatus.draft,
        )

        # Create initial version snapshot
        await self._snapshot(cv, change_summary="Initial version")
        return _to_cv_out(cv)

    async def list_for_user(self, user: User) -> list[CVSummary]:
        cvs = await self.cv_repo.get_user_cvs(user.id)
        return [_to_cv_summary(cv) for cv in cvs]

    async def get(self, cv_id: UUID, user: User) -> CVOut:
        cv = await self._get_owned(cv_id, user)
        return _to_cv_out(cv)

    async def update(self, cv_id: UUID, user: User, payload: CVUpdateRequest) -> CVOut:
        cv = await self._get_owned(cv_id, user)

        updates: dict = {}
        if payload.title is not None:
            updates["title"] = payload.title
            updates["slug"] = self._make_slug(payload.title, user.id)
        if payload.content is not None:
            updates["content"] = payload.content.model_dump()
        if payload.template_id is not None:
            template = await self.template_repo.get_by_id(payload.template_id)
            if not template:
                raise HTTPException(status_code=404, detail="Template not found")
            updates["template_id"] = payload.template_id
        if payload.status is not None:
            updates["status"] = CVStatus(payload.status)

        if updates:
            updates["current_version"] = cv.current_version + 1
            cv = await self.cv_repo.update(cv, **updates)
            await self._snapshot(cv, change_summary="Manual save")

        return _to_cv_out(cv)

    async def delete(self, cv_id: UUID, user: User) -> None:
        cv = await self._get_owned(cv_id, user)
        await self.cv_repo.delete(cv)

    async def select_template(
        self, cv_id: UUID, user: User, payload: CVSelectTemplateRequest
    ) -> CVOut:
        cv = await self._get_owned(cv_id, user)
        template = await self.template_repo.get_by_id(payload.template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        cv = await self.cv_repo.update(cv, template_id=payload.template_id)
        return _to_cv_out(cv)

    async def duplicate(self, cv_id: UUID, user: User) -> CVOut:
        cv = await self._get_owned(cv_id, user)
        new_title = f"{cv.title} (Copy)"
        new_cv = await self.cv_repo.create(
            user_id=user.id,
            template_id=cv.template_id,
            title=new_title,
            slug=self._make_slug(new_title, user.id),
            content=cv.content,
            status=CVStatus.draft,
        )
        await self._snapshot(new_cv, change_summary="Duplicated from original")
        return _to_cv_out(new_cv)

    # ── Internals ────────────────────────────────────────────────────────────

    async def _get_owned(self, cv_id: UUID, user: User) -> CV:
        cv = await self.cv_repo.get_by_id_for_user(cv_id, user.id)
        if not cv:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CV not found")
        return cv

    async def _snapshot(self, cv: CV, change_summary: str | None = None) -> None:
        await self.version_repo.create(
            cv_id=cv.id,
            version_number=cv.current_version,
            content=cv.content,
            change_summary=change_summary,
        )

    @staticmethod
    def _make_slug(title: str, user_id: UUID) -> str:
        base = slugify(title, max_length=300)
        return f"{base}-{str(user_id)[:8]}"
