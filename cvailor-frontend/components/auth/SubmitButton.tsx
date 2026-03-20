'use client'
import { motion } from 'framer-motion'

interface SubmitButtonProps {
  label: string
  loading?: boolean
}

export default function SubmitButton({ label, loading }: SubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      whileHover={{ y: -1, boxShadow: '0 8px 24px rgba(91,79,207,0.35)' }}
      whileTap={{ scale: 0.99 }}
      disabled={loading}
      className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-sm py-3.5 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Processing…
        </>
      ) : label}
    </motion.button>
  )
}
