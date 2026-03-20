'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCVBuilderStore } from '@/store/cvBuilderStore'

const actions = [
  {
    href: '/dashboard/templates',
    label: 'Build new CV',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    accent: '#5B4FCF',
    bg: 'bg-brand-purple',
    text: 'text-white',
  },
  {
    href: '/dashboard/upload',
    label: 'Upload existing CV',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
    accent: '#2ECC8F',
    bg: 'bg-white',
    text: 'text-gray-700',
    border: 'border border-gray-200',
  },
  {
    href: '/dashboard/templates',
    label: 'Browse templates',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
    accent: '#5B4FCF',
    bg: 'bg-white',
    text: 'text-gray-700',
    border: 'border border-gray-200',
  },
]

export default function QuickActions() {
  const { setSelectedFlow, resetFlow } = useCVBuilderStore()

  const startFlow = (flow: 'build' | 'upload') => {
    resetFlow()
    setSelectedFlow(flow)
  }

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((a, i) => (
        <motion.div
          key={a.href}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.08 }}
        >
          <Link href={a.href}
            onClick={() => a.label.includes('Upload') ? startFlow('upload') : startFlow('build')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-md ${a.bg} ${a.text} ${a.border ?? ''} hover:-translate-y-0.5`}>
            {a.icon}
            {a.label}
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
