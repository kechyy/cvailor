'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import TopBar from '@/components/dashboard/TopBar'
import CVCard from '@/components/dashboard/CVCard'
import { mockCVs } from '@/mock/dashboardMock'

export default function CVsPage() {
  return (
    <>
      <TopBar title="My CVs" subtitle={`${mockCVs.length} CVs created`} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <span className="text-xs text-gray-400 font-medium">{mockCVs.length} documents</span>
          <Link href="/dashboard/cv/new"
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-purple bg-brand-purple/8 px-3 py-1.5 rounded-lg hover:bg-brand-purple/15 transition-colors">
            + New CV
          </Link>
        </div>
        {mockCVs.map((cv, i) => <CVCard key={cv.id} cv={cv} index={i} />)}
      </motion.div>
    </>
  )
}
