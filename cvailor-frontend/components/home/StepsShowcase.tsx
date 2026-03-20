'use client'
import { motion } from 'framer-motion'
import { useHomeUiStore } from '@/store/homeUiStore'
import StepPreviewPanel from './StepPreviewPanel'

const steps = [
  {
    number: 1,
    icon: '📄',
    title: 'Upload or build your CV',
    desc: 'Start fresh or import your existing resume in seconds.',
  },
  {
    number: 2,
    icon: '💼',
    title: 'Paste the job description',
    desc: 'AI identifies exactly what the employer is looking for.',
  },
  {
    number: 3,
    icon: '✦',
    title: 'AI tailors your CV',
    desc: 'Your resume and cover letter, rewritten to match the role.',
  },
  {
    number: 4,
    icon: '⬇',
    title: 'Download and apply',
    desc: 'One-click export to PDF. Sign in required.',
  },
]

export default function StepsShowcase() {
  const { activeStep, setActiveStep } = useHomeUiStore()

  return (
    <section
      id="steps"
      className="py-20 px-6"
      // style={{ background: 'linear-gradient(160deg, #E8EBF5 0%, #DDE1EF 50%, #E2E6F4 100%)' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-brand-purple text-xs font-semibold tracking-widest uppercase bg-brand-purple/10 border border-brand-purple/20 rounded-full px-4 py-1.5 mb-5">
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >✦</motion.span>
            How it works
          </div>

          <h2 className="font-display text-5xl lg:text-5xl text-gray-900 mb-4">
            Four steps to your{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #5B4FCF 0%, #2ECC8F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              dream job
            </span>
          </h2>
          <p className="text-gray-500 text-base">Click a step to preview what happens</p>
        </motion.div>

        {/* Layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Step cards */}
          <div className="space-y-3">
            {steps.map((step, i) => {
              const isActive = activeStep === i
              return (
                <motion.button
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple ${
                    isActive
                      ? 'bg-white border-brand-purple/30 shadow-lg shadow-brand-purple/10'
                      : 'bg-white/50 border-white/80 hover:bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                  aria-selected={isActive}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 transition-all duration-300 ${
                      isActive
                        ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/30'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-brand-purple/10 group-hover:text-brand-purple'
                    }`}>
                      {step.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-base transition-colors ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                        {step.icon} {step.title}
                      </div>
                      <div className="text-sm text-gray-400 mt-0.5 leading-relaxed">{step.desc}</div>
                    </div>
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.5 }}
                      className="w-2 h-2 rounded-full bg-brand-purple flex-shrink-0"
                    />
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="lg:hidden mt-4 overflow-hidden"
                    >
                      <StepPreviewPanel activeStep={activeStep} />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Preview panel desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block sticky top-24"
          >
            <StepPreviewPanel activeStep={activeStep} />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
