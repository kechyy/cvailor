import { api } from './client'
import type { CVData } from '@/types'

export interface UserResume {
  id: string
  user_id: string
  template_id: string
  content: CVData
  created_at: string
  updated_at: string
}

/**
 * Get or create the authenticated user's resume for a given template slug (e.g. "modern").
 * The backend creates an empty record on first call (copy-on-write).
 */
export async function getOrCreateResume(templateSlug: string): Promise<UserResume> {
  return api.get<UserResume>(`/api/v1/resumes/template/by-slug/${templateSlug}`)
}

/**
 * Persist updated CV content. Called by the debounced auto-save in the editor.
 */
export async function saveResume(resumeId: string, content: CVData): Promise<UserResume> {
  return api.patch<UserResume>(`/api/v1/resumes/${resumeId}`, { content })
}
