import { api } from './client'

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
}

export interface AuthResponse {
  tokens: {
    access_token: string
    refresh_token: string
    token_type: string
  }
  user: {
    id: string
    email: string
    full_name: string
    avatar_url: string | null
    plan: string
    is_active: boolean
    is_verified: boolean
    created_at: string
    updated_at: string
  }
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/v1/auth/register', payload)
}
