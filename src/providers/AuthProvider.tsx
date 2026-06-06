// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  getStoredUser, 
  setAuthSession, 
  clearAuthSession, 
  type User 
} from '@/lib/storage'
import { 
  logoutUser, 
  getMe 
} from '@/features/auth/api/auth'
import { useQueryClient } from '@tanstack/react-query'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAuthReady: boolean
  login: (userData: User, accessToken: string) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const queryClient = useQueryClient()

  /* ---------------- Hydrate auth state ---------------- */
  useEffect(() => {
    const hydrateAuthState = async () => {
      try {
        const storedUser = getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        }
      } catch (err) {
        console.error("Auth hydration failed:", err)
      } finally {
        setIsAuthReady(true)
      }
    }

    hydrateAuthState()
  }, [])

  const login = (userData: User, accessToken: string) => {
    setAuthSession({ accessToken, user: userData })
    setUser(userData)
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch (err) {
      console.error("Logout request failed:", err)
    } finally {
      clearAuthSession()
      setUser(null)
      queryClient.clear()
    }
  }

  const refreshUser = async () => {
    try {
      const res = await getMe()
      const userData = res.data
      setAuthSession({ user: userData })
      setUser(userData)
    } catch (err) {
      console.error("Failed to refresh user profile:", err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthReady,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
