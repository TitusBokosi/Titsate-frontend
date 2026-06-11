import { useLocation, useParams } from 'react-router-dom'
import { useUserById } from '@/features/users/hooks/useUsers'
import { Loader2 } from 'lucide-react'
import { DashboardHeader } from './components/header'
import { UserEnrollments } from './components/UserEnrollments'
import { UserProgress } from './components/UserProgress'
import { UserDashboardSettings } from './components/UserDashboardSettings'

export function UserDashboard() {
  const { userId } = useParams()
  const location = useLocation()
  
  const {
     data:user,
    isLoading,
    isError,
    error,
  } = useUserById(userId!)

  // Determine active view from URL
  const isProgress = location.pathname.endsWith('/progress')
  const isLearning = !isProgress

  return (
    <div className="pb-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="size-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
            </div>
          ) :
          isError ? (
            <div className="text-center py-24 bg-muted/20 rounded-2xl border border-destructive/20 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-2 text-destructive">Oops! Something went wrong</h3>
              <p className="text-muted-foreground">We couldn't load your data. Please try again later.</p>
              <p className="text-sm mt-4 p-4 bg-muted text-left overflow-auto rounded-md font-mono">{error?.message}</p>
            </div>
          ) :  (
            <div className="space-y-8 animate-in fade-in duration-500">
            
              
              {isLearning && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <UserEnrollments userId={userId!} />
                </div>
              )}

              {isProgress && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <UserProgress userId={userId!} />
                </div>
              )}
            </div>
        )}
    </div>
  );
}

export * from './pages/SharedProfilePage';
