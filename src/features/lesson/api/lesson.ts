// src/features/lesson/api/lesson.ts
import api from '@/lib/axios'

export const getLessonById = async (courseId: string, topicId: string, lessonId: string) => {
  // The backend route is likely course/:courseId/topic/:topicId/lesson/:lessonId
  const res = await api.get(`/courses/${courseId}/topics/${topicId}/lessons/${lessonId}`)
  return res.data
}

export const getAllLessonsForTopic = async (courseId: string, topicId: string) => {
  const res = await api.get(`/courses/${courseId}/topics/${topicId}/lessons`)
  return res.data
}
