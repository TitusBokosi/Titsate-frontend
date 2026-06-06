import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LessonNavigationProps {
  courseId: string;
  topicId: string;
  prevLesson: any;
  nextLesson: any;
  isCompleted: boolean;
  onMarkComplete: () => void;
  isEnrolled: boolean;
  isMarkingPending: boolean;
}

export function LessonNavigation({ 
  courseId, 
  topicId, 
  prevLesson, 
  nextLesson, 
  isCompleted, 
  onMarkComplete,
  isEnrolled,
  isMarkingPending
}: LessonNavigationProps) {
  const navigate = useNavigate();

  return (
    <footer className="mt-20 pt-8 border-t border-white/5 space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
         {prevLesson ? (
           <Button 
            variant="ghost" 
            onClick={() => navigate(`/courses/${courseId}/topics/${topicId}/lessons/${prevLesson.id}`)}
            className="group flex items-center gap-3 h-auto py-3 px-6 hover:bg-primary/5 w-full md:w-auto justify-start"
           >
             <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-1" />
             <div className="text-left">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Previous Unit</div>
                <div className="font-bold text-sm">{prevLesson.lessonName}</div>
             </div>
           </Button>
         ) : null}

         {isEnrolled ? (
           <Button 
             variant={isCompleted ? "outline" : "default"}
             disabled={isCompleted || isMarkingPending}
             onClick={onMarkComplete}
             className={cn(
               "h-14 px-10 rounded-md font-black  shadow-xl transition-all grow md:grow-0",
               isCompleted ? "border-green-500/50 text-green-500 hover:bg-green-500/10" : "bg-primary hover:bg-primary/90 shadow-primary/20"
             )}
           >
             {isCompleted ? (
               <><CheckCircle className="size-6 mr-3" /> Completed</>
             ) : (
               <><CheckCircle className="size-6 mr-3" /> Complete & Next</>
             )}
           </Button>
         ) : (
           <Button 
            variant="secondary" 
            className="h-14 px-10 rounded-2xl font-bold"
            onClick={() => navigate(`/courses/${courseId}`)}
           >
             Enroll to Track Progress
           </Button>
         )}

         {nextLesson ? (
           <Button 
            variant="ghost" 
            onClick={() => navigate(`/courses/${courseId}/topics/${topicId}/lessons/${nextLesson.id}`)}
            className="group flex items-center gap-3 h-auto py-3 px-6 hover:bg-primary/5 w-full md:w-auto justify-end text-right"
           >
             <div className="text-right">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Next Unit</div>
                <div className="font-bold text-sm">{nextLesson.lessonName}</div>
             </div>
             <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
           </Button>
         ) : (
           <Button 
            variant="ghost" 
            onClick={() => navigate(`/courses/${courseId}/topics/${topicId}`)}
            className="group flex items-center gap-3 h-auto py-3 px-6 hover:bg-primary/5"
           >
             <div className="text-right">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Back to Topic</div>
                <div className="font-bold text-sm">Return to Module</div>
             </div>
             <ChevronRight className="size-5" />
           </Button>
         )}
      </div>
    </footer>
  );
}
