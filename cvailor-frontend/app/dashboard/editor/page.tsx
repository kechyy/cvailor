'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import TopBar from '@/components/dashboard/TopBar'
import { FormField } from '@/components/ui/FormField'
import { TextareaField } from '@/components/ui/TextareaField'
import { TagInput } from '@/components/ui/TagInput'
import { Button } from '@/components/ui/Button'
import A4PreviewFrame from '@/components/dashboard/A4PreviewFrame'
import { useCVBuilderStore } from '@/store/cvBuilderStore'
import { personalInfoSchema } from '@/lib/validations'
import type { CVData, EducationEntry, ExperienceEntry } from '@/types'
import { mockCV_TechSenior } from '@/mock/cvBuilderMock'
import { mockTemplates } from '@/mock/templatesMock'
import { getOrCreateResume, saveResume } from '@/lib/api/resumes'

const STEP_LABELS = ['Profile', 'Experience', 'Education & Skills', 'Job description']

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type FormValues = {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  linkedin?: string
  website?: string
  summary?: string
  skills: string[]
  languages: string[]
  certifications: string[]
}

export default function EditorPage() {
  const router = useRouter()
  const {
    selectedFlow,
    selectedTemplateId,
    cvData,
    setCvData,
    setSelectedFlow,
    setSelectedTemplateId,
    getCVData,
    editorStep,
    setEditorStep,
    nextEditorStep,
    prevEditorStep,
    jobDescription,
    setSelectedResumeId,
    setJobDescription,
  } = useCVBuilderStore()
  const [imported, setImported] = useState(false)

  // ── Copy-on-write resume state ─────────────────────────────────────────────
  const resumeIdRef = useRef<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [resumeLoaded, setResumeLoaded] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Guard: must have chosen a flow and template
  useEffect(() => {
    if (!selectedFlow) {
      setSelectedFlow('build')
      router.replace('/dashboard/templates')
    } else if (!selectedTemplateId) {
      router.replace('/dashboard/templates')
    }
  }, [router, selectedFlow, selectedTemplateId, setSelectedFlow])

  // Optional: pick step from query (?step=2)
  useEffect(() => {
    const url = new URL(window.location.href)
    const s = url.searchParams.get('step')
    if (s) {
      const num = Number(s)
      if (Number.isFinite(num)) setEditorStep(Math.min(Math.max(num, 1), 4))
    } else {
      setEditorStep(1)
    }
  }, [setEditorStep])

  // ── Load user resume from backend on mount (get-or-create) ────────────────
  useEffect(() => {
    if (!selectedTemplateId) return
    let cancelled = false

    async function load() {
      // Resolve this template's sample CV — used as placeholder for new users.
      const seed = mockTemplates.find((t) => t.id === selectedTemplateId)?.sampleCV ?? mockCV_TechSenior

      // Helper: populate both the store and the RHF form from any CVData object.
      const applyToForm = (data: CVData) => {
        setCvData(data)
        setSkills(data.skills ?? [])
        setLanguages(data.languages ?? [])
        setCertifications(data.certifications ?? [])
        const p = data.personal ?? {}
        setValue('fullName', p.fullName ?? '')
        setValue('jobTitle', p.jobTitle ?? '')
        setValue('email', p.email ?? '')
        setValue('phone', p.phone ?? '')
        setValue('location', p.location ?? '')
        setValue('linkedin', p.linkedin ?? '')
        setValue('website', p.website ?? '')
        setValue('summary', p.summary ?? '')
      }

      try {
        const resume = await getOrCreateResume(selectedTemplateId!)
        if (cancelled) return

        resumeIdRef.current = resume.id
        setSelectedResumeId(resume.id)

        // If user has previously saved real content, restore it; otherwise seed
        // BOTH panels with the template's sample so they see a fully-filled
        // starting point they can edit.  The template record itself is never
        // written — only the user's own user_resume will be saved later.
        const hasContent =
          resume.content?.personal?.fullName ||
          resume.content?.personal?.email ||
          (resume.content?.experience ?? []).length > 0

        applyToForm(hasContent ? (resume.content as CVData) : seed)
        setResumeLoaded(true)
      } catch {
        // Backend unavailable — seed with template placeholder so editor is usable.
        applyToForm(seed)
        setResumeLoaded(true)
      }
    }

    load()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId])

  // ── Debounced auto-save ────────────────────────────────────────────────────
  const triggerSave = useCallback((data: CVData) => {
    if (!resumeIdRef.current) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    setSaveStatus('saving')
    saveTimerRef.current = setTimeout(async () => {
      try {
        await saveResume(resumeIdRef.current!, data)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch {
        setSaveStatus('error')
      }
    }, 500)
  }, [])

  useEffect(() => () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
  }, [])

  const defaultValues = useMemo(() => ({
    fullName: cvData.personal.fullName,
    jobTitle: cvData.personal.jobTitle,
    email: cvData.personal.email,
    phone: cvData.personal.phone,
    location: cvData.personal.location,
    linkedin: cvData.personal.linkedin,
    website: cvData.personal.website,
    summary: cvData.personal.summary,
    skills: cvData.skills,
    languages: cvData.languages,
    certifications: cvData.certifications,
  }), [cvData])

  const [skills, setSkills] = useState<string[]>(cvData.skills)
  const [languages, setLanguages] = useState<string[]>(cvData.languages)
  const [certifications, setCertifications] = useState<string[]>(cvData.certifications)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [previousCv, setPreviousCv] = useState<CVData | null>(null)
  const isDev = process.env.NODE_ENV !== 'production'

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(personalInfoSchema.pick({
      fullName: true,
      jobTitle: true,
      email: true,
      phone: true,
      location: true,
      linkedin: true,
      website: true,
      summary: true,
    })),
    defaultValues,
    mode: 'onBlur',
  })
  register('skills')
  register('languages')
  register('certifications')

  const watched = useWatch({ control })

  const onSubmit = (data: FormValues) => {
    const updated: CVData = {
      ...cvData,
      personal: { ...cvData.personal, ...data },
      skills,
      languages,
      certifications,
    }
    setCvData(updated)
    triggerSave(updated)
    nextEditorStep()
  }

  const loadLongCv = () => {
    const longCv: CVData = {
      ...mockCV_TechSenior,
      experience: [...mockCV_TechSenior.experience, ...mockCV_TechSenior.experience].map((e, idx) => ({
        ...e,
        id: `${e.id}_long_${idx}`,
      })),
    }
    setCvData(longCv)
    setSkills(longCv.skills)
    setLanguages(longCv.languages)
    setCertifications(longCv.certifications)
    console.debug('[DEV] applied long CV for pagination test')
  }

  const importLinkedIn = () => {
    const url = (watched?.linkedin || '').trim()
    if (!url) {
      setImportError('Add your LinkedIn URL above before importing.')
      return
    }
    setImportError(null)
    setPreviousCv(cvData)
    setImporting(true)
    setTimeout(() => {
      setImported(true)
      setImporting(false)
    }, 900)
  }

  const revertImport = () => {
    if (!previousCv) return
    setCvData(previousCv)
    setSkills(previousCv.skills)
    setLanguages(previousCv.languages)
    setCertifications(previousCv.certifications)
    setImported(false)
    setPreviousCv(null)
  }

  const w = watched ?? {}

  // Right-panel preview: mirrors the left-panel form exactly in real-time.
  // Personal fields use the live watched values (updated on every keystroke).
  // Experience / education / tags come from cvData (updated on every onChange).
  // Both panels are seeded from the template's sampleCv when the user has no
  // saved content, so they always start from a fully-filled placeholder.
  const previewCv: CVData = {
    ...cvData,
    personal: {
      ...cvData.personal,
      fullName:   w.fullName   ?? cvData.personal.fullName,
      jobTitle:   w.jobTitle   ?? cvData.personal.jobTitle,
      email:      w.email      ?? cvData.personal.email,
      phone:      w.phone      ?? cvData.personal.phone,
      location:   w.location   ?? cvData.personal.location,
      linkedin:   w.linkedin   ?? cvData.personal.linkedin,
      website:    w.website    ?? cvData.personal.website,
      summary:    w.summary    ?? cvData.personal.summary,
    },
    skills,
    languages,
    certifications,
  }

  // Keep store CV data aligned with live preview; auto-save on every personal-field change.
  useEffect(() => {
    if (!watched) return
    const base = getCVData()
    // Extract only PersonalInfo fields from watched (exclude tag arrays registered separately)
    const { skills: _s, languages: _l, certifications: _c, ...personalFields } = watched
    const next: CVData = {
      ...base,
      personal: { ...base.personal, ...personalFields },
      skills: skills,
      languages: languages,
      certifications: certifications,
    }
    const changed =
      JSON.stringify(next.personal) !== JSON.stringify(base.personal) ||
      JSON.stringify(next.skills) !== JSON.stringify(base.skills) ||
      JSON.stringify(next.languages) !== JSON.stringify(base.languages) ||
      JSON.stringify(next.certifications) !== JSON.stringify(base.certifications)

    if (changed) {
      setCvData(next)
      triggerSave(next)
    }
  }, [watched, skills, languages, certifications, getCVData, setCvData, triggerSave])

  const updateExperience = (id: string, partial: Partial<ExperienceEntry>) => {
    const next = cvData.experience.map((e) => (e.id === id ? { ...e, ...partial } : e))
    const updated = { ...cvData, experience: next }
    setCvData(updated)
    triggerSave(updated)
  }
  const updateExperienceBullets = (id: string, text: string) => {
    updateExperience(id, { bullets: text.split('\n').filter((b) => b.trim()) })
  }
  const addExperience = () => {
    const entry: ExperienceEntry = {
      id: `exp_${Date.now()}`,
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      bullets: [''],
    }
    setCvData({ ...cvData, experience: [...cvData.experience, entry] })
  }
  const removeExperience = (id: string) => {
    const updated = { ...cvData, experience: cvData.experience.filter((e) => e.id !== id) }
    setCvData(updated)
    triggerSave(updated)
  }

  const updateEducation = (id: string, partial: Partial<EducationEntry>) => {
    const next = cvData.education.map((e) => (e.id === id ? { ...e, ...partial } : e))
    const updated = { ...cvData, education: next }
    setCvData(updated)
    triggerSave(updated)
  }
  const addEducation = () => {
    const entry: EducationEntry = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      year: '',
    }
    setCvData({ ...cvData, education: [...cvData.education, entry] })
  }
  const removeEducation = (id: string) => {
    const updated = { ...cvData, education: cvData.education.filter((e) => e.id !== id) }
    setCvData(updated)
    triggerSave(updated)
  }

  const goNext = () => {
    if (editorStep < 4) nextEditorStep()
    else router.push('/dashboard/tailor')
  }
  const goBack = () => {
    if (editorStep > 1) prevEditorStep()
  }

  useEffect(() => {
    if (editorStep < 1 || editorStep > 4) setEditorStep(1)
  }, [editorStep, setEditorStep])

  return (
    <>
      <TopBar
        title="Edit your CV"
        subtitle="Make quick tweaks before tailoring to a job"
        action={
          <div className="flex gap-2 text-xs text-gray-400 items-center">
            <SaveIndicator status={saveStatus} />
            <button onClick={() => { setSelectedFlow('build'); setSelectedTemplateId(selectedTemplateId || 'modern'); }} className="underline">Switch template</button>
            {isDev && (
              <button onClick={loadLongCv} className="underline text-brand-purple">
                Dev: long CV
              </button>
            )}
          </div>
        }
      />

      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-start">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-display text-xl text-gray-900">CV details</h3>
              <p className="text-sm text-gray-400">These fields feed directly into the template</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={importLinkedIn}
                disabled={importing}
                className="flex items-center gap-2 text-xs font-semibold text-white bg-[#0A66C2] px-3 py-1.5 rounded-lg hover:bg-[#084f96] disabled:opacity-60"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.2 8.2h4.6V24H.2zM8.34 8.2h4.41v2.15h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V24h-4.8v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.07V24h-4.8z"/>
                </svg>
                {importing ? 'Importing…' : 'Import from LinkedIn'}
              </button>
              {imported && (
                <button
                  type="button"
                  onClick={revertImport}
                  className="text-xs font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  Revert
                </button>
              )}
            </div>
          </div>

          {imported && (
            <p className="text-xs text-brand-green font-semibold flex items-center gap-1.5">
              <span>✓</span> LinkedIn import queued — your current data stayed unchanged. We'll sync once connected.
            </p>
          )}
          {importError && (
            <p className="text-xs text-red-500 font-semibold">{importError}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full grid place-items-center bg-brand-purple text-white text-xs font-bold">
                {editorStep}
              </div>
              <span className="text-sm font-semibold text-gray-800">{STEP_LABELS[editorStep - 1]}</span>
            </div>
            <span className="text-xs text-gray-400">Step {editorStep} of 4</span>
          </div>

          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-purple rounded-full transition-all duration-300"
              style={{ width: `${(editorStep / 4) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            {editorStep === 1 && (
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Full name" placeholder="Your name" error={errors.fullName?.message} {...register('fullName')} />
                  <FormField label="Job title" placeholder="Product Manager" error={errors.jobTitle?.message} {...register('jobTitle')} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="Email" type="email" placeholder="you@email.com" error={errors.email?.message} {...register('email')} />
                  <FormField label="Phone" type="tel" placeholder="+1 555 123 1234" error={errors.phone?.message} {...register('phone')} />
                </div>

                <FormField label="Location" placeholder="City, Country" error={errors.location?.message} {...register('location')} />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField label="LinkedIn" placeholder="linkedin.com/in/you" error={errors.linkedin?.message} {...register('linkedin')} />
                  <FormField label="Website" placeholder="yourportfolio.com" error={errors.website?.message} {...register('website')} />
                </div>

                <TextareaField
                  label="Professional summary"
                  placeholder="Short intro that highlights your strengths"
                  rows={4}
                  error={errors.summary?.message}
                  {...register('summary')}
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" size="lg">Next →</Button>
                </div>
              </motion.form>
            )}

            {editorStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800">Experience</h4>
                  <button onClick={addExperience} className="text-xs font-semibold text-brand-purple">+ Add role</button>
                </div>
                {cvData.experience.map((exp) => (
                  <div key={exp.id} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/40">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <FormField label="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, { company: e.target.value })} />
                      <FormField label="Role" value={exp.role} onChange={(e) => updateExperience(exp.id, { role: e.target.value })} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <FormField label="Start" value={exp.startDate} onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })} />
                      <FormField label="End" value={exp.endDate} onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })} />
                    </div>
                    <TextareaField
                      label="Bullets (one per line)"
                      rows={4}
                      value={exp.bullets.join('\n')}
                      onChange={(e) => updateExperienceBullets(exp.id, e.target.value)}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, { current: e.target.checked })} className="accent-brand-purple" />
                        Current role
                      </label>
                      {cvData.experience.length > 1 && (
                        <button className="text-red-500" onClick={() => removeExperience(exp.id)}>Remove</button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={goBack}>← Back</Button>
                  <Button onClick={goNext}>Next →</Button>
                </div>
              </motion.div>
            )}

            {editorStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-800">Education</h4>
                  <button onClick={addEducation} className="text-xs font-semibold text-brand-purple">+ Add education</button>
                </div>
                {cvData.education.map((edu) => (
                  <div key={edu.id} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/40">
                    <FormField label="Institution" value={edu.institution} onChange={(e) => updateEducation(edu.id, { institution: e.target.value })} />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <FormField label="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, { degree: e.target.value })} />
                      <FormField label="Field" value={edu.field} onChange={(e) => updateEducation(edu.id, { field: e.target.value })} />
                    </div>
                    <FormField label="Year" value={edu.year} onChange={(e) => updateEducation(edu.id, { year: e.target.value })} />
                    {cvData.education.length > 1 && (
                      <div className="flex justify-end">
                        <button className="text-red-500 text-xs" onClick={() => removeEducation(edu.id)}>Remove</button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="grid sm:grid-cols-2 gap-4">
                  <TagInput label="Skills" value={skills} onChange={(vals) => {
                    setSkills(vals)
                    setValue('skills', vals)
                    const updated = { ...getCVData(), skills: vals }
                    setCvData(updated)
                    triggerSave(updated)
                  }} />
                  <TagInput label="Languages" value={languages} onChange={(vals) => {
                    setLanguages(vals)
                    setValue('languages', vals)
                    const updated = { ...getCVData(), languages: vals }
                    setCvData(updated)
                    triggerSave(updated)
                  }} />
                </div>
                <TagInput label="Certifications" value={certifications} onChange={(vals) => {
                  setCertifications(vals)
                  setValue('certifications', vals)
                  const updated = { ...getCVData(), certifications: vals }
                  setCvData(updated)
                  triggerSave(updated)
                }} />
                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={goBack}>← Back</Button>
                  <Button onClick={goNext}>Next →</Button>
                </div>
              </motion.div>
            )}

            {editorStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-sm font-semibold text-gray-800">Job description</h4>
                <TextareaField
                  label="Paste job description"
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={goBack}>← Back</Button>
                  <Button onClick={goNext}>Continue to tailor →</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400">Live preview</p>
              <p className="text-sm font-semibold text-gray-700">{selectedTemplateId || 'modern'} template</p>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">A4 preview</span>
          </div>
          <div className="w-full max-w-[520px] mx-auto">
            <A4PreviewFrame templateId={selectedTemplateId || 'modern'} cv={previewCv} />
          </div>
        </div>
      </div>
    </>
  )
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null
  if (status === 'saving') return <span className="text-gray-400 animate-pulse">Saving…</span>
  if (status === 'saved') return <span className="text-green-500 font-semibold">Saved</span>
  if (status === 'error') return <span className="text-red-400">Save failed</span>
  return null
}
