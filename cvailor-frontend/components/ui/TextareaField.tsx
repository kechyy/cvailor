'use client'
import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  charCount?: number
  maxChars?: number
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, hint, optional, charCount, maxChars, className, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={fieldId} className="block text-sm font-semibold text-gray-700">
            {label}
            {optional && <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>}
          </label>
          {maxChars && charCount !== undefined && (
            <span className={clsx('text-xs', charCount > maxChars * 0.9 ? 'text-orange-400' : 'text-gray-400')}>
              {charCount}/{maxChars}
            </span>
          )}
          {hint && !maxChars && <span className="text-xs text-gray-400">{hint}</span>}
        </div>
        <textarea
          ref={ref}
          id={fieldId}
          rows={4}
          className={clsx(
            'w-full px-4 py-3 rounded-xl border text-gray-900 text-sm placeholder:text-gray-300',
            'focus:outline-none focus:ring-2 transition-all duration-150 bg-white resize-none',
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
              : 'border-gray-200 focus:border-brand-purple focus:ring-brand-purple/15',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        <AnimatePresence mode="wait">
          {error && (
            <motion.p id={`${fieldId}-error`} role="alert"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-1.5 text-xs text-red-500 font-medium pt-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
TextareaField.displayName = 'TextareaField'
