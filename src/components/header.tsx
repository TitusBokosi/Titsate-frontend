import { Logo } from '@/components/logo';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/providers/AuthProvider';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'Pricing', href: '#pricing' },
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();

  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();

  const activeMenuItems = React.useMemo(() => {
    const items = [...menuItems];
    if (isAuthenticated && user) {
      let dashboardHref = `/dashboard/${user.id}`;
      if (user.role === 'ADMIN') {
        dashboardHref = '/admin';
      } else if (user.role === 'SUPER_CREATOR' || user.role === 'CREATOR') {
        dashboardHref = '/creator';
      }
      items.push({ name: 'Dashboard', href: dashboardHref });
    }
    return items;
  }, [isAuthenticated, user]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isLinkActive = (href: string) => {
    if (href.startsWith('#')) return false;
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className={cn(
          'fixed z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-background/70 border-b border-border backdrop-blur-lg'
            : 'bg-background text-foreground',
        )}
      >
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 md:py-4 lg:gap-0">
            {/* LEFT */}
            <div className="flex w-full justify-between gap-6 lg:w-auto">
              <Logo className="h-8 w-auto" />

              {/* MOBILE TOGGLE */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className={cn(
                    'm-auto size-6 duration-200',
                    menuState && 'rotate-180 scale-0 opacity-0',
                  )}
                />

                <X
                  className={cn(
                    'absolute inset-0 m-auto size-6 rotate-180 scale-0 opacity-0 duration-200',
                    menuState && 'rotate-0 scale-100 opacity-100',
                  )}
                />
              </button>

              {/* DESKTOP MENU */}
              <div className="m-auto hidden size-fit lg:block ml-8">
                <ul className="flex gap-2">
                  {activeMenuItems.map((item, index) => {
                    const active = isLinkActive(item.href);
                    return (
                      <li key={index}>
                        <Link
                          to={item.href}
                          className={cn(
                            buttonVariants({
                              variant: 'ghost',
                              size: 'sm',
                            }),
                            'relative transition-all',
                            active && 'text-primary font-bold bg-primary/5',
                          )}
                        >
                          {item.name}
                          {active && (
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* RIGHT */}
            <div
              className={cn(
                'in-data-[state=active]:block mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none',
                isScrolled
                  ? 'bg-background shadow-zinc-300/20'
                  : 'bg-background border-border shadow-none',
              )}
            >
              {/* MOBILE MENU */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {activeMenuItems.map((item, index) => {
                    const active = isLinkActive(item.href);
                    return (
                      <li key={index}>
                        <Link
                          to={item.href}
                          onClick={() => setMenuState(false)}
                          className={cn(
                            'block w-full py-2 transition-colors',
                            active
                              ? 'text-primary font-bold'
                              : 'text-foreground/70',
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ACTIONS */}
              <div className="flex w-full flex-col items-center space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                          size: 'sm',
                        }),
                      )}
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      className={cn(
                        buttonVariants({ size: 'sm' }),
                        'font-bold',
                      )}
                    >
                      Join Free
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-6">
                    <div
                      className={cn(
                        'flex items-center gap-2 text-sm font-bold transition-colors',
                        isLinkActive(`/dashboard/${user?.id}`) ||
                          isLinkActive('/admin')
                          ? 'text-primary'
                          : 'text-foreground',
                      )}
                    >
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <UserIcon className="size-4 text-primary" />
                      </div>
                      <span className="hidden sm:inline">
                        {user?.firstname}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="flex items-center gap-2 font-bold"
                    >
                      <LogOut className="size-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
