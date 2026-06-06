
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import * as usersApi from '../api/users'

type UpdateUserRolePayload = {
  userId: string
  role: string
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAllUsers,
  })
}

export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersApi.updateUserProfile,

    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })

      if (updatedUser?.id) {
        queryClient.setQueryData(
          ['users', updatedUser.id],
          updatedUser
        )
      }
    },
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: UpdateUserRolePayload) =>
      usersApi.updateUserRole(userId, role),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })

      queryClient.invalidateQueries({
        queryKey: ['users', variables.userId],
      })
    },
  })
}

export const useDeleteMyAccount = () => {
  return useMutation({
    mutationFn: usersApi.deleteMyAccount,
  })
}

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: usersApi.updatePassword,
  })
}

export const useDeleteUserById = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersApi.deleteUserById,

    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })

      queryClient.removeQueries({
        queryKey: ['users', userId],
      })
    },
  })
}