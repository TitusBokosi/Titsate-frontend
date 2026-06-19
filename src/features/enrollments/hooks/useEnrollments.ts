// src/features/enrollments/hooks/useEnrollments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as enrollmentApi from '../api/enrollment'
import { toast } from 'sonner'

export const useMyEnrollments = (options = {}) => {
  return useQuery({
    queryKey: ['enrollments', 'me'],
    queryFn: () => enrollmentApi.getMyEnrollments(),
    ...options,
  })
}

export const useUserEnrollments = (userId: string) => {
  return useQuery({
    queryKey: ['enrollments', 'user', userId],
    queryFn: () => enrollmentApi.getUserEnrollments(userId),
    enabled: !!userId,
  })
}

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId?: string }) => 
      enrollmentApi.enrollInCourse(courseId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })
}

export const useUpdateEnrollmentStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ enrollmentId, status }: { enrollmentId: string; status: string }) => 
      enrollmentApi.updateEnrollmentStatus(enrollmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })
}

export const useDropEnrollment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: enrollmentApi.dropEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Course dropped')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to drop course')
    },
  })
}
export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: enrollmentApi.deleteEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Course deregistered successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deregister from course')
    },
  })
}
