// ================================================================
// CVAILOR — CENTRAL TYPE DEFINITIONS
// All types mirror the future API response shapes exactly.
// When backend is ready: swap mock imports for API calls.
// ================================================================

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  createdAt: string
}

export interface PersonalInfo {
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

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  field: string
  year: string
}

export interface CVData {
  personal: PersonalInfo
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  languages: string[]
  certifications: string[]
}

export interface SavedCV {
  id: string
  fileName: string
  company: string
  role: string
  atsScore: number
  template: TemplateId
  createdAt: string
  jobDescription?: string
  cvData?: CVData
}

export type TemplateId =
  | 'classic'
  | 'modern'
  | 'professional'
  | 'executive'
  | 'academic'
  | 'healthcare'
  | 'creative'
export type JobCategory = 'tech' | 'creative' | 'finance' | 'healthcare' | 'sales' | 'executive' | 'general'
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive'
export type LayoutType = 'single' | 'sidebar-left' | 'sidebar-right'

export interface CVTemplate {
  id: TemplateId
  name: string
  description: string
  bestFor: string[]
  categories: JobCategory[]
  experienceLevels: ExperienceLevel[]
  accentColor: string
  isAiRecommended?: boolean
  atsScore: number
  layout: LayoutType
  industryReason: string
  sampleCV: CVData
  /** Backend UUID — only present when template was fetched from the API */
  _backendId?: string
}

export interface DashboardStats {
  cvsCreated: number
  cvsCreatedDelta: string
  avgAtsScore: number
  avgAtsDelta: string
  jobsApplied: number
  jobsAppliedDelta: string
  topTemplate: string
  topTemplateSub: string
}

export interface AiInsight {
  id: string
  message: string
  type: 'tip' | 'warning' | 'success'
}

export interface DashboardInsights {
  topCategory: string
  avgMatch: number
  missingKeywords: string[]
  tips: AiInsight[]
}

export interface ScoreBreakdown {
  keywordsMatch: number
  experienceFit: number
  skillsAlignment: number
  summaryStrength: number
}

export interface PreviewInsights {
  atsScore: number
  scoreBreakdown: ScoreBreakdown
  matchedKeywords: string[]
  missingKeywords: string[]
  atsTips: string[]
}

export interface CoverLetter {
  greeting: string
  paragraph1: string
  paragraph2: string
  paragraph3: string
  signOff: string
}

// ── CV Tailor feature ─────────────────────────────────────────────────────────

export interface TailorResult {
  /** Tailored CV content — same shape as CVData (jobContext field is optional extra). */
  tailored_cv: CVData
  /** Estimated ATS match score 0–100. */
  ats_score: number
  /** Keywords found in both the CV and the job description. */
  matched_keywords: string[]
  /** Important job description keywords absent from the CV. */
  missing_keywords: string[]
  /** Concise list of specific changes the AI made. */
  improvements_made: string[]
  /** Actionable advice for the candidate to further improve their profile. */
  suggestions: string[]
  /** UUID of the saved history record (for reference / download). */
  tailor_history_id: string
}

export interface TailorApiError {
  error: {
    code: string
    message: string
    details: Record<string, string>
  }
}
