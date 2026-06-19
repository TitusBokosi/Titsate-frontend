import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative">
      <Link 
        to="/" 
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          "absolute top-8 left-8 text-muted-foreground hover:text-foreground hidden md:flex items-center gap-2 transition-all font-medium"
        )}
      >
        <ArrowLeft className="size-4" />
        Return to Website
      </Link>
      
      <div className="w-full max-w-sm relative z-10">
        <div className="md:hidden flex justify-center mb-8">
           <Link 
            to="/" 
            className="flex items-center gap-2 text-sm text-muted-foreground font-medium"
          >
            <ArrowLeft className="size-4" />
            Return to Website
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
