import NextAuth from 'next-auth'

import { authOptions } from '@/lib/auth'

// Cast to any: next-auth v4 attaches `authOptions` as a property on the handler
// function, which Next.js 14's route type checker rejects as an invalid export field.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = NextAuth(authOptions) as any
export { handler as GET, handler as POST }
