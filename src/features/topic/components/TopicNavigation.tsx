import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopicNavigationProps {
  courseId: string;
  prevTopic: any;
  nextTopic: any;
}

export function TopicNavigation({ courseId, prevTopic, nextTopic }: TopicNavigationProps) {
  const navigate = useNavigate();

  return (
    <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
      {prevTopic ? (
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/courses/${courseId}/topics/${prevTopic.id}`)}
          className="group flex flex-col items-start gap-1 h-auto py-3 px-6 hover:bg-primary/5"
        >
          <span className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1 group-hover:text-primary">
            <ChevronLeft className="size-3" /> Previous Topic
          </span>
          <span className="font-bold">{prevTopic.topicName}</span>
        </Button>
      ) : <div />}

      {nextTopic ? (
        <Button 
          onClick={() => navigate(`/courses/${courseId}/topics/${nextTopic.id}`)}
          className="group flex flex-col items-end gap-1 h-auto py-3 px-8 bg-zinc-900 hover:bg-primary text-white"
        >
          <span className="text-[10px] opacity-60 uppercase font-bold flex items-center gap-1">
            Next Topic <ChevronRight className="size-3" />
          </span>
          <span className="font-bold">{nextTopic.topicName}</span>
        </Button>
      ) : (
        <Button 
          variant="outline" 
          disabled
          className="h-auto py-4 px-8 border-dashed border-white/20"
        >
          🎉 End of Course
        </Button>
      )}
    </footer>
  );
}
