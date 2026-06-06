// src/providers/AppProviders.tsx
import React from 'react'
import { AuthProvider } from './AuthProvider'
import { QueryClientProvider } from './QueryClientProvider'

import { Toaster } from 'sonner'

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  )
}
