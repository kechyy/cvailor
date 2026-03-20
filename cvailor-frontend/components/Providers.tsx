'use client'
import { SessionProvider } from 'next-auth/react'

// Wraps the app so useSession() and getSession() work in all client components.
// Must be a client component; layout.tsx is a server component so it renders this.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
