import { HeroHeader } from '@/components/header';
import FooterSection from '@/components/footer';
import { Outlet } from 'react-router-dom';

import ScrollToTop from '@/components/scrollTop';
export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop/>
      <HeroHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterSection />
    </div>  
  );
}
