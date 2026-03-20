'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { SavedCV } from '@/types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`
}

function AtsBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? 'text-emerald-600 bg-emerald-50'
      : score >= 75
      ? 'text-blue-500 bg-blue-50'
      : 'text-orange-500 bg-orange-50'
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
      ATS {score}%
    </span>
  )
}

interface CVCardProps {
  cv: SavedCV
  index?: number
}

export default function CVCard({ cv, index = 0 }: CVCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group"
    >
      <div className="w-10 h-12 bg-brand-purple/8 border border-brand-purple/15 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B4FCF" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-sm font-semibold text-gray-800 truncate">{cv.fileName}</span>
          <AtsBadge score={cv.atsScore} />
        </div>
        <div className="text-xs text-gray-500">{cv.company} · {cv.role}</div>
        <div className="text-xs text-gray-300 mt-0.5">{timeAgo(cv.createdAt)}</div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Link href="/dashboard/cv/preview"
          className="p-2 text-gray-400 hover:text-brand-purple hover:bg-brand-purple/8 rounded-lg transition-all"
          title="Edit">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </Link>
        <button
          className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
          title="Download">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
