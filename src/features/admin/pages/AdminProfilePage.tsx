import { useAuthContext } from '@/providers/AuthProvider';
import { UserDashboardSettings } from '@/features/users/components/UserDashboardSettings';

export function AdminProfilePage() {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your admin account details and update your password.
        </p>
      </div>
      <UserDashboardSettings user={user} />
    </div>
  );
}

export default AdminProfilePage;
