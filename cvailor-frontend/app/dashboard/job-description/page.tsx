'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCVBuilderStore } from '@/store/cvBuilderStore'

export default function JobDescriptionPage() {
  const router = useRouter()
  const { setEditorStep } = useCVBuilderStore()

  useEffect(() => {
    setEditorStep(4)
    router.replace('/dashboard/editor?step=4')
  }, [router, setEditorStep])

  return null
}
