import { getSession } from 'next-auth/react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  /** Field-level error details from the {error:{code,message,details}} envelope. */
  readonly details: Record<string, string>

  constructor(
    public readonly status: number,
    message: string,
    details: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.details = details
  }

  get isUnauthorized() { return this.status === 401 }
  get isNotFound() { return this.status === 404 }
  get isConflict() { return this.status === 409 }
}

async function getAccessToken(): Promise<string | null> {
  const session = await getSession()
  return (session as any)?.accessToken ?? null
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAccessToken()

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  // 204 No Content — DELETE responses return no body
  if (res.status === 204) return undefined as T

  const body = await res.json().catch(() => ({}))

  if (!res.ok) {
    // Our error envelope: { error: { code, message, details } }
    // FastAPI validation: { detail: "..." }  — fallback for unexpected shapes
    const envelope = body?.error
    const message = envelope?.message ?? body?.detail ?? `Request failed: ${res.status}`
    const details: Record<string, string> = envelope?.details ?? {}
    throw new ApiError(res.status, message, details)
  }

  return body as T
}

// Convenience wrappers used by domain API modules
export const api = {
  get: <T>(path: string) =>
    apiRequest<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body: unknown) =>
    apiRequest<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(path: string) =>
    apiRequest<T>(path, { method: 'DELETE' }),
}
