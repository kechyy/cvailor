'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/dashboard/TopBar'
import A4PreviewFrame from '@/components/dashboard/A4PreviewFrame'
import { Button } from '@/components/ui/Button'
import { useCVBuilderStore } from '@/store/cvBuilderStore'

export default function PreviewFilledPage() {
  const router = useRouter()
  const { selectedFlow, selectedTemplateId, cvData } = useCVBuilderStore()

  useEffect(() => {
    if (!selectedFlow) router.replace('/')
    else if (selectedFlow === 'build') router.replace('/dashboard/editor')
    else if (!selectedTemplateId) router.replace('/dashboard/templates')
  }, [router, selectedFlow, selectedTemplateId])

  return (
    <>
      <TopBar title="Preview" subtitle="Your uploaded CV inside the chosen template" />
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <A4PreviewFrame templateId={selectedTemplateId || 'modern'} cv={cvData} />
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/templates')}>← Back</Button>
        <Button onClick={() => router.push('/dashboard/job-description')}>Next →</Button>
      </div>
    </>
  )
}
