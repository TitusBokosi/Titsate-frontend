// src/features/progress/hooks/useProgress.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as progressApi from '../api/progress'

export const useMyProgress = (options = {}) => {
  return useQuery({
    queryKey: ['progress', 'me'],
    queryFn: () => progressApi.getMyProgress(),
    ...options,
  })
}

export const useUserProgress = (userId: string) => {
  return useQuery({
    queryKey: ['progress', 'user', userId],
    queryFn: () => progressApi.getUserProgress(userId),
    enabled: !!userId,
  })
}

export const useMarkComplete = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ lessonId, userId }: { lessonId: string; userId?: string }) => 
      progressApi.markLessonComplete(lessonId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}

export const useRemoveProgress = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: progressApi.removeProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] })
    },
  })
}
