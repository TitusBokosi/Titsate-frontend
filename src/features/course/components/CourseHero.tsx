import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CourseHeroProps {
  course: any;
  isEnrolled: boolean;
  onEnroll: () => void;
  isEnrolling: boolean;
  completedCount?: number;
  totalCount?: number;
}

export function CourseHero({ 
  course, 
  isEnrolled, 
  onEnroll, 
  isEnrolling,
  completedCount = 0,
  totalCount = 0
}: CourseHeroProps) {
  const navigate = useNavigate();

  return (
    <div className="relative bg-zinc-950 text-white pt-32 pb-16 px-6">
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/courses')}
          className="text-zinc-400 hover:text-white hover:bg-white/10 mb-8 -ml-2"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Courses
        </Button>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">
                {course.category?.categoryName || 'General'}
              </Badge>
              {course.status && course.status !== 'APPROVED' && (
                <Badge className={cn(
                  "border-none text-white font-bold",
                  course.status === 'PENDING' && "bg-yellow-500/90",
                  course.status === 'REJECTED' && "bg-red-500/90",
                  course.status === 'PENDING_DELETE' && "bg-orange-500/90"
                )}>
                  {course.status.replace('_', ' ')}
                </Badge>
              )}
              <div className="flex items-center text-sm text-zinc-400">
                <Clock className="size-4 mr-1" />
                Self-paced
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {course.courseName}
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8 max-w-2xl">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-4">
              {isEnrolled ? (
                <Link 
                  to={`/courses/${course.id}/topics/${course.topics?.[0]?.id}/lessons/${course.topics?.[0]?.lessons?.[0]?.id}`}
                  className={cn(
                    buttonVariants({ variant: (totalCount > 0 && completedCount >= totalCount) ? "outline" : "default" }), 
                    "font-bold h-12 px-8 min-w-[200px] transition-all",
                    (totalCount > 0 && completedCount >= totalCount) 
                      ? "border-green-500 text-green-500 hover:bg-green-500/10" 
                      : "bg-green-600 hover:bg-green-700 text-white"
                  )}
                >
                  {totalCount > 0 && completedCount >= totalCount ? "Finished" : "Continue Learning"}
                </Link>
              ) : (
                <Button 
                  onClick={onEnroll} 
                  disabled={isEnrolling}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 shadow-lg shadow-primary/20"
                >
                  {isEnrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enroll Now
                </Button>
              )}
            </div>
          </div>

          <div className="w-full md:w-80 shrink-0">
             <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <img 
                  src={course.imageUrl || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`} 
                  alt={course.courseName} 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
