'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Lightweight top progress indicator for route changes in the App Router.
export default function RouteProgress() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Trigger a short loading bar whenever the URL changes.
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="route-progress"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed top-0 left-0 h-[3px] z-[90] bg-gradient-to-r from-brand-purple via-brand-green to-brand-purple"
        />
      )}
    </AnimatePresence>
  )
}
