import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Users, FileCheck, PlayCircle, Trophy, BarChart3, ArrowUpRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function DashboardOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats')
      return res.data.data
    }
  })

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

      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="border-none bg-card/50 shadow-md ring-1 ring-white/5 min-h-[300px] flex items-center justify-center">
            <div className="text-center italic text-muted-foreground opacity-50 flex flex-col items-center">
               <BarChart3 className="size-12 mb-2" />
               Enrollment Trends (Chart coming soon)
            </div>
         </Card>
         <Card className="border-none bg-card/50 shadow-md ring-1 ring-white/5 min-h-[300px] flex items-center justify-center">
            <div className="text-center italic text-muted-foreground opacity-50 flex flex-col items-center">
               <Trophy className="size-12 mb-2" />
               Top Performing Creators (Leaderboard coming soon)
            </div>
         </Card>
      </div>
    </div>
  )
}
