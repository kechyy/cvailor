'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import AiHeroIllustration from './AiHeroIllustration'

const badges = ['No sign-up needed', 'AI-powered', '30 seconds']

export default function Hero() {
  const { setSelectedFlow, resetFlow } = useCVBuilderStore()

  const startFlow = (flow: 'build' | 'upload') => {
    resetFlow()
    setSelectedFlow(flow)
  }

  return (
    <section className="min-h-screen flex items-center pt-16 pb-2 px-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start pt-10">

          {/* Left */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col justify-start pt-4"
          >
            {/* AI badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-brand-purple/8 border border-brand-purple/20 rounded-full px-4 py-1.5 mb-6 self-start"
            >
              <motion.span
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >✦</motion.span>
              <span className="text-brand-purple text-sm font-semibold tracking-wide uppercase">
                AI Resume Builder
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-6xl lg:text-7xl leading-tight text-gray-900 mb-5">
              Your CV,{' '}
              <span className="text-gradient">tailored</span>{' '}
              for every job.
            </h1>

            <p className="text-gray-500 text-xl mb-8 max-w-md leading-relaxed">
              Paste a job description. AI rewrites your CV and cover letter to match — perfectly.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/dashboard/templates"
                onClick={() => startFlow('build')}
                className="bg-brand-purple text-white font-semibold text-base px-8 py-4 rounded-xl hover:bg-brand-purple/90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-purple/30 transition-all"
              >
                Build my CV →
              </Link>
              <Link
                href="/dashboard/upload"
                onClick={() => startFlow('upload')}
                className="bg-white text-gray-700 font-semibold text-base px-8 py-4 rounded-xl border border-gray-200 hover:border-brand-purple/40 hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                ↑ Upload existing CV
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {badges.map((b, i) => (
                <motion.span
                  key={b}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-1.5 text-sm text-gray-500 bg-white border border-gray-100 rounded-full px-3 py-1"
                >
                  <span className="text-brand-green">✓</span> {b}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right: Illustration — full height, aligned to top of content */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="flex justify-center items-start w-full"
          >
            <AiHeroIllustration />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
