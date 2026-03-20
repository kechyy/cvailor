'use client'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { templates, sampleCv } from '@/src/templates/registry'
import { TemplateThumbnail } from './TemplateThumbnail'
import { useTemplateStore } from '@/src/store/templateStore'

export function TemplatePreviewModal() {
  const { previewTemplateId, setPreviewTemplateId, setSelectedTemplateId } = useTemplateStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || !previewTemplateId) return null

  const template = templates.find((t) => t.id === previewTemplateId)
  if (!template) return null

  const handleUse = () => {
    setSelectedTemplateId(template.id)
    setPreviewTemplateId(undefined)
  }

  const body = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-gray-400">Template preview</p>
            <p className="text-lg font-semibold text-gray-900">{template.name}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewTemplateId(undefined)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handleUse}
              className="px-4 py-2 text-sm rounded-lg bg-brand-purple text-white shadow hover:bg-brand-purple/90"
            >
              Use this template
            </button>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-8 flex justify-center overflow-auto max-h-[80vh]">
          <div className="w-full max-w-[720px]">
            <TemplateThumbnail template={template} sample={sampleCv} />
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(body, document.body)
}
