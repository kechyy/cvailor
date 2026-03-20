'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Real photo from Unsplash (free to use, no auth needed)
// Professional woman — makes the CV card feel real and human
const PHOTO_URL = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face&auto=format&q=80'

export default function AiHeroIllustration() {
  return (
    <div className="relative w-full max-w-[520px] select-none">

      {/* Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-purple/15 via-brand-green/10 to-brand-sky/20 blur-3xl scale-110 pointer-events-none" />

      {/* Main CV card */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ animation: 'float 4s ease-in-out infinite' }}
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-7"
      >
        {/* Top label */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Your CV Preview</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
            className="flex items-center gap-1.5 bg-brand-green/10 border border-brand-green/25 rounded-full px-3 py-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green inline-block" />
            <span className="text-[11px] text-brand-green font-semibold">AI Tailored</span>
          </motion.div>
        </div>

        {/* Person info — REAL photo */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-50">
          <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-brand-purple/20 ring-offset-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTO_URL}
              alt="CV owner"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-base font-bold text-gray-800">Sarah Mitchell</div>
            <div className="text-sm text-gray-400 mt-0.5">Senior Product Designer</div>
            <div className="text-xs text-gray-300 mt-0.5">London, UK · sarah@email.com</div>
          </div>
        </div>

        {/* CV body sections */}
        <div className="space-y-4 mb-5">
          <div>
            <div className="text-[9px] uppercase font-bold text-gray-300 tracking-widest mb-2">Summary</div>
            <div className="space-y-1.5">
              {[88, 75, 60].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-gray-100" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase font-bold text-gray-300 tracking-widest mb-2">Experience</div>
            <div className="space-y-1.5">
              {[92, 70, 80, 55].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-gray-100" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase font-bold text-gray-300 tracking-widest mb-2">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {['Figma', 'UX Research', 'Prototyping', 'Design Systems', 'Framer'].map(skill => (
                <span key={skill} className="text-[11px] bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5 text-gray-500 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI tailoring bar */}
        <div className="bg-brand-purple/6 border border-brand-purple/15 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-brand-purple">✦ AI is matching this CV to your job post</span>
            <span className="text-xs text-brand-purple font-bold">87%</span>
          </div>
          <div className="h-1.5 bg-brand-purple/10 rounded-full overflow-hidden mb-2.5">
            <motion.div
              animate={{ width: ['0%', '87%'] }}
              transition={{ duration: 2, ease: 'easeOut', repeat: Infinity, repeatDelay: 2 }}
              className="h-full bg-gradient-to-r from-brand-purple to-brand-green rounded-full"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400">Rewriting summary</span>
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, delay }}
                className="w-1 h-1 rounded-full bg-gray-300 inline-block"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating chip: job match */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        style={{ animation: 'float 5s ease-in-out infinite 0.5s' }}
        className="absolute -left-6 top-14 bg-white shadow-xl border border-gray-100 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 z-10"
      >
        <span className="text-xl">🎯</span>
        <div>
          <div className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Job Match</div>
          <div className="text-base text-brand-green font-bold leading-none">94%</div>
        </div>
      </motion.div>

      {/* Floating chip: time */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9 }}
        style={{ animation: 'float 4.5s ease-in-out infinite 1s' }}
        className="absolute -right-6 bottom-20 bg-white shadow-xl border border-gray-100 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 z-10"
      >
        <span className="text-xl">⚡</span>
        <div>
          <div className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Ready in</div>
          <div className="text-base text-brand-purple font-bold leading-none">30 sec</div>
        </div>
      </motion.div>

      {/* Small floating testimonial — real human touch */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        style={{ animation: 'float 6s ease-in-out infinite 2s' }}
        className="absolute -bottom-4 left-8 bg-white shadow-xl border border-gray-100 rounded-2xl px-4 py-2.5 flex items-center gap-3 z-10 max-w-[220px]"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format&q=80"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="text-[10px] text-gray-700 font-semibold leading-tight">&quot;Got 3 interviews in a week!&quot;</div>
          <div className="text-[9px] text-gray-400 mt-0.5">— James K., Software Engineer</div>
        </div>
      </motion.div>

    </div>
  )
}
