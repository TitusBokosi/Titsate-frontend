import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { useAuthContext } from '@/providers/AuthProvider';

export function CreatorDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isSuperCreator = user?.role === 'SUPER_CREATOR';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-white/5'
    }`;

  return (
    <div className="container mx-auto py-10 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h2 className="text-2xl font-bold">
          {isSuperCreator ? 'Super Creator Dashboard' : 'Creator Dashboard'}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="flex items-center gap-2 border-none"
        >
          {isSidebarOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </Button>
      </div>

      {isSidebarOpen ? (
        <div className="mb-4 rounded-3xl border border-white/10 bg-card/80 p-6 shadow-sm lg:hidden">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserIcon className="size-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  {isSuperCreator ? 'Super Creator' : 'Creator'}
                </p>
                <h3 className="text-2xl font-bold">
                  {user?.firstname
                    ? `Hi, ${user.firstname}`
                    : isSuperCreator
                      ? 'Super Creator'
                      : 'Creator'}
                </h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Switch between profile and content management.
            </p>
          </div>

          <div className="space-y-2">
            <NavLink
              to="/creator"
              end
              className={navLinkClass}
              onClick={() => setIsSidebarOpen(false)}
            >
              Content management
            </NavLink>
            <NavLink
              to="/creator/profile"
              className={navLinkClass}
              onClick={() => setIsSidebarOpen(false)}
            >
              Profile management
            </NavLink>
            {isSuperCreator ? (
              <>
                <div className="pt-4 border-t border-white/10" />
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Super Creator tools
                </p>
                <NavLink
                  to="/creator/approvals"
                  className={navLinkClass}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Content approvals
                </NavLink>
                <NavLink
                  to="/creator/categories"
                  className={navLinkClass}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Category management
                </NavLink>
                <NavLink
                  to="/creator/featured"
                  className={navLinkClass}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Featured content
                </NavLink>
              </>
            ) : null}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-3xl border border-white/10 bg-card/80 p-6 shadow-sm sticky top-24 self-start min-h-[calc(100vh-6rem)] lg:flex lg:flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserIcon className="size-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  {isSuperCreator ? 'Super Creator' : 'Creator'}
                </p>
                <h3 className="text-2xl font-bold">
                  {user?.firstname
                    ? `Hi, ${user.firstname}`
                    : isSuperCreator
                      ? 'Super Creator'
                      : 'Creator'}
                </h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Switch between profile and content management.
            </p>
          </div>

          <div className="space-y-2">
            <NavLink to="/creator" end className={navLinkClass}>
              Content management
            </NavLink>
            <NavLink to="/creator/profile" className={navLinkClass}>
              Profile management
            </NavLink>
            {isSuperCreator ? (
              <>
                <div className="pt-4 border-t border-white/10" />
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Super Creator tools
                </p>
                <NavLink to="/creator/approvals" className={navLinkClass}>
                  Content approvals
                </NavLink>
                <NavLink to="/creator/categories" className={navLinkClass}>
                  Category management
                </NavLink>
                <NavLink to="/creator/featured" className={navLinkClass}>
                  Featured content
                </NavLink>
              </>
            ) : null}
          </div>

          <div className="mt-auto pt-6">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </aside>

        <div className="space-y-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
