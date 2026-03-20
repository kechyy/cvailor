'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import TopBar from '@/components/dashboard/TopBar'
import AtsScoreMeter from '@/components/dashboard/AtsScoreMeter'
import KeywordChips from '@/components/dashboard/KeywordChips'
import CoverLetterPanel from '@/components/dashboard/CoverLetterPanel'
import { renderTemplate, templateRegistry } from '@/components/dashboard/cv-templates/registry'
import {
  mockAtsScore,
  mockScoreBreakdown,
  mockMatchedKeywords,
  mockMissingKeywords,
  mockAtsTips,
  mockCoverLetter,
} from '@/mock/previewMock'
import { mockCV_TechSenior } from '@/mock/cvBuilderMock'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import type { ScoreBreakdown, TemplateId } from '@/types'

export default function PreviewPage() {
  const {
    selectedTemplate,
    setTemplate,
    personal,
    experience,
    education,
    skills,
    languages,
    certifications,
    atsResult,          // real ATS data set by StepJobDesc after API call
  } = useCVBuilderStore()

  const [activeTab, setActiveTab] = useState<'insights' | 'cover'>('insights')
  const [dismissedTips, setDismissedTips] = useState<number[]>([])

  const hasUserCv =
    Boolean(personal.fullName) ||
    experience.length > 0 ||
    education.length > 0 ||
    skills.length > 0 ||
    languages.length > 0 ||
    certifications.length > 0

  const cvData = hasUserCv
    ? { personal, experience, education, skills, languages, certifications }
    : mockCV_TechSenior

  // Use real ATS data from the backend if available, otherwise show mock data.
  // This means the page works correctly both after a real API submission
  // and when navigating directly during development.
  const atsScore        = atsResult?.ats_score        ?? mockAtsScore
  const scoreBreakdown: ScoreBreakdown = atsResult?.score_breakdown ?? mockScoreBreakdown
  const matchedKeywords = atsResult?.matched_keywords ?? mockMatchedKeywords
  const missingKeywords = atsResult?.missing_keywords ?? mockMissingKeywords
  const atsTips         = atsResult?.tips             ?? mockAtsTips

  const scoreItems = [
    { label: 'Keywords match',   value: scoreBreakdown.keywordsMatch,   color: '#5B4FCF' },
    { label: 'Experience fit',   value: scoreBreakdown.experienceFit,   color: '#2ECC8F' },
    { label: 'Skills alignment', value: scoreBreakdown.skillsAlignment, color: '#F59E0B' },
    { label: 'Summary strength', value: scoreBreakdown.summaryStrength, color: '#8B5CF6' },
  ]

  return (
    <>
      <TopBar
        title="Your tailored CV"
        subtitle="AI has matched your CV to the job description"
      />

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* Left — CV Preview */}
        <div className="space-y-4">
          {/* Template switcher */}
          <div className="flex gap-2 flex-wrap">
            {templateRegistry.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedTemplate === t.id
                    ? 'bg-brand-purple text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* CV render box */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTemplate}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderTemplate(selectedTemplate, { cv: cvData, matchedKeywords })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/dashboard/editor"
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-gray-300 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Use this template
            </Link>
          </div>
        </div>

        {/* Right — Insights panel */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-6">

          {/* ATS Score meter */}
          <div className="flex justify-center pt-2">
            <AtsScoreMeter score={atsScore} />
          </div>

          {/* Score breakdown */}
          <div className="space-y-3">
            {scoreItems.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-gray-100 mb-4">
              {(['insights', 'cover'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 pb-2.5 text-xs font-semibold transition-all ${
                    activeTab === tab
                      ? 'text-brand-purple border-b-2 border-brand-purple'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'insights' ? 'CV Insights' : 'Cover Letter'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'insights' ? (
                <motion.div key="insights"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="space-y-4"
                >
                  <KeywordChips matched={matchedKeywords} missing={missingKeywords} />

                  {/* ATS tips */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">AI suggestions</p>
                    <div className="space-y-2">
                      <AnimatePresence>
                        {atsTips.filter((_, i) => !dismissedTips.includes(i)).map((tip, i) => (
                          <motion.div key={tip}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5"
                          >
                            <span className="text-blue-500 flex-shrink-0 mt-0.5">💡</span>
                            <span className="text-xs text-blue-700 flex-1 leading-relaxed">{tip}</span>
                            <button onClick={() => setDismissedTips((d) => [...d, i])}
                              className="text-blue-400 hover:text-blue-600 flex-shrink-0 ml-1">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="cover"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <CoverLetterPanel
                    coverLetter={mockCoverLetter}
                    candidateName={cvData.personal.fullName}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}
