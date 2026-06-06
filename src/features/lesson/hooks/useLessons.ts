// src/features/lesson/hooks/useLessons.ts
import { useQuery } from '@tanstack/react-query'
import * as lessonApi from '../api/lesson'

export function useLesson(courseId: string, topicId: string, lessonId: string) {
  return useQuery({
    queryKey: ['lessons', courseId, topicId, lessonId],
    queryFn: () => lessonApi.getLessonById(courseId, topicId, lessonId),
    enabled: !!courseId && !!topicId && !!lessonId,
  })
}

export function useTopicLessons(courseId: string, topicId: string) {
  return useQuery({
    queryKey: ['lessons', courseId, topicId],
    queryFn: () => lessonApi.getAllLessonsForTopic(courseId, topicId),
    enabled: !!courseId && !!topicId,
  })
}
