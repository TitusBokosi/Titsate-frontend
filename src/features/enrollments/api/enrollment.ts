// src/features/enrollments/api/enrollment.ts
import api from '@/lib/axios'

export const enrollInCourse = async (courseId: string, userId?: string) => {
  const res = await api.post('/enrollments', { courseId, userId })
  return res.data
}

export const getMyEnrollments = async () => {
  const res = await api.get('/enrollments/user')
  return res.data
}

export const getUserEnrollments = async (userId: string) => {
  const res = await api.get(`/enrollments/user/${userId}`)
  return res.data
}

export const getCourseEnrollments = async (courseId: string) => {
  const res = await api.get(`/enrollments/course/${courseId}`)
  return res.data
}

export const updateEnrollmentStatus = async (enrollmentId: string, status: string) => {
  const res = await api.patch(`/enrollments/${enrollmentId}`, { status })
  return res.data
}

export const dropEnrollment = async (enrollmentId: string) => {
  const res = await api.patch(`/enrollments/${enrollmentId}`, { status: 'DROPPED' })
  return res.data
}

export const deleteEnrollment = async (enrollmentId: string) => {
  const res = await api.delete(`/enrollments/${enrollmentId}`)
  return res.data
}
