'use client'
import React, { useMemo } from 'react'
import { templates, sampleCv, type CvTemplateMeta } from '@/src/templates/registry'
import { TemplateCard } from './TemplateCard'
import { useTemplateStore } from '@/src/store/templateStore'
import { TemplatePreviewModal } from './TemplatePreviewModal'

const professions = Array.from(new Set(templates.flatMap((t) => t.professions)))
const stacks = Array.from(new Set(templates.flatMap((t) => t.stacks)))

function scoreTemplate(t: CvTemplateMeta, profession?: string, stack?: string) {
  let score = 0
  const profMatch = profession && t.professions.includes(profession)
  const stackMatch = stack && t.stacks.includes(stack)
  if (profMatch) score += 5
  if (stackMatch) score += 3
  if (t.tags.includes('ATS')) score += 2
  return { score, profMatch, stackMatch }
}

export function TemplateGrid() {
  const {
    selectedTemplateId,
    selectedProfession,
    selectedStack,
    setSelectedProfession,
    setSelectedStack,
  } = useTemplateStore()

  const { recommended, all } = useMemo(() => {
    const filtered =
      selectedProfession || selectedStack
        ? templates.filter(
            (t) =>
              (selectedProfession && t.professions.includes(selectedProfession)) ||
              (selectedStack && t.stacks.includes(selectedStack))
          )
        : templates

    const scored = filtered
      .map((t) => ({ t, meta: scoreTemplate(t, selectedProfession, selectedStack) }))
      .sort((a, b) => b.meta.score - a.meta.score || a.t.name.localeCompare(b.t.name))

    const recommended = scored.slice(0, 4).map((s) => s.t)
    const all = templates.slice().sort((a, b) => a.name.localeCompare(b.name))
    return { recommended, all }
  }, [selectedProfession, selectedStack])

  return (
    <div className="space-y-8">
      <TemplatePreviewModal />
      <div className="flex flex-wrap gap-4 items-center">
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Profession</label>
          <select
            value={selectedProfession ?? ''}
            onChange={(e) => setSelectedProfession(e.target.value || undefined)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value="">All</option>
            {professions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Stack</label>
          <select
            value={selectedStack ?? ''}
            onChange={(e) => setSelectedStack(e.target.value || undefined)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value="">All</option>
            {stacks.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {selectedTemplateId && (
          <div className="text-sm text-gray-500">
            Selected template: <span className="font-semibold text-gray-900">{selectedTemplateId}</span>
          </div>
        )}
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Recommended</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple">Top picks</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {recommended.map((template) => (
            <TemplateCard key={template.id} template={template} sample={sampleCv} />
          ))}
          {recommended.length === 0 && (
            <p className="text-sm text-gray-500">No matches yet — broaden your filters.</p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">All templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {all.map((template) => (
            <TemplateCard key={template.id} template={template} sample={sampleCv} />
          ))}
        </div>
      </section>
    </div>
  )
}
