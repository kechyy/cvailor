'use client'
import { useEffect } from 'react'
import { useCVBuilderStore } from '@/store/cvBuilderStore'

// Ensures a clean state when arriving on the marketing home page.
export default function FlowInit() {
  const { resetFlow } = useCVBuilderStore()
  useEffect(() => {
    resetFlow()
  }, [resetFlow])
  return null
}
