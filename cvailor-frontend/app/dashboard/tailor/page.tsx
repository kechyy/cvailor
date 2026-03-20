'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import TopBar from '@/components/dashboard/TopBar'
import A4PreviewFrame from '@/components/dashboard/A4PreviewFrame'
import AtsScoreMeter from '@/components/dashboard/AtsScoreMeter'
import KeywordChips from '@/components/dashboard/KeywordChips'
import { Button } from '@/components/ui/Button'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { tailorCV } from '@/lib/api/ai'
import { ApiError } from '@/lib/api/client'
import { saveResume } from '@/lib/api/resumes'
import type { CVData, TailorResult } from '@/types'

// ── Constants ─────────────────────────────────────────────────────────────────

const JD_MIN_WORDS = 50
const JD_MAX_WORDS = 5_000

// ── Helpers ───────────────────────────────────────────────────────────────────

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

function wordCountColor(count: number): string {
  if (count === 0) return 'text-gray-400'
  if (count < JD_MIN_WORDS || count > JD_MAX_WORDS) return 'text-red-500'
  return 'text-green-500'
}

// ── Error banner ──────────────────────────────────────────────────────────────

function ErrorBanner({
  message,
  details,
  onRetry,
  onDismiss,
}: {
  message: string
  details?: Record<string, string>
  onRetry?: () => void
  onDismiss: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-2"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-red-700">{message}</p>
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600 text-lg leading-none flex-shrink-0">×</button>
      </div>
      {details && Object.keys(details).length > 0 && (
        <ul className="space-y-1">
          {Object.entries(details).map(([field, msg]) => (
            <li key={field} className="text-xs text-red-600">
              <span className="font-medium capitalize">{field.split('.').pop()?.replace(/_/g, ' ')}:</span> {msg}
            </li>
          ))}
        </ul>
      )}
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-semibold text-red-600 underline underline-offset-2 hover:text-red-800">
          Try again
        </button>
      )}
    </motion.div>
  )
}

// ── Diff panel — text-level comparison between original and tailored ──────────

function DiffRow({ label, before, after }: { label: string; before: string; after: string }) {
  if (before.trim() === after.trim()) return null
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        <div className="p-3">
          <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-1">Original</p>
          <p className="text-xs text-gray-500 leading-relaxed">{before}</p>
        </div>
        <div className="p-3 bg-green-50/40">
          <p className="text-[10px] font-semibold text-green-500 uppercase tracking-wider mb-1">Tailored</p>
          <p className="text-xs text-gray-800 leading-relaxed font-medium">{after}</p>
        </div>
      </div>
    </div>
  )
}

