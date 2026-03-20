'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/dashboard/TopBar'
import A4PreviewFrame from '@/components/dashboard/A4PreviewFrame'
import { Button } from '@/components/ui/Button'
import { useCVBuilderStore } from '@/store/cvBuilderStore'

export default function DownloadPage() {
  const router = useRouter()
  const { selectedFlow, selectedTemplateId, cvData, tailoredCvData, resetFlow } = useCVBuilderStore()
  const finalCv = tailoredCvData ?? cvData

  useEffect(() => {
    if (!selectedFlow) {
      router.replace('/dashboard/templates')
    } else if (!selectedTemplateId) {
      router.replace('/dashboard/templates')
    }
  }, [router, selectedFlow, selectedTemplateId])

  const mockDownload = (type: 'pdf' | 'docx') => {
    alert(`Download (${type.toUpperCase()}) coming soon`)
  }

  const startOver = () => {
    resetFlow()
    router.push('/')
  }

  return (
    <>
      <TopBar title="Download" subtitle="Exports are mocked — flow is complete" />

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-700">Final CV</p>
            <p className="text-xs text-gray-400">Template: {selectedTemplateId}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => mockDownload('pdf')}>Download PDF</Button>
            <Button variant="secondary" onClick={() => mockDownload('docx')}>Download DOCX</Button>
          </div>
        </div>
        <A4PreviewFrame templateId={selectedTemplateId || 'modern'} cv={finalCv} />
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="ghost" onClick={() => router.push('/dashboard/tailor')}>← Back</Button>
        <Button variant="secondary" onClick={startOver}>Start over</Button>
      </div>
    </>
  )
}
