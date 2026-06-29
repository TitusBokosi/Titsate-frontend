import { Outlet, Link } from 'react-router-dom';
import ScrollToTop from '@/components/scrollTop';
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative">
      <ScrollToTop/>
      <div className="w-full max-w-sm relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
