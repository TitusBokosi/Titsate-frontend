// src/features/users/api/users.ts
import api from '@/lib/axios'
import { type User } from '@/lib/storage'

export const getAllUsers = async (): Promise<User[]> => {
  const res = await api.get('/users')
  return res.data
}

export const getUserById = async (userId: string): Promise<User> => {
  const res = await api.get(`/users/${userId}`)
  return res.data.data
}

export const updateUserProfile = async (
  userData: Partial<User>
): Promise<User> => {
  const res = await api.patch('/users/me', userData)
  return res.data
}

export const deleteMyAccount = async (): Promise<void> => {
  await api.delete('/users/me')
}

export const updatePassword = async (data: any): Promise<void> => {
   await api.patch('/users/change-password', data)
}

export const updateUserRole = async (
  userId: string,
  role: string
): Promise<User> => {
  const res = await api.patch(`/users/${userId}/role`, { role })
  return res.data
}

export const deleteUserById = async (
  userId: string
): Promise<void> => {
  await api.delete(`/users/${userId}`)
}