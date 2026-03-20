'use client'
import { useState, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TagInputProps {
  label: string
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  error?: string
  optional?: boolean
}

export function TagInput({ label, value, onChange, placeholder, error, optional }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const tag = input.trim()
    if (tag && !value.includes(tag)) {
      onChange([...value, tag])
    }
    setInput('')
  }

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag))

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
    if (e.key === 'Backspace' && !input && value.length) removeTag(value[value.length - 1])
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {optional && <span className="ml-1.5 text-xs font-normal text-gray-400">(optional)</span>}
      </label>
      <div className={`min-h-[48px] w-full px-3 py-2 rounded-xl border bg-white transition-all duration-150 flex flex-wrap gap-1.5 items-center focus-within:ring-2 ${error ? 'border-red-400 focus-within:ring-red-100' : 'border-gray-200 focus-within:border-brand-purple focus-within:ring-brand-purple/15'}`}>
        <AnimatePresence>
          {value.map((tag) => (
            <motion.span key={tag}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1 bg-brand-purple/8 border border-brand-purple/20 text-brand-purple text-xs font-semibold px-2.5 py-1 rounded-lg">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-[120px] text-sm text-gray-900 placeholder:text-gray-300 outline-none bg-transparent py-0.5"
        />
      </div>
      <p className="text-xs text-gray-400">Press Enter or comma to add</p>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
