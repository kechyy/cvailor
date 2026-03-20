'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { mockUser } from '@/mock/dashboardMock'
import { useCVBuilderStore } from '@/store/cvBuilderStore'

const navItems = [
  { label: 'Overview',   href: '/dashboard',            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'My CVs',     href: '/dashboard/cvs',        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg> },
  { label: 'Templates',  href: '/dashboard/templates',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> },
  { label: 'Job Matches',href: '/dashboard/jobs',       icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, soon: true },
  { label: 'Settings',   href: '/dashboard/settings',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>, soon: true },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { setSelectedFlow, resetFlow } = useCVBuilderStore()

  const startBuild = () => {
    resetFlow()
    setSelectedFlow('build')
  }
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-gray-100 fixed left-0 top-0 z-40"
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-green flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-display text-xl text-gray-900">Cvailor</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.soon ? '#' : item.href}
              onClick={() => {
                if (item.href === '/dashboard/templates') {
                  startBuild()
                }
              }}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-brand-purple/8 text-brand-purple'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
                item.soon && 'opacity-50 cursor-not-allowed'
              )}>
              <span className={clsx('transition-colors', isActive ? 'text-brand-purple' : 'text-gray-400 group-hover:text-gray-600')}>
                {item.icon}
              </span>
              {item.label}
              {item.soon && <span className="ml-auto text-[9px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Soon</span>}
              {isActive && <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-purple" />}
            </Link>
          )
        })}
      </nav>

      {/* Build new CV CTA */}
      <div className="px-3 pb-3">
        <Link href="/dashboard/templates"
          onClick={startBuild}
          className="flex items-center justify-center gap-2 w-full bg-brand-purple text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-brand-purple/90 transition-all hover:shadow-md hover:shadow-brand-purple/20">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Build new CV
        </Link>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-brand-purple/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">{mockUser.name}</div>
            <div className="text-xs text-gray-400 truncate">{mockUser.email}</div>
          </div>
          <Link href="/auth/signin" className="text-gray-400 hover:text-gray-600 transition-colors" title="Sign out">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </Link>
        </div>
      </div>
    </motion.aside>
  )
}
