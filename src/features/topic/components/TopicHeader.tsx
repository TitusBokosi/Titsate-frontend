import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TopicHeaderProps {
  courseId: string;
  topicName: string;
  currentIndex: number;
  lessonCount: number;
}

export function TopicHeader({ courseId, topicName, currentIndex, lessonCount }: TopicHeaderProps) {
  return (
    <header className="mb-12">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Link to={`/courses/${courseId}`} className="hover:text-primary transition-colors">Course</Link>
        <ChevronRight className="size-3" />
        <span>Topic {currentIndex + 1}</span>
      </div>
      <h1 className="text-3xl text-primary md:text-4xl font-black tracking-tight mb-4">
        {topicName}
      </h1>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Welcome to this module. Below is a list of units included in this topic. 
        Complete the units and projects to progress.
      </p>
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold">Module Content</h3>
        <Badge variant="outline" className="text-[10px] h-5">{lessonCount} Units</Badge>
      </div>
    </header>
  );
}
