import type { CSSProperties } from 'react'
import type { ExperienceEntry, PersonalInfo } from '@/types'

export const contactWrap: CSSProperties = {
  wordBreak: 'break-word',
  overflowWrap: 'anywhere',
}

export function contactList(personal: PersonalInfo) {
  return [personal.email, personal.phone, personal.location, personal.website, personal.linkedin?.replace('https://', '')].filter(Boolean)
}

export function formatDateRange(exp: ExperienceEntry) {
  const start = exp.startDate || ''
  const end = exp.current || !exp.endDate ? 'Present' : exp.endDate
  if (!start) return end || ''
  return `${start} – ${end}`
}

export const skillChipStyle: CSSProperties = {
  fontSize: 11.5,
  padding: '6px 10px',
  borderRadius: 8,
  background: '#F8FAFC',
  border: '1px solid #E5E7EB',
  color: '#111827',
}
