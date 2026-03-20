'use client'
import TopBar from '@/components/dashboard/TopBar'

export default function JobsPage() {
  return (
    <>
      <TopBar title="Job Matches" subtitle="Coming soon" />
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="font-display text-2xl text-gray-800 mb-2">Job Matches</h2>
        <p className="text-gray-400 text-sm max-w-sm">AI-powered job matching based on your CV profile. Coming in the next release.</p>
      </div>
    </>
  )
}
