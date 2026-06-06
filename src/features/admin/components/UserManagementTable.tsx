import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Shield, UserX, UserCheck, ShieldCheck } from "lucide-react"
import type { AdminUser } from "../api/admin"
import { useUserActions } from "../hooks/useAdmin"

interface UserManagementTableProps {
  users: AdminUser[]
}

export function UserManagementTable({ users }: UserManagementTableProps) {
  const { updateRole, suspend, unsuspend, isLoading } = useUserActions()

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Badge variant="destructive" className="flex items-center gap-1"><ShieldCheck className="size-3" /> ADMIN</Badge>
      case 'SUPER_CREATOR': return <Badge className="bg-purple-600 flex items-center gap-1"><Shield className="size-3" /> SUPER CREATOR</Badge>
      case 'CREATOR': return <Badge variant="secondary">CREATOR</Badge>
      default: return <Badge variant="outline">STUDENT</Badge>
    }
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstname} {user.lastname}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>
                {user.isSuspended ? (
                  <Badge variant="destructive">SUSPENDED</Badge>
                ) : (
                  <Badge variant="default" className="bg-green-600">ACTIVE</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Change Role</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => updateRole({ userId: user.id, role: 'STUDENT' })}>Set as Student</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateRole({ userId: user.id, role: 'CREATOR' })}>Set as Creator</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateRole({ userId: user.id, role: 'SUPER_CREATOR' })}>Set as Super Creator</DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {user.isSuspended ? (
                      <DropdownMenuItem 
                        onClick={() => unsuspend(user.id)}
                        className="text-green-600 focus:text-green-600"
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Unsuspend User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        onClick={() => suspend(user.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Suspend User
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
