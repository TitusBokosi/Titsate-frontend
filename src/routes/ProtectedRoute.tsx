// src/routes/ProtectedRoute.tsx
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/providers/AuthProvider'

interface ProtectedRouteProps {
  allowedRoles?: ('STUDENT' | 'CREATOR' | 'SUPER_CREATOR' | 'ADMIN')[]
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles, 
  redirectTo = '/login' 
}) => {
  const { user, isAuthenticated, isAuthReady } = useAuthContext()
  const location = useLocation()

  if (!isAuthReady) {
    return <div>Loading...</div> // Replace with a skeleton or loader if needed
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
