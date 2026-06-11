import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, User as UserIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type DashboardHeaderProps = {
  user: {
    firstname: string
    lastname: string
    email?: string
    role?: string
  }
  isSettingsActive?: boolean
}

export function DashboardHeader({
  user,
  isSettingsActive,
}: DashboardHeaderProps) {
  return (
    <div className="w-full">
      <Card 
        className={cn(
          "border-none shadow-sm overflow-hidden transition-all duration-300 group hover:ring-2 hover:ring-primary/20",
          isSettingsActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-primary/5"
        )}
      >
        <CardHeader className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className={cn(
                "p-3 rounded-xl transition-colors",
                isSettingsActive ? "bg-white/20" : "bg-primary/10"
              )}>
                 {isSettingsActive ? <X className="size-6 text-white" /> : <UserIcon className="size-6 text-primary group-hover:scale-110 transition-transform" />}
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold tracking-tight mb-1">
                  {isSettingsActive ? "Account Settings" : `Welcome back, ${user.firstname} ${user.lastname}`}
                </CardTitle>
                {user.email && (
                  <p className={cn(
                    "text-sm",
                    isSettingsActive ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {isSettingsActive ? "Manage your profile and security" : user.email}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-3">
               {user.role && (
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                  isSettingsActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                )}>
                  {user.role}
                </div>
              )}
              <Settings className={cn(
                "size-5 transition-all duration-500",
                isSettingsActive ? "rotate-90 text-white" : "text-muted-foreground group-hover:rotate-45"
              )} />
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}