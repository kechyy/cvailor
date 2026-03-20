'use client'
import React from 'react'
import { TemplateGrid } from '@/src/components/templates/TemplateGrid'

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <div className="max-w-6xl lg:max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14 space-y-10">
        <header className="space-y-6 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-semibold">1</span>
              <span>Profile</span>
            </div>
            <div className="h-px w-14 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple text-white text-xs font-semibold">2</span>
              <span>Template</span>
            </div>
            <div className="h-px w-14 bg-gray-200" />
            <div className="flex items-center gap-2 text-gray-400">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-xs font-semibold">3</span>
              <span>Review</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg overflow-hidden border border-gray-100">
                <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80" alt="User avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">Please select a template for your resume.</h1>
              <p className="text-gray-600 text-sm lg:text-base">You can always change it later. Previews show the real template output.</p>
            </div>
          </div>
        </header>
        <TemplateGrid />
      </div>
    </div>
  )
}
