import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserById } from '@/features/users/hooks/useUsers'
import { Loader2 } from 'lucide-react'
import { DashboardHeader } from './components/header'
import { UserEnrollments } from './components/UserEnrollments'
import { UserProgress } from './components/UserProgress'
import { UserDashboardSettings } from './components/UserDashboardSettings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function UserDashboard() {
  const { userId } = useParams()
  const [showSettings, setShowSettings] = useState(false)

  const {
     data:user,
    isLoading,
    isError,
    error,
  } = useUserById(userId!)


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
            <div className="space-y-8">
              <DashboardHeader 
                user={user!} 
                isSettingsActive={showSettings} 
                onToggleSettings={() => setShowSettings(!showSettings)} 
              />
              
              {showSettings ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <UserDashboardSettings user={user!} />
                </div>
              ) : (
                <Tabs defaultValue="learning" className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
                  <TabsList className="mb-6 w-full md:w-auto flex overflow-x-auto scrollbar-hide">
                    <TabsTrigger value="learning" className="flex-1 md:flex-none">My Learning</TabsTrigger>
                    <TabsTrigger value="progress" className="flex-1 md:flex-none">Progress</TabsTrigger>
                  </TabsList>
                  <TabsContent value="learning" className="outline-none">
                    <UserEnrollments userId={userId!} />
                  </TabsContent>
                  <TabsContent value="progress" className="outline-none">
                    <UserProgress userId={userId!} />
                  </TabsContent>
                </Tabs>
              )}
            </div>
        )}
    </div>
  );
}
