import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Users, FileCheck, PlayCircle, Trophy, ArrowUpRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useAdminAnalytics } from '../hooks/useAdmin'

export function DashboardOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats')
      return res.data.data
    }
  })
  const { data: analytics, isLoading: isLoadingAnalytics } = useAdminAnalytics()

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    )
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', trend: '+12%' },
    { title: 'Active Enrollments', value: stats.activeEnrollments, icon: PlayCircle, color: 'text-green-500', trend: '+5%' },
    { title: 'Pending Content', value: stats.pendingCourses, icon: FileCheck, color: 'text-yellow-500', trend: '-2' },
    { title: 'Creators', value: stats.totalCreators, icon: Trophy, color: 'text-purple-500', trend: '+1' },
  ]
  const maxEnrollmentCount = Math.max(
    1,
    ...(analytics?.enrollmentTrends.map((trend) => trend.count) || [0])
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Console Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none bg-card/50 shadow-md ring-1 ring-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={cn("size-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-green-500 flex items-center"><ArrowUpRight className="size-3" /> {stat.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="border-none bg-card/50 shadow-md ring-1 ring-white/5 min-h-[300px]">
            <CardHeader>
              <CardTitle className="text-base">Enrollment Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAnalytics ? (
                <div className="flex h-44 items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="flex h-44 items-end gap-1">
                  {analytics?.enrollmentTrends.map((trend) => (
                    <div key={trend.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-sm bg-primary/80"
                        title={`${trend.date}: ${trend.count} enrollments`}
                        style={{ height: `${Math.max(8, (trend.count / maxEnrollmentCount) * 100)}%` }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-4 text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
         </Card>
         <Card className="border-none bg-card/50 shadow-md ring-1 ring-white/5 min-h-[300px]">
            <CardHeader>
              <CardTitle className="text-base">Top Creators</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAnalytics ? (
                <div className="flex h-44 items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics?.topCreators.length ? analytics.topCreators.map((creator, index) => (
                    <div key={creator.id} className="flex items-center justify-between rounded-lg bg-background/60 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <span className="font-medium">{creator.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{creator.courseCount} courses</span>
                    </div>
                  )) : (
                    <div className="flex h-44 items-center justify-center text-sm text-muted-foreground">
                      No creator activity yet.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
