import api from '@/lib/axios'
import type { Course } from '@/features/course/api/course'
import type { User } from '@/lib/storage'

export interface AdminUser extends User {
  isSuspended: boolean
  createdAt: string
}

export interface AdminStats {
  totalUsers: number
  totalCourses: number
  pendingApprovals: number
}

export interface AdminAnalytics {
  enrollmentTrends: Array<{ date: string; count: number }>
  topCreators: Array<{ id: string; name: string; courseCount: number }>
}

/* ---------------- User Management ---------------- */

export const getAllUsers = async (): Promise<{ data: AdminUser[] }> => {
  const res = await api.get('/users')
  return res.data
}

export const changeUserRole = async (userId: string, role: string) => {
  const res = await api.patch(`/users/${userId}/role`, { role })
  return res.data
}

export const suspendUser = async (userId: string) => {
  const res = await api.post(`/users/${userId}/suspend`)
  return res.data
}

export const unsuspendUser = async (userId: string) => {
  const res = await api.post(`/users/${userId}/unsuspend`)
  return res.data
}

export const deleteUserByAdmin = async (userId: string) => {
  const res = await api.delete(`/users/${userId}`)
  return res.data
}

export const getAdminAnalytics = async (): Promise<AdminAnalytics> => {
  const res = await api.get('/admin/analytics')
  return res.data.data
}

/* ---------------- Content Approval ---------------- */

export const getPendingContent = async (): Promise<{ 
  courses: Course[], 
  topics: any[], 
  lessons: any[] 
}> => {
  // We'll need to fetch courses with status PENDING
  // For now let's assume we fetch all courses and filter, or have a specific endpoint
  const res = await api.get('/courses', { params: { status: 'PENDING' } })
  return {
    courses: res.data.data,
    topics: [], // We can expand this later
    lessons: []
  }
}

export const approveCourse = async (courseId: string) => {
  const res = await api.post(`/courses/${courseId}/approve`)
  return res.data
}

export const rejectCourse = async (courseId: string, feedback: string) => {
  const res = await api.post(`/courses/${courseId}/reject`, { feedback })
  return res.data
}

export const approveTopic = async (courseId: string, topicId: string) => {
  const res = await api.post(`/courses/${courseId}/topics/${topicId}/approve`)
  return res.data
}

export const rejectTopic = async (courseId: string, topicId: string, feedback: string) => {
  const res = await api.post(`/courses/${courseId}/topics/${topicId}/reject`, { feedback })
  return res.data
}

export const approveLesson = async (courseId: string, topicId: string, lessonId: string) => {
  const res = await api.post(`/courses/${courseId}/topics/${topicId}/lessons/${lessonId}/approve`)
  return res.data
}

export const rejectLesson = async (courseId: string, topicId: string, lessonId: string, feedback: string) => {
  const res = await api.post(`/courses/${courseId}/topics/${topicId}/lessons/${lessonId}/reject`, { feedback })
  return res.data
}
