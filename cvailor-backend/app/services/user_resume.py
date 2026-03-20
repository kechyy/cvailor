from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.user_resume import UserResume
from app.repositories.user_resume import UserResumeRepository
from app.repositories.template import TemplateRepository
from app.schemas.resume import UserResumeOut, UserResumeUpdateIn

# Default empty CV content — the same shape as the frontend CVData type.
# Users start from a clean slate; the live preview fills in sample data
# automatically when fields are empty.
_DEFAULT_CONTENT: dict = {
    "personal": {
        "fullName": "",
        "jobTitle": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "website": "",
        "summary": "",
    },
    "experience": [],
    "education": [],
    "skills": [],
    "languages": [],
    "certifications": [],
    "jobContext": {
        "targetRole": "",
        "jobDescription": "",
    },
}


class UserResumeService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = UserResumeRepository(db)
        self.template_repo = TemplateRepository(db)

    async def get_or_create_by_slug(
        self, template_slug: str, current_user: User
    ) -> UserResumeOut:
        """
        Return the user's resume for the given template slug.
        If none exists yet, create one with empty default content.
        """
        template = await self.template_repo.get_by_slug(template_slug)
        if not template:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Template '{template_slug}' not found",
            )
        return await self.get_or_create(template.id, current_user)

    async def get_or_create(
        self, template_id: UUID, current_user: User
    ) -> UserResumeOut:
        """
        Return the user's resume for the given template.
        If none exists yet, create one with empty default content.
        """
        # Validate template exists
        template = await self.template_repo.get_by_id(template_id)
        if not template:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Template not found",
            )

        resume = await self.repo.get_by_user_and_template(current_user.id, template_id)
        if resume is None:
            resume = await self.repo.create(
                user_id=current_user.id,
                template_id=template_id,
                content=dict(_DEFAULT_CONTENT),
            )
            await self.db.commit()
            await self.db.refresh(resume)

        return UserResumeOut.model_validate(resume)

    async def update(
        self,
        resume_id: UUID,
        payload: UserResumeUpdateIn,
        current_user: User,
    ) -> UserResumeOut:
        """Patch the content of a user's resume. Only the owner may update."""
        resume = await self.repo.get_by_id(resume_id)
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found",
            )
        if resume.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorised to edit this resume",
            )

        resume = await self.repo.update(resume, content=payload.content)
        await self.db.commit()
        await self.db.refresh(resume)
        return UserResumeOut.model_validate(resume)
