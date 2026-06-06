// src/features/topic/api/topic.ts
import api from '@/lib/axios'

export const getTopicsByCourse = async (courseId: string) => {
  const res = await api.get(`/courses/${courseId}/topics`)
  return res.data
}

export const getTopicById = async (courseId: string, topicId: string) => {
  const res = await api.get(`/courses/${courseId}/topics/${topicId}`)
  return res.data
}

export const createTopic = async (courseId: string, topicData: any) => {
  const res = await api.post(`/courses/${courseId}/topics`, topicData)
  return res.data
}

export const updateTopic = async (courseId: string, topicId: string, topicData: any) => {
  const res = await api.patch(`/courses/${courseId}/topics/${topicId}`, topicData)
  return res.data
}

export const deleteTopic = async (courseId: string, topicId: string) => {
  await api.delete(`/courses/${courseId}/topics/${topicId}`)
}