function SkillsDiff({ original, tailored }: { original: string[]; tailored: string[] }) {
  if (JSON.stringify(original) === JSON.stringify(tailored)) return null
  const origSet = new Set(original.map((s) => s.toLowerCase()))
  const tailSet = new Set(tailored.map((s) => s.toLowerCase()))
  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Skills — reordered for ATS</span>
      </div>
      <div className="p-3 flex flex-wrap gap-1.5">
        {tailored.map((s) => {
          const isNew = !origSet.has(s.toLowerCase())
          return (
            <span key={s} className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              isNew ? 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20' : 'bg-gray-100 text-gray-700'
            }`}>
              {isNew && <span className="mr-1">+</span>}{s}
            </span>
          )
        })}
        {original.filter((s) => !tailSet.has(s.toLowerCase())).map((s) => (
          <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-400 line-through">{s}</span>
        ))}
      </div>
    </div>
  )
}

function DiffPanel({ original, tailored }: { original: CVData; tailored: CVData }) {
  const rows: React.ReactNode[] = []

  if ((original.personal.summary ?? '') !== (tailored.personal.summary ?? '')) {
    rows.push(
      <DiffRow key="summary" label="Professional Summary"
        before={original.personal.summary ?? ''} after={tailored.personal.summary ?? ''}
      />
    )
  }

  tailored.experience.forEach((te) => {
    const oe = original.experience.find((e) => e.id === te.id)
    if (!oe) return
    te.bullets.forEach((bullet, bi) => {
      const orig = oe.bullets[bi] ?? ''
      if (bullet.trim() !== orig.trim()) {
        rows.push(
          <DiffRow key={`${te.id}-${bi}`}
            label={`${te.role} @ ${te.company} — bullet ${bi + 1}`}
            before={orig} after={bullet}
          />
        )
      }
    })
  })

  rows.push(<SkillsDiff key="skills" original={original.skills} tailored={tailored.skills} />)

  const visible = rows.filter(Boolean)
  if (visible.length === 0) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
        <p className="text-sm text-amber-700 font-medium">
          No text changes detected. Your CV may already be well-matched to this role — review the keyword analysis for details.
        </p>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {visible.length} section{visible.length !== 1 ? 's' : ''} rewritten
      </p>
      {visible}
    </div>
  )
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function TailoringSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex items-center gap-3 p-4 bg-brand-purple/5 rounded-xl border border-brand-purple/10"
    >
      <div className="w-5 h-5 rounded-full border-2 border-brand-purple border-t-transparent animate-spin flex-shrink-0" />
      <p className="text-sm font-medium text-brand-purple">Tailoring your CV with GPT-4…</p>
    </motion.div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TailorPage() {
  const router = useRouter()
  const {
    selectedFlow,
    selectedTemplateId,
    selectedTemplateBackendId,
    selectedResumeId,
    cvData,
    jobDescription,
    setCvData,
    setTailoredCvData,
  } = useCVBuilderStore()

  // Snapshot of CV sent to the API — used for the original panel and revert
  const originalCvRef = useRef<CVData>(cvData)

  const [localJd, setLocalJd] = useState(jobDescription)
  const [isLoading, setIsLoading] = useState(false)
  const [tailorResult, setTailorResult] = useState<TailorResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<Record<string, string>>({})
  const [canRetry, setCanRetry] = useState(false)
  const [activeTab, setActiveTab] = useState<'changes' | 'improvements' | 'suggestions'>('changes')

  useEffect(() => {
    if (!selectedFlow || !selectedTemplateId) router.replace('/dashboard/templates')
  }, [router, selectedFlow, selectedTemplateId])

  const wordCount = countWords(localJd)
  const jdValid = wordCount >= JD_MIN_WORDS && wordCount <= JD_MAX_WORDS
  const templateId = selectedTemplateId || 'modern'

  function handleError(err: unknown, retryable = false) {
    setCanRetry(retryable)
    if (err instanceof ApiError) {
      if (Object.keys(err.details).length > 0) setErrorDetails(err.details)
      setErrorMsg(err.message || `Request failed (${err.status}).`)
      if (err.status === 429) setCanRetry(false)
      return
    }
    setErrorMsg('Something went wrong. Please check your connection and try again.')
    setCanRetry(true)
  }

  async function runTailor() {
    if (!jdValid || isLoading) return
    originalCvRef.current = cvData
    setIsLoading(true)
    setErrorMsg(null)
    setErrorDetails({})
    setTailorResult(null)
    setActiveTab('changes')

    try {
      const result = await tailorCV({
        cv_data: cvData,
        job_description: localJd,
        template_id: selectedTemplateBackendId ?? undefined,
      })
      // Apply immediately so the tailored preview reflects the result in the user's template
      setCvData(result.tailored_cv)
      setTailoredCvData(result.tailored_cv)
      setTailorResult(result)
    } catch (err) {
      handleError(err, true)
    } finally {
      setIsLoading(false)
    }
  }

  function revertToOriginal() {
    setCvData(originalCvRef.current)
    setTailoredCvData(null)
    setTailorResult(null)
  }

  async function acceptAndContinue() {
    if (!tailorResult) return
    if (selectedResumeId) {
      try { await saveResume(selectedResumeId, cvData) } catch { /* non-fatal */ }
    }
    router.push('/dashboard/download')
  }

  return (
    <>
      <TopBar
        title="AI Tailor CV"
        subtitle="GPT-4 rewrites your CV to match the job description"
      />

      {/* ── Same grid as preview page: left = content | right = ATS aside ── */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* ── Left column: job description + CVs + tabs ── */}
        <div className="space-y-4">

          {/* Job description */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-gray-900">Job description</h3>
                <p className="text-xs text-gray-400 mt-0.5">Paste the full job posting for best results</p>
              </div>
              <span className={`text-xs font-semibold tabular-nums ${wordCountColor(wordCount)}`}>
                {wordCount.toLocaleString()} / {JD_MAX_WORDS.toLocaleString()} words
                {wordCount > 0 && wordCount < JD_MIN_WORDS && (
                  <span className="ml-1 font-normal">— min {JD_MIN_WORDS} needed</span>
                )}
              </span>
            </div>

            <textarea
              value={localJd}
              onChange={(e) => setLocalJd(e.target.value)}
              rows={5}
              placeholder="Paste the job description here…"
              className={`w-full px-4 py-3 rounded-xl border text-gray-900 text-sm placeholder:text-gray-300
                focus:outline-none focus:ring-2 transition-all duration-150 bg-white resize-none
                ${wordCount > 0 && !jdValid
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                  : 'border-gray-200 focus:border-brand-purple focus:ring-brand-purple/15'
                }`}
            />

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-gray-400">
                {jdValid ? '✓ Ready to tailor'
                  : wordCount === 0 ? 'Paste a job description to get started'
                  : wordCount < JD_MIN_WORDS ? `Add ${JD_MIN_WORDS - wordCount} more words`
                  : `Remove ${wordCount - JD_MAX_WORDS} words`}
              </p>
              <Button onClick={runTailor} loading={isLoading} disabled={!jdValid || isLoading} size="lg">
                {isLoading ? 'Tailoring…' : tailorResult ? 'Re-tailor' : 'Tailor My CV'}
              </Button>
            </div>
          </div>

          {/* Error / Loading */}
          <AnimatePresence>
            {errorMsg && !isLoading && (
              <ErrorBanner key="error" message={errorMsg} details={errorDetails}
                onRetry={canRetry ? runTailor : undefined}
                onDismiss={() => { setErrorMsg(null); setErrorDetails({}) }}
              />
            )}
            {isLoading && <TailoringSkeleton key="skeleton" />}
          </AnimatePresence>

            {/* Original | Tailored side-by-side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Original CV */}
              <div className={`bg-white border border-gray-100 rounded-2xl p-4 transition-opacity ${tailorResult ? '' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Original CV</p>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">A4</span>
                </div>
                <A4PreviewFrame
                  templateId={templateId}
                  cv={tailorResult ? originalCvRef.current : cvData}
                />
              </div>

              {/* Tailored CV */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-700">Tailored CV</p>
                    {tailorResult && (
                      <span className="text-[10px] font-semibold bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-full">
                        GPT-4
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">A4</span>
                </div>
                {tailorResult ? (
                  <A4PreviewFrame templateId={templateId} cv={tailorResult.tailored_cv} />
                ) : (
                  <div className="aspect-[210/297] w-full bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
                        <p className="text-xs text-gray-400">Tailoring…</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 text-center px-4">
                        Tailored version appears here after running the AI tailor
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tabs: what changed | improvements | suggestions — only after result */}
            <AnimatePresence>
              {tailorResult && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
                >
                  <div className="flex border-b border-gray-100">
                    {(['changes', 'improvements', 'suggestions'] as const).map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${
                          activeTab === tab
                            ? 'text-brand-purple border-b-2 border-brand-purple'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {tab === 'changes'
                          ? 'What changed'
                          : tab === 'improvements'
                            ? `Improvements (${tailorResult.improvements_made.length})`
                            : `Tips (${tailorResult.suggestions.length})`}
                      </button>
                    ))}
                  </div>

                  <div className="p-5">
                    {activeTab === 'changes' && (
                      <DiffPanel original={originalCvRef.current} tailored={tailorResult.tailored_cv} />
                    )}
                    {activeTab === 'improvements' && (
                      tailorResult.improvements_made.length > 0
                        ? <ul className="space-y-2">
                            {tailorResult.improvements_made.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        : <p className="text-sm text-gray-400">No improvements listed.</p>
                    )}
                    {activeTab === 'suggestions' && (
                      tailorResult.suggestions.length > 0
                        ? <div className="space-y-2">
                            {tailorResult.suggestions.map((tip, i) => (
                              <div key={i} className="flex items-start gap-3 bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-3">
                                <svg className="flex-shrink-0 mt-0.5 w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-blue-800">{tip}</p>
                              </div>
                            ))}
                          </div>
                        : <p className="text-sm text-gray-400">No suggestions available.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-1">
              <Button variant="ghost" onClick={() => router.push('/dashboard/editor?step=4')}>
                ← Edit CV
              </Button>
              {!tailorResult && (
                <Button variant="secondary" onClick={() => router.push('/dashboard/download')}>
                  Continue without tailoring →
                </Button>
              )}
            </div>
        </div>

        {/* ── Right aside — ATS score + actions (mirrors preview page) ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-6">

            {tailorResult ? (
              <>
                {/* ATS score */}
                <div className="flex justify-center pt-2">
                  <AtsScoreMeter score={tailorResult.ats_score} />
                </div>

                {/* Keyword chips */}
                <KeywordChips
                  matched={tailorResult.matched_keywords}
                  missing={tailorResult.missing_keywords}
                />

                {/* AI tips (suggestions) */}
                {tailorResult.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">AI suggestions</p>
                    <div className="space-y-2">
                      {tailorResult.suggestions.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                          <span className="text-blue-500 flex-shrink-0 mt-0.5 text-xs">💡</span>
                          <span className="text-xs text-blue-700 leading-relaxed">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <Button onClick={acceptAndContinue} className="w-full justify-center">
                    Accept & Download →
                  </Button>
                  <button
                    onClick={revertToOriginal}
                    className="w-full text-xs text-gray-500 hover:text-red-600 py-2 transition-colors underline underline-offset-2"
                  >
                    Revert to original CV
                  </button>
                </div>
              </>
            ) : (
              /* Empty state before tailoring */
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-purple/8 flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-purple/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">ATS analysis</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Paste a job description and run the AI tailor to see your ATS score, matched keywords, and improvement tips.
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  )
}
