'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Check your inbox"
      subtitle="We sent a verification link to your email"
    >
      {/* Animated envelope */}
      <div className="flex flex-col items-center text-center py-4">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 bg-brand-purple/8 border border-brand-purple/15 rounded-3xl flex items-center justify-center mb-6"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5B4FCF" strokeWidth="1.6">
            <rect x="2" y="4" width="20" height="16" rx="3"/>
            <path d="M2 8l10 6 10-6"/>
          </svg>
        </motion.div>

        <p className="text-gray-500 text-sm leading-relaxed mb-2 max-w-[300px]">
          We sent a link to <span className="text-gray-800 font-semibold">you@example.com</span>.
          Click it to verify your account and get started.
        </p>
        <p className="text-gray-400 text-xs mb-8">Didn&apos;t get it? Check your spam folder.</p>

        {/* Resend */}
        <button className="text-sm text-brand-purple font-semibold hover:underline mb-6">
          Resend verification email
        </button>

        {/* Countdown hint */}
        <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse flex-shrink-0" />
          <span className="text-xs text-gray-400">Link expires in <span className="text-gray-700 font-semibold">15 minutes</span></span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        <Link href="/auth/signin" className="text-brand-purple font-semibold hover:underline">← Back to sign in</Link>
      </p>
    </AuthLayout>
  )
}
