'use client'
import React from 'react'
import { TemplateThumbnail } from './TemplateThumbnail'
import type { CvTemplateMeta, SampleCvData } from '@/src/templates/registry'
import { useTemplateStore } from '@/src/store/templateStore'
import clsx from 'clsx'

type Props = {
  template: CvTemplateMeta
  sample: SampleCvData
}

export function TemplateCard({ template, sample }: Props) {
  const { selectedTemplateId, setSelectedTemplateId, setPreviewTemplateId } = useTemplateStore()
  const isSelected = selectedTemplateId === template.id

  return (
    <div
      className={clsx(
        'group relative flex flex-col items-center gap-3 rounded-2xl border transition-all p-4 focus-within:ring-2 focus-within:ring-brand-purple w-full h-full bg-white',
        isSelected ? 'border-brand-purple shadow-lg shadow-brand-purple/10' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      )}
    >
      <button
        type="button"
        onClick={() => setPreviewTemplateId(template.id)}
        className="w-full"
        aria-label={`Preview ${template.name}`}
      >
        <TemplateThumbnail template={template} sample={sample} />
      </button>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">{template.name}</p>
          {isSelected && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple">Selected</span>}
        </div>
        <p className="text-xs text-gray-500">{template.layout.toUpperCase()} · {template.tags.join(' · ')}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewTemplateId(template.id)}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Preview
          </button>
          <button
            onClick={() => setSelectedTemplateId(template.id)}
            className="flex-1 text-xs px-3 py-2 rounded-lg bg-brand-purple text-white hover:bg-brand-purple/90"
          >
            Use template
          </button>
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl ring-2 ring-brand-purple opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" />
    </div>
  )
}
