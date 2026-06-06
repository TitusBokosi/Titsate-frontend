// src/routes/GuestRoute.tsx
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '@/providers/AuthProvider'

interface GuestRouteProps {
  redirectTo?: string
}

/**
 * Route wrapper for pages that should only be accessible to guests (non-authenticated users).
 * Redirects to the specified path (default: '/') if the user is already authenticated.
 */
export const GuestRoute: React.FC<GuestRouteProps> = ({ 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isAuthReady } = useAuthContext()

  if (!isAuthReady) {
    return <div>Loading...</div> // Or a proper loading spinner
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
