'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { mockUser } from '@/mock/dashboardMock'
import type { ReactNode } from 'react'
import { useCVBuilderStore } from '@/store/cvBuilderStore'

interface TopBarProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export default function TopBar({ title, subtitle, action }: TopBarProps) {
  const { resetFlow, setSelectedFlow } = useCVBuilderStore()

  const startBuild = () => { resetFlow(); setSelectedFlow('build') }
  const startUpload = () => { resetFlow(); setSelectedFlow('upload') }

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="font-display text-3xl text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action ? (
        <div className="ml-auto">{action}</div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/upload"
            onClick={startUpload}
            className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
            Upload CV
          </Link>
          <Link
            href="/dashboard/templates"
            onClick={startBuild}
            className="flex items-center gap-2 bg-brand-purple text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-purple/90 hover:shadow-md hover:shadow-brand-purple/20 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Build new CV
          </Link>
          {/* Mobile user avatar */}
          <div className="lg:hidden w-9 h-9 rounded-full overflow-hidden ring-2 ring-brand-purple/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </motion.div>
  )
}
