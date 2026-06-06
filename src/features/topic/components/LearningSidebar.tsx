import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTopics } from '../hooks/useTopics';

interface LearningSidebarProps {
  courseId: string;
  topicId: string;
  completedLessonIds: Set<string>;
  isSidebarOpen: boolean;
}

export function LearningSidebar({ 
  courseId, 
  topicId, 
  completedLessonIds, 
  isSidebarOpen 
}: LearningSidebarProps) {
  const navigate = useNavigate();
  const { data: syllabusRes, isLoading } = useTopics(courseId);
  
  const topics = syllabusRes?.data || [];
  
  const totalLessons = topics.reduce((acc: any, t: any) => acc + (t.lessons?.length || 0), 0);
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonIds.size / totalLessons) * 100) : 0;

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 w-80 bg-card border-r transition-transform lg:translate-x-0 pt-16 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:pt-0 lg:block shrink-0",
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="h-full flex flex-col pt-8">
        <div className="px-6 mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            Syllabus
          </h3>
          <p className="text-xs text-muted-foreground mt-1 text-primary animate-pulse">
             Course Progress: {progressPercent}%
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <Loader2 className="size-6 text-primary animate-spin" />
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Loading Topics...</p>
            </div>
          ) : (
            <Accordion defaultValue={topicId as any} className="space-y-2">
              {topics.map((t: any, idx: number) => (
              <AccordionItem 
                key={t.id} 
                value={t.id}
                className="border-none  rounded-xl px-2"
              >
                <AccordionTrigger className={cn(
                  "hover:no-underline py-3 px-2 text-sm",
                  t.id === topicId ? "text-primary" : "text-muted-foreground"
                )}>
                  <div className="flex items-center gap-3  text-left">
                     <span className="text-[10px] font-bold opacity-30">{String(idx + 1).padStart(2, '0')}</span>
                     <span className="font-semibold">{t.topicName}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-1">
                    {t.lessons?.map((lesson: any) => {
                      const isCompleted = completedLessonIds.has(lesson.id);
                      return (
                        <div 
                          key={lesson.id} 
                          onClick={() => {
                            navigate(`/courses/${courseId}/topics/${t.id}/lessons/${lesson.id}`);
                          }}
                          className={cn(
                            "flex items-center justify-between p-2.5 rounded-lg text-xs transition-all cursor-pointer px-8 ",
                            t.id === topicId ? "hover:bg-primary/10" : "opacity-60 grayscale hover:grayscale-0",
                            isCompleted && "text-green-500"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {isCompleted ? (
                              <CheckCircle className="size-3.5" />
                            ) : (
                              <BookOpen className="size-3.5" />
                            )}
                            <span>{lesson.lessonName}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
            </Accordion>
          )}
        </div>
      </div>
    </aside>
  );
}
