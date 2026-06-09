import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Main',
    items: [
      { name: 'Overview', href: '/admin', icon: LayoutDashboard },
      { name: 'User Management', href: '/admin/users', icon: Users },
      { name: 'Profile', href: '/admin/profile', icon: Settings },
    ],
  },
  {
    label: 'Communication',
    items: [
      { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
      { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();

  const isActive = (href: string) =>
    href === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-white/5 hidden lg:flex flex-col p-4 gap-2 z-40 overflow-y-auto">
      <div className="mb-2 px-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          Control Center
        </p>
      </div>

      <nav className="flex-1 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-3 mb-1">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <item.icon
                      className={cn(
                        'size-4 transition-transform group-hover:scale-110',
                        active ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 pt-4">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Settings className="size-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
