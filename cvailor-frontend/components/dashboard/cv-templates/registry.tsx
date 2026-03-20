import type { CVData, TemplateId } from '@/types'
import TemplateClassic from './TemplateClassic'
import TemplateModern from './TemplateModern'
import TemplateProfessional from './TemplateProfessional'
import TemplateExecutive from './TemplateExecutive'
import TemplateAcademic from './TemplateAcademic'
import TemplateHealthcare from './TemplateHealthcare'
import TemplateCreative from './TemplateCreative'

export type TemplateDefinition = {
  id: TemplateId
  label: string
  Component: (props: { cv: CVData; matchedKeywords?: string[] }) => JSX.Element
}

export const templateRegistry: TemplateDefinition[] = [
  { id: 'classic', label: 'Classic', Component: TemplateClassic },
  { id: 'modern', label: 'Modern', Component: TemplateModern },
  { id: 'professional', label: 'Professional', Component: TemplateProfessional },
  { id: 'executive', label: 'Executive', Component: TemplateExecutive },
  { id: 'academic', label: 'Academic', Component: TemplateAcademic },
  { id: 'healthcare', label: 'Healthcare', Component: TemplateHealthcare },
  { id: 'creative', label: 'Creative', Component: TemplateCreative },
]

const templateMap = templateRegistry.reduce<Record<TemplateId, TemplateDefinition>>((acc, t) => {
  acc[t.id] = t
  return acc
}, {} as Record<TemplateId, TemplateDefinition>)

export function renderTemplate(id: TemplateId, props: { cv: CVData; matchedKeywords?: string[] }) {
  const entry = templateMap[id] ?? templateRegistry[0]
  const Comp = entry.Component
  return <Comp {...props} />
}

export const templateIds = templateRegistry.map((t) => t.id)
