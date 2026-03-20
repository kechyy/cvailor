'use client'
import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  optional?: boolean
  options: { value: string; label: string }[]
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, optional, options, className, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1.5">
        <label htmlFor={fieldId} className="block text-sm font-semibold text-gray-700">
          {label}
          {optional && <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>}
        </label>
        <div className="relative">
          <select ref={ref} id={fieldId}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border text-gray-900 text-sm appearance-none bg-white',
              'focus:outline-none focus:ring-2 transition-all duration-150 pr-10',
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                : 'border-gray-200 focus:border-brand-purple focus:ring-brand-purple/15',
              className
            )}
            aria-invalid={!!error}
            {...props}
          >
            {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p role="alert"
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
SelectField.displayName = 'SelectField'
