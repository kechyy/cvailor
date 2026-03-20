/**
 * API client for AI-powered CV features.
 *
 * tailorCV  — POST /api/v1/cv/tailor
 *   Sends the user's CV + job description to GPT-4 and returns a tailored
 *   CV with ATS score, keyword analysis, and improvement suggestions.
 *   Returns TailorResult on success; throws ApiError on HTTP errors so callers
 *   can inspect error.status (422 / 429 / 503) and display the right message.
 */
import { apiRequest, ApiError } from './client'
import type { CVData, TailorResult, TailorApiError } from '@/types'

export interface TailorCvPayload {
  cv_data: CVData
  job_description: string
  /** Backend UUID of the selected template — optional */
  template_id?: string
}

/**
 * Tailor a CV to a job description using GPT-4.
 *
 * On success  → resolves with TailorResult
 * On 422/429/503 → rejects with ApiError whose .status matches the HTTP code
 *
 * The backend error body shape is:
 *   { error: { code, message, details: Record<string, string> } }
 * Callers should check ApiError.status to render the correct user-facing message.
 */
export async function tailorCV(payload: TailorCvPayload): Promise<TailorResult> {
  return apiRequest<TailorResult>('/api/v1/cv/tailor', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Type-guard: check whether an unknown API response carries the error envelope.
 */
export function isTailorApiError(v: unknown): v is TailorApiError {
  return (
    typeof v === 'object' &&
    v !== null &&
    'error' in v &&
    typeof (v as TailorApiError).error?.code === 'string'
  )
}
