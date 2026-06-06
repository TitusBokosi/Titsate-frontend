// src/features/auth/api/auth.ts
import api from '@/lib/axios'
import type { User } from '@/lib/storage'

export interface AuthResponse {
  status: string
  data: {
    accessToken: string
    user: User
  }
}

export const loginUser = async (credentials: any): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', credentials)
  return res.data
}

export const signupUser = async (userData: any): Promise<AuthResponse> => {
  const res = await api.post('/auth/signup', userData)
  return res.data
}

export const logoutUser = async () => {
  await api.post('/auth/logout')
}

export const getMe = async (): Promise<{ data: User }> => {
  const res = await api.get('/users/me')
  return res.data
}
