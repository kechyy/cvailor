'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TemplateCard from '@/components/dashboard/TemplateCard'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { fetchTemplates } from '@/lib/api/templates'
import { mockTemplates } from '@/mock/templatesMock'
import type { CVTemplate, JobCategory } from '@/types'

type Filter = { label: string; value: 'all' | JobCategory; description: string }

const filters: Filter[] = [
  { label: 'All',        value: 'all',       description: 'All 7 professional CV archetypes' },
  { label: 'Tech',       value: 'tech',      description: 'ATS-optimised for FAANG, startups & engineering roles' },
  { label: 'Finance',    value: 'finance',   description: 'Conservative serif for banking, law & accounting' },
  { label: 'General',    value: 'general',   description: 'Professional & Academic — works across industries' },
  { label: 'Academic',   value: 'general',   description: 'Education-first layouts for research & academia' },
  { label: 'Executive',  value: 'executive', description: 'Premium layouts for Director, VP & C-suite roles' },
  { label: 'Healthcare', value: 'healthcare',description: 'Clean, readable — passes NHS & hospital ATS systems' },
  { label: 'Creative',   value: 'creative',  description: 'Visual layouts for design, UX, media & branding' },
]

export default function TemplatesPage() {
  const { selectedTemplate, selectedFlow, setSelectedFlow } = useCVBuilderStore()
  const [activeFilter, setActiveFilter] = useState<Filter>(filters[0])
  const [templates, setTemplates] = useState<CVTemplate[]>(mockTemplates)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!selectedFlow) setSelectedFlow('build')
  }, [selectedFlow, setSelectedFlow])

  // Fetch from backend on mount and whenever the active category tab changes.
  // Falls back to mock data if the API is unreachable (dev without a running server).
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const { templates: apiTemplates } = await fetchTemplates(
          activeFilter.value !== 'all' ? activeFilter.value : undefined,
        )
        if (!cancelled) setTemplates(apiTemplates)
      } catch {
        if (!cancelled) {
          const fallback =
            activeFilter.value === 'all'
              ? mockTemplates
              : mockTemplates.filter((t) => t.categories.includes(activeFilter.value as JobCategory))
          setTemplates(fallback)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [activeFilter.value])

  const recommended = templates.find((t) => t.isAiRecommended)

  return (
    <div style={{ minHeight: '100vh' }}>
      <div className="w-full px-6 py-10">
        <div className="mb-6">
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#0F172A' }}>Templates</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 6 }}>You can always change it later.</p>
        </div>

        {recommended && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 w-full"
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'transparent',
              border: '1px solid #E1DBFF',
              color: '#4C3FB1',
              borderRadius: 12,
              padding: '12px 14px',
            }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  AI recommends <span style={{ textDecoration: 'underline' }}>{recommended.name}</span> for your profile
                </div>
                <div style={{ fontSize: 12, color: '#6B5FD6', marginTop: 3 }}>{recommended.industryReason}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {filters.map((f) => {
            const isActive = activeFilter.label === f.label
            return (
              <button
                key={f.label}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-2 text-sm font-semibold rounded-full transition-colors shrink-0"
                style={{
                  background: isActive ? '#5B4FCF' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#4B5563',
                  border: isActive ? '1px solid #5B4FCF' : '1px solid #E5E7EB',
                  boxShadow: isActive ? '0 10px 20px rgba(91,79,207,0.2)' : 'none',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter.label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="mb-5"
          >
            <p style={{ fontSize: 12, color: '#6B7280' }}>
              {activeFilter.description} — {loading ? '…' : `${templates.length} template${templates.length === 1 ? '' : 's'}`}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Template grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter.label}-grid`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TemplateCard
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  showReason={activeFilter.value !== 'all'}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ATS explanation */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AtsTile
            color="#2ECC8F"
            range="95–99%"
            text="Parsers read perfectly. Ideal for ATS-heavy workflows."
          />
          <AtsTile
            color="#F59E0B"
            range="85–94%"
            text="Most modern ATS handle this well; balanced visuals and structure."
          />
          <AtsTile
            color="#EF4444"
            range="75–84%"
            text="Highly visual; best for creative portfolios or direct hiring managers."
          />
        </div>
      </div>
    </div>
  )
}

function AtsTile({ color, range, text }: { color: string; range: string; text: string }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 12,
      padding: 14,
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
    }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, marginTop: 4 }} />
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{range}</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{text}</div>
      </div>
    </div>
  )
}
