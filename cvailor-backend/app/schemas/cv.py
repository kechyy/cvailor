"""
CV schemas — aligned exactly with the frontend CVData TypeScript types.

Frontend types (from /types/index.ts):
  PersonalInfo  →  CVPersonalInfo
  ExperienceEntry  →  CVExperienceEntry
  EducationEntry  →  CVEducationEntry
  CVData  →  CVContent (the stored JSON body)
  SavedCV  →  CVOut (the API response shape)
"""
from datetime import datetime
from uuid import UUID

from pydantic import Field

from app.schemas.common import BaseSchema, TimestampSchema


# ── CV Content sub-schemas (mirrors frontend TypeScript types) ────────────────

class CVPersonalInfo(BaseSchema):
    fullName: str = Field(default="", max_length=200)
    jobTitle: str = Field(default="", max_length=200)
    email: str = Field(default="", max_length=320)
    phone: str = Field(default="", max_length=50)
    location: str = Field(default="", max_length=200)
    linkedin: str | None = None
    website: str | None = None
    summary: str | None = None
    photoUrl: str | None = None


class CVExperienceEntry(BaseSchema):
    id: str
    company: str = Field(max_length=200)
    role: str = Field(max_length=200)       # Frontend uses "role" not "jobTitle"
    startDate: str
    endDate: str = ""
    current: bool = False
    bullets: list[str] = Field(default_factory=list)


class CVEducationEntry(BaseSchema):
    id: str
    institution: str = Field(max_length=300)
    degree: str = Field(max_length=200)
    field: str = Field(max_length=200)
    year: str                               # Frontend stores as string: "2022", "Expected 2025"


class CVJobContext(BaseSchema):
    """Stores job description context used for ATS analysis and AI tailoring."""
    jobDescription: str = ""
    targetCompany: str = ""
    extractedKeywords: list[str] = Field(default_factory=list)


class CVContent(BaseSchema):
    """
    The full CV content body stored as JSONB in the cvs.content column.
    This schema is the contract between frontend and backend.
    """
    personal: CVPersonalInfo = Field(default_factory=CVPersonalInfo)
    experience: list[CVExperienceEntry] = Field(default_factory=list)
    education: list[CVEducationEntry] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)
    certifications: list[str] = Field(default_factory=list)
    jobContext: CVJobContext = Field(default_factory=CVJobContext)


# ── API Request / Response schemas ───────────────────────────────────────────

class CVCreateRequest(BaseSchema):
    title: str = Field(default="Untitled CV", max_length=300)
    content: CVContent = Field(default_factory=CVContent)
    template_id: UUID | None = None


class CVUpdateRequest(BaseSchema):
    title: str | None = Field(None, max_length=300)
    content: CVContent | None = None
    template_id: UUID | None = None
    status: str | None = None


class CVSelectTemplateRequest(BaseSchema):
    template_id: UUID


class CVOut(TimestampSchema):
    id: UUID
    user_id: UUID
    template_id: UUID | None
    title: str
    slug: str | None
    content: CVContent
    status: str
    ats_score: int | None
    current_version: int


class CVSummary(BaseSchema):
    """Lightweight CV representation for list views and dashboard."""
    id: UUID
    title: str
    status: str
    ats_score: int | None
    template_id: UUID | None
    template_slug: str | None = None
    created_at: datetime
    updated_at: datetime

    # Derived from content.personal for quick display
    target_role: str | None = None
    company: str | None = None
