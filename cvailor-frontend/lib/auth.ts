import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Backend URL used server-side only (not exposed to browser)
const API_BASE = process.env.NEXTAUTH_API_URL ?? 'http://localhost:8000'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        try {
          const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) return null

          const data = await res.json()

          return {
            id: data.user.id,
            name: data.user.full_name,
            email: data.user.email,
            image: data.user.avatar_url ?? null,
            accessToken: data.tokens.access_token,
            refreshToken: data.tokens.refresh_token,
          }
        } catch {
          return null
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user = {
        ...session.user,
        id: token.id,
      }
      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
}
