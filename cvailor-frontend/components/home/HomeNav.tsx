'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomeNav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-green flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="font-display text-xl text-gray-900">Smart<span className="text-brand-purple">CV</span></span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
            How it works
          </a>
          <a href="#steps" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
            Templates
          </a>
          <Link href="/auth/signin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
            Sign in
          </Link>
        </div>

        {/* CTA */}
        <Link
          href="/cv"
          className="bg-brand-purple hover:bg-brand-purple/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-purple/25 hover:-translate-y-0.5"
        >
          Get started →
        </Link>
      </div>
    </motion.nav>
  )
}
