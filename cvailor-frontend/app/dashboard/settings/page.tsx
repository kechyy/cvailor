'use client'
import TopBar from '@/components/dashboard/TopBar'

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" subtitle="Manage your account" />
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">⚙️</div>
        <h2 className="font-display text-2xl text-gray-800 mb-2">Settings</h2>
        <p className="text-gray-400 text-sm max-w-sm">Account settings and preferences. Coming soon.</p>
      </div>
    </>
  )
}
