import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  courseName: string;
  description: string;
  courseId: string;
  imageUrl?: string;
  categoryName?: string;
  lessonCount?: number;
  duration?: string;
  isEnrolled?: boolean;
  completedLessonsCount?: number;
  totalLessonsCount?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PENDING_DELETE';
}

export function CourseCard({ 
  courseName, 
  description, 
  courseId, 
  imageUrl, 
  categoryName,
  lessonCount, // This might be overridden by totalLessonsCount
  duration = "Self-paced",
  isEnrolled,
  completedLessonsCount = 0,
  totalLessonsCount = 0,
  status = 'APPROVED'
}: CourseCardProps) {
  const displayLessonCount = totalLessonsCount || lessonCount || 8;
  const isCompleted = isEnrolled && totalLessonsCount > 0 && completedLessonsCount >= totalLessonsCount;

  const buttonText = isEnrolled 
    ? (isCompleted ? "Finished" : "Continue Learning") 
    : "Open";

  const statusColors = {
    PENDING: "bg-yellow-500/90 text-white",
    REJECTED: "bg-red-500/90 text-white",
    PENDING_DELETE: "bg-orange-500/90 text-white",
    APPROVED: "bg-primary/90 text-primary-foreground"
  };

  return (
    <Card className="group overflow-hidden border-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-background/50 backdrop-blur-sm border border-white/10">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`}
          alt={courseName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {categoryName && (
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md border-none">
              {categoryName}
            </Badge>
          )}
          {status !== 'APPROVED' && (
            <Badge className={cn("backdrop-blur-md border-none font-bold", statusColors[status])}>
              {status.replace('_', ' ')}
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <BookOpen className="size-3" />
            <span>{displayLessonCount} Lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <span>{duration}</span>
          </div>
        </div>
        <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {courseName}
        </CardTitle>
        <CardDescription className="line-clamp-2 mt-2 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="p-4 pt-4">
        <Link 
          to={`/courses/${courseId}`}
          className={cn(
            buttonVariants({ variant: isCompleted ? "outline" : "default" }), 
            "w-full font-semibold shadow-lg transition-all active:scale-[0.98]",
            !isCompleted && "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
          )}
        >
          {buttonText}
        </Link>
      </CardFooter>
    </Card>
  );
}
