'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-brand-purple to-[#7B6EE8] rounded-3xl p-12 text-center overflow-hidden"
        >
          {/* Background shimmer */}
          <div className="absolute inset-0 shimmer-bg opacity-20 pointer-events-none" />

          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-brand-green/20 blur-2xl" />

          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="text-4xl mb-4 block"
            >
              ✦
            </motion.div>

            <h2 className="font-display text-3xl lg:text-4xl text-white mb-3">
              Build your tailored CV<br />in minutes.
            </h2>
            <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
              More tools in your dashboard after sign in — tracking, reminders, templates, and more.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/cv"
                className="bg-white text-brand-purple font-bold px-8 py-3.5 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Get started — it&apos;s free
              </Link>
              <Link
                href="/auth/signin"
                className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all"
              >
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
