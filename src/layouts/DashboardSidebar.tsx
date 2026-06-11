import { NavLink } from 'react-router-dom';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/providers/AuthProvider';

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

export function DashboardSidebar() {
  const { user } = useAuthContext();
  const role = user?.role;

  const getNavGroups = (): NavGroup[] => {
    const groups: NavGroup[] = [];

    if (role === 'ADMIN') {
      groups.push({
        label: 'Admin Control',
        items: [
          { name: 'Overview', href: '/admin', icon: LayoutDashboard, end: true },
          { name: 'User Management', href: '/admin/users', icon: Users },
          { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
          { name: 'Profile', href: '/admin/profile', icon: Settings },
        ],
      });
    }

    if (role === 'CREATOR' || role === 'SUPER_CREATOR') {
      const creatorItems: NavItem[] = [
        { name: 'Content Management', href: '/creator', icon: FolderKanban, end: true },
        { name: 'Profile Management', href: '/creator/profile', icon: Settings },
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
        // Everyone has a student dashboard essentially
        groups.push({
            label: 'Student',
            items: [
                { name: 'My Learning', href: `/dashboard/${user?.id}`, icon: BookOpen },
                { name: 'Browse Courses', href: '/courses', icon: GraduationCap },
            ]
        });
    }

    return groups;
  };

  const navGroups = getNavGroups();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-white/5 hidden lg:flex flex-col p-4 gap-2 z-40 overflow-y-auto">
      <div className="mb-2 px-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          Dashboard
        </p>
      </div>

      <nav className="flex-1 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-3 mb-1">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.end}
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

      <div className="border-t border-white/5 pt-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LayoutDashboard className="size-4" />
          Back to Home
        </NavLink>
      </div>
    </aside>
  );
}
