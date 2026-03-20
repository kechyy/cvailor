'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { CoverLetter } from '@/types'

interface CoverLetterPanelProps {
  coverLetter: CoverLetter
  candidateName: string
}

export default function CoverLetterPanel({ coverLetter, candidateName }: CoverLetterPanelProps) {
  const fullText = [
    coverLetter.greeting,
    '',
    coverLetter.paragraph1,
    '',
    coverLetter.paragraph2,
    '',
    coverLetter.paragraph3,
    '',
    coverLetter.signOff,
  ].join('\n')

  const [editedText, setEditedText] = useState(fullText)
  const [isEditing, setIsEditing] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-600">Cover Letter</span>
        <button
          onClick={() => setIsEditing((v) => !v)}
          className="text-xs text-brand-purple font-medium hover:underline flex items-center gap-1"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          {isEditing ? 'Done editing' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          rows={16}
          className="w-full text-sm text-gray-700 leading-relaxed border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple/15 focus:border-brand-purple resize-none"
        />
      ) : (
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
          {editedText}
        </div>
      )}

      <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download Cover Letter PDF
      </button>
    </motion.div>
  )
}
