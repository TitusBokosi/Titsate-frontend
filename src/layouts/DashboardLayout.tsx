import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTop from '@/components/scrollTop';
export function DashboardLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop/>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X /> : <Menu />}
        </Button>
        <span className="font-bold text-primary">Titsate Dashboard</span>
        <div className="size-8" /> {/* Spacer */}
      </div>

      <DashboardSidebar mobileOpen={isMobileOpen} setMobileOpen={setIsMobileOpen} />
      
      <main className="lg:ml-64 min-h-screen transition-all duration-300">
        <div className="container max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
