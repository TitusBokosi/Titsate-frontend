import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminUsers, useAdminContent } from "../hooks/useAdmin"
import { UserManagementTable } from "../components/UserManagementTable"
import { ApprovalQueue } from "../components/ApprovalQueue"
import { Loader2, Users, FileCheck } from "lucide-react"

export function AdminDashboard() {
  const { data: usersData, isLoading: usersLoading } = useAdminUsers()
  const { data: contentData, isLoading: contentLoading } = useAdminContent()

  const stats = [
    { label: 'Total Users', value: usersData?.data?.length || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Pending Approvals', value: contentData?.courses?.length || 0, icon: FileCheck, color: 'text-yellow-500' },
  ]

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Admin Control Center</h1>
            <p className="text-muted-foreground">Manage users, approve content, and monitor platform health.</p>
          </div>
          <div className="flex gap-4">
             {stats.map((stat, i) => (
                <div key={i} className="bg-card border border-white/5 p-4 rounded-xl flex items-center gap-4 min-w-[180px] shadow-sm">
                   <div className={`p-2 rounded-lg bg-background ${stat.color}`}>
                      <stat.icon className="size-5" />
                   </div>
                   <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="users" className="gap-2">
              <Users className="size-4" /> User Management
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileCheck className="size-4" /> Content Approvals
              {contentData?.courses?.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-yellow-500 text-white rounded-full">
                  {contentData.courses.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            {usersLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="size-10 animate-spin text-primary" />
              </div>
            ) : (
              <UserManagementTable users={usersData?.data || []} />
            )}
          </TabsContent>

          <TabsContent value="content" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            {contentLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="size-10 animate-spin text-primary" />
              </div>
            ) : (
              <ApprovalQueue courses={contentData?.courses || []} />
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  )
}
