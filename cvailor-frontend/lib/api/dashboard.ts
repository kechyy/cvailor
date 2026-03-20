import { api, ApiError } from './client'
import type { DashboardStats, DashboardInsights, AiInsight } from '@/types'

// ─── Raw API shapes ───────────────────────────────────────────────────────────

interface ApiCVSummary {
  id: string
  title: string
  status: string
  ats_score: number | null
  template_id: string | null
  created_at: string
  updated_at: string
  target_role: string | null
  company: string | null
}

interface ApiDashboardOverview {
  stats: DashboardStats
  insights: DashboardInsights
  recent_cvs: ApiCVSummary[]
}

// ─── Mapped types for the frontend ───────────────────────────────────────────

export interface DashboardRecentCV {
  id: string
  title: string
  company: string | null
  role: string | null
  atsScore: number | null
  templateSlug: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardData {
  stats: DashboardStats
  insights: DashboardInsights
  recentCVs: DashboardRecentCV[]
}

function mapRecentCV(cv: ApiCVSummary): DashboardRecentCV {
  return {
    id: cv.id,
    title: cv.title,
    company: cv.company,
    role: cv.target_role,
    atsScore: cv.ats_score,
    templateSlug: cv.template_id,   // UUID for now — enriched later if needed
    createdAt: cv.created_at,
    updatedAt: cv.updated_at,
  }
}

// ─── API calls ────────────────────────────────────────────────────────────────

export async function fetchDashboardOverview(): Promise<DashboardData | null> {
  try {
    const res = await api.get<ApiDashboardOverview>('/api/v1/dashboard/overview')
    return {
      stats: res.stats,
      insights: res.insights,
      recentCVs: res.recent_cvs.map(mapRecentCV),
    }
  } catch (err) {
    // 401 = not logged in; return null so the page falls back gracefully
    if (err instanceof ApiError && err.isUnauthorized) return null
    throw err
  }
}
