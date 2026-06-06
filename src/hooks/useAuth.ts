// src/hooks/useAuth.ts
import { useAuthContext } from '@/providers/AuthProvider'

/**
 * Global hook to access the authentication context.
 * Provides user profile, authentication status, and auth actions (login, logout, refresh).
 */
export const useAuth = () => {
  return useAuthContext()
}
