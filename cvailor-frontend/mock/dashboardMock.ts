// REPLACE WITH: GET /api/dashboard/overview
import type { User, SavedCV, DashboardStats, DashboardInsights } from '@/types'

export const mockUser: User = {
  id: 'usr_01',
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@email.com',
  avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&crop=face&auto=format&q=80',
  plan: 'free',
  createdAt: '2025-01-10T10:00:00Z',
}

export const mockStats: DashboardStats = {
  cvsCreated: 3,
  cvsCreatedDelta: '+1 this week',
  avgAtsScore: 87,
  avgAtsDelta: '↑ 12% vs last',
  jobsApplied: 5,
  jobsAppliedDelta: '2 this week',
  topTemplate: 'Minimal',
  topTemplateSub: 'Most used',
}

export const mockCVs: SavedCV[] = [
  { id: 'cv_01', fileName: 'Sarah_Google_SWE.pdf', company: 'Google', role: 'Senior Software Engineer', atsScore: 94, template: 'modern', createdAt: '2025-02-18T09:00:00Z' },
  { id: 'cv_02', fileName: 'Sarah_Meta_Design.pdf', company: 'Meta', role: 'UX Lead', atsScore: 81, template: 'creative', createdAt: '2025-02-15T14:30:00Z' },
  { id: 'cv_03', fileName: 'Sarah_Startup_PM.pdf', company: 'TechCo', role: 'Product Manager', atsScore: 76, template: 'professional', createdAt: '2025-02-13T11:00:00Z' },
]

export const mockInsights: DashboardInsights = {
  topCategory: 'tech',
  avgMatch: 87,
  missingKeywords: ['TypeScript', 'Agile', 'CI/CD'],
  tips: [
    { id: 't1', message: 'Add metrics to your 2022 role to boost ATS score by ~8 points', type: 'tip' },
    { id: 't2', message: 'Your Google CV is missing 3 keywords from the job description', type: 'warning' },
    { id: 't3', message: 'Minimal template performs best for your tech applications', type: 'success' },
  ],
}
