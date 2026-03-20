'use client'
import { motion } from 'framer-motion'
import type { DashboardInsights } from '@/types'

interface InsightsPanelProps {
  insights: DashboardInsights
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  const tipIcons = { tip: '💡', warning: '⚠️', success: '✅' }
  const tipColors = {
    tip: 'bg-blue-50 border-blue-100 text-blue-700',
    warning: 'bg-amber-50 border-amber-100 text-amber-700',
    success: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 h-full">
      <div className="flex items-center gap-2 mb-5">
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          className="text-brand-purple"
        >✦</motion.span>
        <h3 className="font-semibold text-gray-800 text-sm">AI Insights</h3>
      </div>

      {/* Match rate */}
      <div className="mb-5">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-gray-500">Your CVs match tech roles best</span>
          <span className="text-xs font-bold text-brand-purple">{insights.avgMatch}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${insights.avgMatch}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="h-full bg-gradient-to-r from-brand-purple to-brand-green rounded-full"
          />
        </div>
      </div>

      {/* Missing keywords */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-2">Top missing keywords</p>
        <div className="flex flex-wrap gap-1.5">
          {insights.missingKeywords.map((kw) => (
            <span key={kw}
              className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-2">
        {insights.tips.map((tip, i) => (
          <motion.div key={tip.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={`flex items-start gap-2 text-xs px-3 py-2.5 rounded-xl border ${tipColors[tip.type]}`}>
            <span className="flex-shrink-0 mt-0.5">{tipIcons[tip.type]}</span>
            <span className="leading-relaxed">{tip.message}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
