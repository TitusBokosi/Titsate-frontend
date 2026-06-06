import { useAdminUsers } from "../hooks/useAdmin"
import { UserManagementTable } from "../components/UserManagementTable"
import { Loader2 } from "lucide-react"

export function UserManagementPage() {
  const { data: usersData, isLoading } = useAdminUsers()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage roles, suspend accounts, and view user metrics.</p>
      </div>

      {isLoading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : (
        <UserManagementTable users={usersData?.data || []} />
      )}
    </div>
  )
}
