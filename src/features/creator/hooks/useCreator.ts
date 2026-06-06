import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as creatorApi from '../api/creator'
import { toast } from 'sonner'

export const useCreatorCourses = () => {
  return useQuery({
    queryKey: ['creator', 'courses'],
    queryFn: creatorApi.getMyCourses,
  })
}

export const useCreatorActions = () => {
  const queryClient = useQueryClient()

  const createCourseMutation = useMutation({
    mutationFn: creatorApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator', 'courses'] })
      toast.success('Course created successfully')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create course')
  })

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => creatorApi.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator', 'courses'] })
      toast.success('Course updated and sent for review')
    }
  })

  const deleteCourseMutation = useMutation({
    mutationFn: creatorApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator', 'courses'] })
      toast.success('Course deletion requested')
    }
  })

  return {
    createCourse: createCourseMutation.mutateAsync,
    updateCourse: updateCourseMutation.mutateAsync,
    deleteCourse: deleteCourseMutation.mutateAsync,
    isProcessing: createCourseMutation.isPending || updateCourseMutation.isPending || deleteCourseMutation.isPending
  }
}

export const useContentManagementActions = (courseId: string) => {
  const queryClient = useQueryClient()

  const createTopicMutation = useMutation({
    mutationFn: (data: any) => creatorApi.createTopic(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] })
      toast.success('Topic added')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add topic')
  })

  const updateTopicMutation = useMutation({
    mutationFn: ({ topicId, data }: { topicId: string; data: any }) => creatorApi.updateTopic(courseId, topicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] })
      toast.success('Topic updated')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update topic')
  })

  const deleteTopicMutation = useMutation({
    mutationFn: (topicId: string) => creatorApi.deleteTopic(courseId, topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] })
      toast.success('Topic deletion requested')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete topic')
  })

  // Lesson mutations
  const createLessonMutation = useMutation({
    mutationFn: ({ topicId, data }: { topicId: string; data: any }) => creatorApi.createLesson(courseId, topicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] })
      toast.success('Lesson added')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add lesson')
  })

  const updateLessonMutation = useMutation({
    mutationFn: ({ topicId, lessonId, data }: { topicId: string; lessonId: string; data: any }) => 
      creatorApi.updateLesson(courseId, topicId, lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] })
      toast.success('Lesson updated')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update lesson')
  })

  const deleteLessonMutation = useMutation({
    mutationFn: ({ topicId, lessonId }: { topicId: string; lessonId: string }) => 
      creatorApi.deleteLesson(courseId, topicId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', courseId] })
      toast.success('Lesson deletion requested')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete lesson')
  })

  return {
    createTopic: createTopicMutation.mutateAsync,
    updateTopic: updateTopicMutation.mutateAsync,
    deleteTopic: deleteTopicMutation.mutateAsync,
    createLesson: createLessonMutation.mutateAsync,
    updateLesson: updateLessonMutation.mutateAsync,
    deleteLesson: deleteLessonMutation.mutateAsync,
    isLoading: 
      createTopicMutation.isPending || 
      updateTopicMutation.isPending || 
      deleteTopicMutation.isPending || 
      createLessonMutation.isPending || 
      updateLessonMutation.isPending || 
      deleteLessonMutation.isPending
  }
}
