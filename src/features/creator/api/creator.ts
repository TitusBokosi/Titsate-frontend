import api from '@/lib/axios'
import type { Course } from '@/features/course/api/course'

export const getMyCourses = async () => {
  const response = await api.get('/courses?onlyMine=true')
  return response.data.data as Course[]
}

export const createCourse = async (data: any) => {
  const response = await api.post('/courses', data)
  return response.data.data as Course
}

export const updateCourse = async (courseId: string, data: any) => {
  const response = await api.patch(`/courses/${courseId}`, data)
  return response.data.data as Course
}

export const deleteCourse = async (courseId: string) => {
  const response = await api.delete(`/courses/${courseId}`)
  return response.data
}

export const createTopic = async (courseId: string, data: any) => {
  const response = await api.post(`/courses/${courseId}/topics`, { ...data, courseId })
  return response.data.data
}

export const updateTopic = async (courseId: string, topicId: string, data: any) => {
  const response = await api.patch(`/courses/${courseId}/topics/${topicId}`, data)
  return response.data.data
}

export const deleteTopic = async (courseId: string, topicId: string) => {
  const response = await api.delete(`/courses/${courseId}/topics/${topicId}`)
  return response.data
}

export const createLesson = async (courseId: string, topicId: string, data: any) => {
  const response = await api.post(`/courses/${courseId}/topics/${topicId}/lessons`, { ...data, topicId })
  return response.data.data
}

export const updateLesson = async (courseId: string, topicId: string, lessonId: string, data: any) => {
  const response = await api.patch(`/courses/${courseId}/topics/${topicId}/lessons/${lessonId}`, data)
  return response.data.data
}

export const deleteLesson = async (courseId: string, topicId: string, lessonId: string) => {
  const response = await api.delete(`/courses/${courseId}/topics/${topicId}/lessons/${lessonId}`)
  return response.data
}
