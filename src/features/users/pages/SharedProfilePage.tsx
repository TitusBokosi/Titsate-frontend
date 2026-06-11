import { useAuthContext } from '@/providers/AuthProvider';
import { UserDashboardSettings } from '../components/UserDashboardSettings';
import { DashboardHeader } from '../components/header';

export function SharedProfilePage() {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-center text-muted-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardHeader user={user} isSettingsActive={true} />
      <UserDashboardSettings user={user} />
    </div>
  );
}

export default SharedProfilePage;
