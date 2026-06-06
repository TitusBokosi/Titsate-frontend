import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface LessonListProps {
  lessons: any[];
  completedLessonIds: Set<string>;
  isEnrolled: boolean;
  onMarkComplete: (lessonId: string) => void;
  isMarkingPending: boolean;
  courseId: string;
  topicId: string;
  hideActions?: boolean;
}

export function LessonList({ 
  lessons, 
  completedLessonIds, 
  isEnrolled, 
  onMarkComplete, 
  isMarkingPending,
  courseId,
  topicId,
  hideActions = false
}: LessonListProps) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 mt-6">
      {lessons?.map((lesson: any, idx: number) => {
        const isCompleted = completedLessonIds.has(lesson.id);
        return (
          <div 
            key={lesson.id} 
            onClick={() => navigate(`/courses/${courseId}/topics/${topicId}/lessons/${lesson.id}`)}
            className={cn(
              "group bg-card border border-white/5 rounded-md p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all cursor-pointer",
              isCompleted ? "border-green-500/30 bg-green-500/5 shadow-lg shadow-green-500/5" : "hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-5">
              <div className=" group-hover:bg-primary/20 transition-colors size-12 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen className="size-6 text-primary" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Lesson {idx + 1}</div>
                <h3 className="font-bold text-lg">{lesson.lessonName}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="size-3" /> 15 mins</span>
                  <span className="flex items-center gap-1 capitalize">Standard unit content</span>
                </div>
              </div>
            </div>

            {!hideActions && (
              <div className="flex items-center gap-3 self-end md:self-auto">
                {isEnrolled ? (
                  <Button 
                    variant={isCompleted ? "outline" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkComplete(lesson.id);
                    }}
                    disabled={isCompleted || isMarkingPending}
                    className={cn(
                      "h-10 px-6 rounded-xl font-bold transition-all",
                      isCompleted && "border-green-500/50 text-green-500 hover:bg-green-500/10"
                    )}
                  >
                    {isCompleted ? (
                      <><CheckCircle className="size-4 mr-2" /> Completed</>
                    ) : (
                      <><CheckCircle className="size-4 mr-2" /> Mark as Complete</>
                    )}
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="h-10 px-6 rounded-xl font-bold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${courseId}`);
                    }}
                  >
                    Enroll to Track Progress
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
