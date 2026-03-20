import { api } from './client'
import type { ScoreBreakdown } from '@/types'

export interface AtsAnalysisResult {
  id: string
  cv_id: string
  ats_score: number
  score_breakdown: ScoreBreakdown
  matched_keywords: string[]
  missing_keywords: string[]
  tips: string[]
  analysis_version: string
  job_description: string | null
}

export async function runAtsReview(params: {
  cv_id: string
  job_description?: string
}): Promise<AtsAnalysisResult> {
  return api.post<AtsAnalysisResult>('/api/v1/ats/review', params)
}

export async function getLatestAtsAnalysis(cvId: string): Promise<AtsAnalysisResult | null> {
  try {
    return await api.get<AtsAnalysisResult>(`/api/v1/ats/cvs/${cvId}/analysis/latest`)
  } catch {
    return null
  }
}
