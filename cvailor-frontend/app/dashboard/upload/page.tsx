'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TopBar from '@/components/dashboard/TopBar'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { mockCVData } from '@/mock/cvBuilderMock'

function mockParseToCv(text: string) {
  // Very light mock mapping: reuse mockCVData but mark summary with hint.
  return {
    ...mockCVData,
    personal: {
      ...mockCVData.personal,
      summary: `${mockCVData.personal.summary} (parsed from upload)`,
    },
  }
}

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const { setCvData, setUploadedCvText, setSelectedFlow, resetFlow } = useCVBuilderStore()
  const router = useRouter()

  const processFile = useCallback(async (f: File) => {
    setFile(f)
    setIsParsing(true)
    setSelectedFlow('upload')
    // Mock parse delay
    await new Promise((r) => setTimeout(r, 1400))
    const text = `Mock parsed text from ${f.name}`
    setUploadedCvText(text)
    setCvData(mockParseToCv(text))
    router.push('/dashboard/templates')
  }, [router, setCvData, setUploadedCvText, setSelectedFlow])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }, [processFile])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) processFile(f)
  }

  const startBuildInstead = () => {
    resetFlow()
    setSelectedFlow('build')
  }

  return (
    <>
      <TopBar title="Upload your CV" subtitle="We'll parse it and pre-fill your builder" />

      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {isParsing ? (
            <motion.div
              key="parsing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-100 rounded-2xl p-12 flex flex-col items-center text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-green flex items-center justify-center mb-5 shadow-xl shadow-brand-purple/25"
              >
                <span className="text-white text-xl">✦</span>
              </motion.div>
              <h3 className="font-display text-xl text-gray-800 mb-2">Parsing your CV</h3>
              <p className="text-sm text-gray-400 mb-1">{file?.name}</p>
              <motion.p
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs text-brand-purple font-medium"
              >
                AI is extracting your experience, skills, and education…
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative bg-white border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
                  isDragging
                    ? 'border-brand-purple bg-brand-purple/3 scale-[1.01]'
                    : 'border-gray-200 hover:border-brand-purple/50 hover:bg-gray-50/50'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <motion.div
                  animate={{ y: isDragging ? -4 : 0 }}
                  className="w-14 h-14 bg-brand-purple/8 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl"
                >
                  📄
                </motion.div>
                <h3 className="font-semibold text-gray-800 text-base mb-1">
                  {isDragging ? 'Drop it here!' : 'Drop your CV here'}
                </h3>
                <p className="text-sm text-gray-400 mb-4">PDF, DOC, DOCX, or TXT — up to 5MB</p>
                <div className="inline-flex items-center gap-2 bg-brand-purple text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
                  Choose file
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <Link href="/dashboard/templates"
                onClick={startBuildInstead}
                className="flex items-center justify-center gap-2 w-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold py-3.5 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Build from scratch instead
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
