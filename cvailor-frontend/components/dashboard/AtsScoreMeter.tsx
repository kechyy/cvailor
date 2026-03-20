'use client'
import { motion } from 'framer-motion'

interface AtsScoreMeterProps {
  score: number
}

export default function AtsScoreMeter({ score }: AtsScoreMeterProps) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const strokeDash = (score / 100) * circumference
  const color = score >= 85 ? '#2ECC8F' : score >= 70 ? '#5B4FCF' : '#F59E0B'
  const label = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Work'

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none" stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - strokeDash }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-display text-3xl"
            style={{ color }}
          >
            {score}%
          </motion.span>
          <span className="text-xs text-gray-400 font-medium">{label}</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-700 mt-2">ATS Match Score</p>
      <p className="text-xs text-gray-400 mt-0.5">Based on job description analysis</p>
    </div>
  )
}
