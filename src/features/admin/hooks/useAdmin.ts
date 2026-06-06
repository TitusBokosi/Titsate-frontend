import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as adminApi from '../api/admin'
import { toast } from 'sonner'

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminApi.getAllUsers,
  })
}

export const useAdminContent = () => {
  return useQuery({
    queryKey: ['admin', 'content', 'pending'],
    queryFn: adminApi.getPendingContent,
  })
}

export const useUserActions = () => {
  const queryClient = useQueryClient()

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => adminApi.changeUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User role updated')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update role')
  })

  const suspendMutation = useMutation({
    mutationFn: adminApi.suspendUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User suspended')
    }
  })

  const unsuspendMutation = useMutation({
    mutationFn: adminApi.unsuspendUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User unsuspended')
    }
  })

  return {
    updateRole: roleMutation.mutate,
    suspend: suspendMutation.mutate,
    unsuspend: unsuspendMutation.mutate,
    isLoading: roleMutation.isPending || suspendMutation.isPending || unsuspendMutation.isPending
  }
}

export const useContentActions = () => {
  const queryClient = useQueryClient()

  const approveCourseMutation = useMutation({
    mutationFn: adminApi.approveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'pending'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Course approved')
    }
  })

  const rejectCourseMutation = useMutation({
    mutationFn: ({ courseId, feedback }: { courseId: string; feedback: string }) => adminApi.rejectCourse(courseId, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content', 'pending'] })
      toast.success('Course rejected')
    }
  })

  const approveTopicMutation = useMutation({
    mutationFn: ({ courseId, topicId }: { courseId: string; topicId: string }) => adminApi.approveTopic(courseId, topicId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId] })
      toast.success('Topic approved')
    }
  })

  const rejectTopicMutation = useMutation({
    mutationFn: ({ courseId, topicId, feedback }: { courseId: string; topicId: string; feedback: string }) => adminApi.rejectTopic(courseId, topicId, feedback),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId] })
      toast.success('Topic rejected')
    }
  })

  const approveLessonMutation = useMutation({
    mutationFn: ({ courseId, topicId, lessonId }: { courseId: string; topicId: string; lessonId: string }) => 
      adminApi.approveLesson(courseId, topicId, lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId] })
      toast.success('Lesson approved')
    }
  })

  const rejectLessonMutation = useMutation({
    mutationFn: ({ courseId, topicId, lessonId, feedback }: { courseId: string; topicId: string; lessonId: string; feedback: string }) => 
      adminApi.rejectLesson(courseId, topicId, lessonId, feedback),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId] })
      toast.success('Lesson rejected')
    }
  })

  return {
    approveCourse: approveCourseMutation.mutate,
    rejectCourse: rejectCourseMutation.mutate,
    approveTopic: approveTopicMutation.mutate,
    rejectTopic: rejectTopicMutation.mutate,
    approveLesson: approveLessonMutation.mutate,
    rejectLesson: rejectLessonMutation.mutate,
    isProcessing: 
      approveCourseMutation.isPending || 
      rejectCourseMutation.isPending ||
      approveTopicMutation.isPending ||
      rejectTopicMutation.isPending ||
      approveLessonMutation.isPending ||
      rejectLessonMutation.isPending
  }
}
