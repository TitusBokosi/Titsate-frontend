// src/features/course/api/course.ts
import api from '@/lib/axios'

export interface Lesson {
  id: string
  lessonName: string
  lessonType: 'VIDEO' | 'TEXT' | 'MINI_PROJECT'
  content?: string
  videoUrl?: string
  position: number
  topicid: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PENDING_DELETE'
  feedback?: string
}

export interface Topic {
  id: string
  topicName: string
  position: number
  courseid: string
  lessons: Lesson[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PENDING_DELETE'
  feedback?: string
}

export interface Course {
  id: string
  courseName: string
  description: string
  imageUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PENDING_DELETE'
  feedback?: string
  creatorId?: string
  category?: {
    categoryid: string
    categoryName: string
  }
  topics?: Topic[]
}

export interface CourseResponse {
  status: string
  results: number
  metadata: {
    total: number
    limit: number
    skip: number
    page: number
    totalPages: number
  }
  data: Course[]
}

export const getCourses = async (params?: { limit?: number; skip?: number }): Promise<CourseResponse> => {
  const res = await api.get('/courses', { params })
  return res.data
}

export const getCourseById = async (courseId: string): Promise<{ data: any }> => {
  const res = await api.get(`/courses/${courseId}`)
  return res.data
}

export const createCourse = async (courseData: Partial<Course>): Promise<{ data: Course }> => {
  const res = await api.post('/courses', courseData)
  return res.data
}

export const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<{ data: Course }> => {
  const res = await api.patch(`/courses/${courseId}`, courseData)
  return res.data
}

export const deleteCourse = async (courseId: string): Promise<void> => {
  await api.delete(`/courses/${courseId}`)
}
