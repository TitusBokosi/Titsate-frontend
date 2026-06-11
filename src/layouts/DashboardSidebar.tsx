import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  Users,
  LayoutDashboard,
  Megaphone,
  Settings,
  BookOpen,
  GraduationCap,
  Layers,
  Star,
  CheckCircle,
  FolderKanban,
  LogOut,
  User as UserIcon,
  Home,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';

type NavItem = {
  name: string;
  href: string;
  icon: any;
  end?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export function DashboardSidebar({ mobileOpen, setMobileOpen }: { mobileOpen?: boolean; setMobileOpen?: (open: boolean) => void }) {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const role = user?.role;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileOpen?.(false);
  };

  const getNavGroups = (): NavGroup[] => {
    // ... same logic as before ...
    const groups: NavGroup[] = [];

    if (role === 'ADMIN') {
      groups.push({
        label: 'Admin Control',
        items: [
          { name: 'Overview', href: '/admin', icon: LayoutDashboard, end: true },
          { name: 'User Management', href: '/admin/users', icon: Users },
          { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
        ],
      });
    }

    if (role === 'CREATOR' || role === 'SUPER_CREATOR') {
      const creatorItems: NavItem[] = [
        { name: 'Content Management', href: '/creator', icon: FolderKanban, end: true },
      ];

      if (role === 'SUPER_CREATOR') {
        creatorItems.push(
          { name: 'Content Approvals', href: '/creator/approvals', icon: CheckCircle },
          { name: 'Category Management', href: '/creator/categories', icon: Layers },
          { name: 'Featured Content', href: '/creator/featured', icon: Star }
        );
      }

      groups.push({
        label: role === 'SUPER_CREATOR' ? 'Super Creator' : 'Creator',
        items: creatorItems,
      });
    }

    if (role === 'STUDENT' || role === 'CREATOR' || role === 'SUPER_CREATOR' || role === 'ADMIN') {
        groups.push({
            label: 'Learning',
            items: [
                { name: 'My Learning', href: `/dashboard/${user?.id}/learning`, icon: BookOpen },
                { name: 'Progress', href: `/dashboard/${user?.id}/progress`, icon: GraduationCap },
            ]
        });
    }

    return groups;
  };

  const navGroups = getNavGroups();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-white/5 flex flex-col z-50 overflow-y-auto transition-transform duration-300 transform lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5 space-y-4">
          <Link 
              to="/" 
              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors group px-1"
          >
            <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
            Back to Website
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role?.toLowerCase().replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-3 mb-2">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.end}
                    onClick={() => setMobileOpen?.(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            'size-4 transition-transform group-hover:scale-110',
                            isActive ? 'text-primary' : 'text-muted-foreground',
                          )}
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <NavLink
            to="/profile"
            onClick={() => setMobileOpen?.(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <Settings className="size-4" />
            Profile Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
