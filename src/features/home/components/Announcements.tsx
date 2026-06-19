import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Megaphone, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Announcements() {
  const [isVisible, setIsVisible] = useState(true);

  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ['public-announcements'],
    queryFn: async () => {
      const res = await api.get('/admin/announcements/public');
      return res.data.data;
    },
  });

  if (!isVisible || isLoading || !announcements || announcements.length === 0) {
    return null;
  }

  // Show the latest announcement
  const latest = announcements[0];

  return (
    <div className="bg-primary/10 border-b border-primary/20 animate-in slide-in-from-top duration-500 mt-20 relative z-40">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Megaphone className="size-4 text-primary animate-bounce" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
            <span className="font-bold text-sm text-primary whitespace-nowrap sr-only sm:not-sr-only">New:</span>
            <p className="text-sm text-foreground/90 truncate">
              <span className="font-semibold text-foreground">{latest.title}</span> — {latest.content}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-primary/20 rounded-full transition-colors text-foreground/50 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
