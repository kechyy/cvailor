'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const navItems = [
  { href: '/dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, label: 'Home' },
  { href: '/dashboard/cvs', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>, label: 'CVs' },
  { href: '/dashboard/cv/new', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, label: 'New', primary: true },
  { href: '/dashboard/templates', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>, label: 'Templates' },
  { href: '/dashboard/settings', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>, label: 'Settings' },
]

export default function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all',
                item.primary
                  ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/30 -translate-y-2 px-4'
                  : isActive ? 'text-brand-purple' : 'text-gray-400 hover:text-gray-600'
              )}>
              {item.icon}
              <span className="text-[9px] font-semibold">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
