// src/features/progress/api/progress.ts
import api from '@/lib/axios'

export const markLessonComplete = async (lessonId: string, userId?: string) => {
  const res = await api.post('/progress', { lessonId, userId })
  return res.data
}

export const getMyProgress = async () => {
  const res = await api.get('/progress/user')
  return res.data
}

export const getUserProgress = async (userId: string) => {
  const res = await api.get(`/progress/user/${userId}`)
  return res.data
}

export const removeProgress = async (progressId: string) => {
  await api.delete(`/progress/${progressId}`)
}
