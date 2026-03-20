'use client'
import { motion, AnimatePresence } from 'framer-motion'

// Real photo for the download preview step
const PHOTO_URL = 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&crop=face&auto=format&q=80'

function UploadVisual() {
  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-brand-purple/30 rounded-xl p-6 text-center bg-brand-purple/3">
        <div className="text-3xl mb-2">📄</div>
        <div className="text-sm font-semibold text-gray-700">Drop your CV here</div>
        <div className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX</div>
        <div className="mt-3 flex justify-center gap-2">
          <div className="bg-brand-purple text-white text-xs px-3 py-1.5 rounded-lg font-semibold">Upload CV</div>
          <div className="border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-medium">Start fresh</div>
        </div>
      </div>
      <div className="flex gap-2">
        {['Name', 'Role', 'Skills'].map(l => (
          <div key={l} className="flex-1 bg-white border border-gray-100 rounded-lg p-2 text-center text-xs text-gray-400">{l}</div>
        ))}
      </div>
    </div>
  )
}

function JobDescVisual() {
  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Job Description</div>
        <div className="space-y-1.5">
          {[95, 80, 70, 90, 60].map((w, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.08 }}
              className="origin-left h-2 rounded-full bg-gray-100"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="bg-brand-green/10 border border-brand-green/25 rounded-xl px-4 py-3 flex items-center gap-2"
      >
        <span className="text-brand-green">✦</span>
        <span className="text-brand-green text-xs font-semibold">AI detecting 12 key requirements…</span>
      </motion.div>
    </div>
  )
}

function TailoringVisual() {
  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-700">Tailoring your CV…</span>
          <span className="text-xs text-brand-purple font-bold">87%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: ['0%', '87%'] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-brand-purple to-brand-green rounded-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['Summary ✓', 'Skills ✓', 'Experience ✓', 'Cover Letter…'].map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 }}
            className={`text-xs rounded-lg px-3 py-2 font-medium text-center ${
              item.includes('…')
                ? 'bg-brand-purple/8 text-brand-purple border border-brand-purple/20'
                : 'bg-brand-green/10 text-brand-green border border-brand-green/20'
            }`}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DownloadVisual() {
  return (
    <div className="space-y-3">
      {/* CV row with real photo */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-brand-purple/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO_URL} alt="CV" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-800">Sarah_Mitchell_CV.pdf</div>
          <div className="text-xs text-gray-400">Tailored for Google UX Lead</div>
        </div>
        <motion.div
          animate={{ y: [0, 2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-brand-green text-white text-xs px-3 py-1.5 rounded-lg font-semibold"
        >
          ↓ PDF
        </motion.div>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-purple/8 border border-brand-purple/15 rounded-full flex items-center justify-center text-lg flex-shrink-0">
          ✉️
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-800">Cover_Letter.pdf</div>
          <div className="text-xs text-gray-400">AI-written, role-specific</div>
        </div>
        <div className="bg-brand-purple text-white text-xs px-3 py-1.5 rounded-lg font-semibold">↓ PDF</div>
      </div>
      <div className="text-center text-xs text-gray-400 bg-gray-50 rounded-xl py-2.5">
        🔒 Sign in required to download
      </div>
    </div>
  )
}

const previews = [
  { icon: '📄', title: 'Upload or Build',       Component: UploadVisual    },
  { icon: '💼', title: 'Paste Job Description',  Component: JobDescVisual   },
  { icon: '✦',  title: 'AI Tailors Everything',  Component: TailoringVisual },
  { icon: '⬇',  title: 'Download & Apply',       Component: DownloadVisual  },
]

export default function StepPreviewPanel({ activeStep }: { activeStep: number }) {
  const preview = previews[activeStep]

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6 h-full min-h-[300px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">{preview.icon}</span>
            <span className="text-sm font-semibold text-gray-700">{preview.title}</span>
            <span className="ml-auto text-xs text-brand-purple bg-brand-purple/8 px-2 py-0.5 rounded-full font-medium">
              Step {activeStep + 1}
            </span>
          </div>
          <preview.Component />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
