'use client'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  children?: ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-brand-purple text-white hover:bg-brand-purple/90 hover:shadow-lg hover:shadow-brand-purple/25',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm',
    ghost: 'text-gray-500 hover:text-gray-800 hover:bg-gray-100',
    danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
  }
  const sizes = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-7 py-3.5',
  }

  return (
    <motion.button
      whileHover={{ y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.99 }}
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      ) : icon}
      {children}
    </motion.button>
  )
}
