'use client'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="h-full bg-gradient-to-r from-brand-purple to-brand-green rounded-full"
        />
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-3.5 h-px bg-gray-100 -z-0" />
        {labels.map((label, i) => {
          const step = i + 1
          const isDone = step < currentStep
          const isActive = step === currentStep
          return (
            <div key={step} className="flex flex-col items-center gap-1.5 z-10">
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isDone ? '#2ECC8F' : isActive ? '#5B4FCF' : '#E5E7EB',
                }}
                transition={{ duration: 0.3 }}
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
              >
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                ) : (
                  <span className={clsx('text-[11px] font-bold', isActive ? 'text-white' : 'text-gray-400')}>
                    {step}
                  </span>
                )}
              </motion.div>
              <span className={clsx('text-[10px] font-medium hidden sm:block', isActive ? 'text-brand-purple' : 'text-gray-400')}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
