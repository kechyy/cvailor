'use client'
import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  icon: React.ReactNode
  accent?: string
  index?: number
}

export default function StatCard({ label, value, delta, icon, accent = '#5B4FCF', index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}12` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
        {delta && (
          <span className="text-xs font-medium text-brand-green bg-brand-green/8 px-2 py-1 rounded-full">
            {delta}
          </span>
        )}
      </div>
      <div className="font-display text-3xl text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  )
}
