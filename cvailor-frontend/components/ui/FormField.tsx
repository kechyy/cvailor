'use client'
import { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  optional?: boolean
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, optional, className, type = 'text', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={fieldId} className="block text-sm font-semibold text-gray-700">
            {label}
            {optional && <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>}
          </label>
          {hint && <span className="text-xs text-gray-400">{hint}</span>}
        </div>
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            type={inputType}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border text-gray-900 text-sm placeholder:text-gray-300',
              'focus:outline-none focus:ring-2 transition-all duration-150 bg-white',
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 focus:border-brand-purple focus:ring-brand-purple/15',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            {...props}
          />
          {isPassword && (
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          )}
        </div>
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
FormField.displayName = 'FormField'
