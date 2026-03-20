import { api } from './client'
import type { CVTemplate, TemplateId, CVData } from '@/types'
import {
  mockCV_TechSenior,
  mockCV_OpsManager,
  mockCV_Academic,
} from '@/mock/cvBuilderMock'

// ─── Raw API shape (snake_case from FastAPI) ──────────────────────────────────

export interface ApiTemplate {
  id: string            // UUID — needed for /select-template endpoint
  slug: TemplateId
  name: string
  description: string
  primary_category: string
  categories: string[]
  experience_levels: string[]
  tags: string[]
  accent_color: string
  layout: string
  ats_score: number
  industry_reason: string
  is_recommended: boolean
  recommendation_reason: string
  is_selected: boolean
  preview_image_url: string | null
}

export interface ApiTemplateListResponse {
  items: ApiTemplate[]
  total: number
}

// ─── Static lookup tables (UI display data only — not backend concerns) ───────

// sampleCV is used by TemplateCard to render a mini A4 preview.
// It is fixed visual data per template slug — not user data.
const SAMPLE_CV_BY_SLUG: Record<TemplateId, CVData> = {
  modern:       mockCV_TechSenior,
  classic:      mockCV_OpsManager,
  professional: mockCV_OpsManager,
  executive:    mockCV_TechSenior,
  academic:     mockCV_Academic,
  healthcare:   mockCV_OpsManager,
  creative:     mockCV_TechSenior,
}

// bestFor chip labels shown in the TemplateCard footer
const BEST_FOR_BY_SLUG: Record<TemplateId, string[]> = {
  modern:       ['Software Engineer', 'Product Manager', 'Data Scientist', 'Engineering Manager', 'DevOps'],
  classic:      ['Investment Banker', 'Solicitor', 'Accountant', 'Management Consultant', 'Actuary'],
  professional: ['Operations Manager', 'Marketing Manager', 'HR Business Partner', 'Project Manager', 'Business Analyst'],
  executive:    ['CEO', 'CTO', 'VP Engineering', 'Director', 'Head of', 'Chief of Staff'],
  academic:     ['PhD Researcher', 'Professor', 'Research Scientist', 'Postdoctoral Fellow', 'Clinical Researcher'],
  healthcare:   ['Nurse', 'Doctor', 'Physiotherapist', 'Clinical Lead', 'Pharmacist'],
  creative:     ['UX Designer', 'Art Director', 'Brand Designer', 'Motion Designer', 'Copywriter'],
}

// ─── Mapping ──────────────────────────────────────────────────────────────────

// Maps the backend ApiTemplate response to the CVTemplate shape that
// TemplateCard and the rest of the frontend already expect.
// The slug is used as the `id` because the template registry (registry.tsx)
// keys React components by slug string — not UUID.
export function toFrontendTemplate(t: ApiTemplate): CVTemplate & { _backendId: string } {
  return {
    _backendId: t.id,               // UUID — stored separately for API calls
    id: t.slug,                     // TemplateId — used by registry and store
    name: t.name,
    description: t.description,
    bestFor: BEST_FOR_BY_SLUG[t.slug] ?? [],
    categories: t.categories as CVTemplate['categories'],
    experienceLevels: t.experience_levels as CVTemplate['experienceLevels'],
    accentColor: t.accent_color,
    isAiRecommended: t.is_recommended,
    atsScore: t.ats_score,
    layout: t.layout as CVTemplate['layout'],
    industryReason: t.recommendation_reason || t.industry_reason,
    sampleCV: SAMPLE_CV_BY_SLUG[t.slug] ?? mockCV_TechSenior,
  }
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function fetchTemplates(category?: string): Promise<{
  templates: (CVTemplate & { _backendId: string })[]
  total: number
}> {
  const qs = category && category !== 'all' ? `?category=${category}` : ''
  const res = await api.get<ApiTemplateListResponse>(`/api/v1/templates${qs}`)
  return {
    templates: res.items.map(toFrontendTemplate),
    total: res.total,
  }
}

export async function fetchRecommendedTemplate(cvId: string): Promise<{
  recommended_slug: TemplateId
  reason: string
  score: number
} | null> {
  try {
    const res = await api.get<{
      recommended_template_id: string
      recommended_slug: TemplateId
      reason: string
      score: number
    }>(`/api/v1/templates/recommended/${cvId}`)
    return res
  } catch {
    return null
  }
}
