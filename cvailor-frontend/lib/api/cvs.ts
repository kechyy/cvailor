import { api } from './client'
import type { CVData } from '@/types'

// ─── Raw API shapes ───────────────────────────────────────────────────────────

export interface ApiCVContent {
  personal: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    linkedin?: string
    website?: string
    summary?: string
    photoUrl?: string
  }
  experience: Array<{
    id: string
    company: string
    role: string
    startDate: string
    endDate: string
    current: boolean
    bullets: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    year: string
  }>
  skills: string[]
  languages: string[]
  certifications: string[]
  jobContext: {
    jobDescription: string
    targetCompany: string
    extractedKeywords: string[]
  }
}

export interface ApiCV {
  id: string
  user_id: string
  template_id: string | null
  title: string
  slug: string | null
  content: ApiCVContent
  status: string
  ats_score: number | null
  current_version: number
  created_at: string
  updated_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Converts the frontend CVData store shape into the backend ApiCVContent shape.
// Both use the same field names — only jobContext is added.
function toApiContent(
  cvData: CVData,
  jobDescription: string,
  targetCompany: string,
  extractedKeywords: string[],
): ApiCVContent {
  return {
    personal: cvData.personal,
    experience: cvData.experience,
    education: cvData.education,
    skills: cvData.skills,
    languages: cvData.languages,
    certifications: cvData.certifications,
    jobContext: {
      jobDescription,
      targetCompany,
      extractedKeywords,
    },
  }
}

function autoTitle(cvData: CVData, targetCompany: string): string {
  const role = cvData.personal.jobTitle || 'My CV'
  return targetCompany ? `${role} — ${targetCompany}` : role
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function createCV(params: {
  cvData: CVData
  jobDescription: string
  targetCompany: string
  extractedKeywords: string[]
  templateBackendId?: string    // UUID of the selected template
}): Promise<ApiCV> {
  return api.post<ApiCV>('/api/v1/cvs', {
    title: autoTitle(params.cvData, params.targetCompany),
    template_id: params.templateBackendId ?? null,
    content: toApiContent(
      params.cvData,
      params.jobDescription,
      params.targetCompany,
      params.extractedKeywords,
    ),
  })
}

export async function updateCV(
  cvId: string,
  params: Partial<{
    title: string
    content: ApiCVContent
    template_id: string | null
    status: string
  }>,
): Promise<ApiCV> {
  return api.patch<ApiCV>(`/api/v1/cvs/${cvId}`, params)
}

export async function selectTemplate(cvId: string, templateBackendId: string): Promise<ApiCV> {
  return api.post<ApiCV>(`/api/v1/cvs/${cvId}/select-template`, {
    template_id: templateBackendId,
  })
}

export async function listCVs(): Promise<ApiCV[]> {
  return api.get<ApiCV[]>('/api/v1/cvs')
}
