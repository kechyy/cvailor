'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface KeywordChipsProps {
  matched: string[]
  missing: string[]
}

export default function KeywordChips({ matched, missing }: KeywordChipsProps) {
  const [dismissed, setDismissed] = useState<string[]>([])

  return (
    <div className="space-y-4">
      {/* Matched */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-gray-600">Matched keywords</span>
          <span className="text-xs text-gray-400 ml-auto">{matched.length} found</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {matched.map((kw) => (
            <span key={kw} className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
              ✓ {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Missing */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs font-semibold text-gray-600">Missing keywords</span>
          <span className="text-xs text-gray-400 ml-auto">{missing.filter(k => !dismissed.includes(k)).length} remaining</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence>
            {missing.filter((k) => !dismissed.includes(k)).map((kw) => (
              <motion.div key={kw}
                initial={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-1 text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full font-medium"
              >
                {kw}
                <button
                  onClick={() => setDismissed((d) => [...d, kw])}
                  title="Mark as added"
                  className="hover:text-emerald-600 transition-colors ml-0.5"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
