// src/features/topic/hooks/useTopics.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as topicApi from '../api/topic'

export const useTopics = (courseId: string) => {
  return useQuery({
    queryKey: ['topics', courseId],
    queryFn: () => topicApi.getTopicsByCourse(courseId),
    enabled: !!courseId,
  })
}

export const useCreateTopic = (courseId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (topicData: any) => topicApi.createTopic(courseId, topicData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics', courseId] })
    },
  })
}

export const useTopic = (courseId: string, topicId: string) => {
  return useQuery({
    queryKey: ['topics', courseId, topicId],
    queryFn: () => topicApi.getTopicById(courseId, topicId),
    enabled: !!courseId && !!topicId,
  })
}
