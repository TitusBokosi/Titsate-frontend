import { BookOpen, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LessonContentProps {
  lesson: any;
}

export function LessonContent({ lesson }: LessonContentProps) {
  if (!lesson) return null;

  return (
    <article className="prose prose-invert max-w-none">
      

      <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
        {lesson.lessonName}
      </h2>

      <div className="bg-card/30 border border-white/5 rounded-3xl p-8 md:p-12 mb-10 leading-relaxed text-zinc-300 relative overflow-hidden">
        {/* Subtle decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="relative z-10 space-y-6 text-lg">
          {lesson.content ? (
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
               <FileText className="size-16 mb-4 opacity-50" />
               <p>No content available for this unit yet.</p>
            </div>
          )}
        </div>
      </div>

      {lesson.lessonType === 'MINI_PROJECT' && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 mb-10">
           <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              🚀 Project Assignment
           </h3>
           <p className="text-zinc-400">
             To successfully complete this module, you must implement the concepts discussed above in a small project. 
             Refer to the documentation and submit your results for review.
           </p>
        </div>
      )}
    </article>
  );
}
