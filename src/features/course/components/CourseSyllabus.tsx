import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CourseSyllabusProps {
  courseId: string;
  topics: any[];
  isEnrolled: boolean;
}

export function CourseSyllabus({ courseId, topics, isEnrolled }: CourseSyllabusProps) {
  const navigate = useNavigate();

  if (!topics || topics.length === 0) {
    return (
      <div className="bg-card/50 p-8 rounded-2xl border border-dashed border-white/20 text-center">
        <BookOpen className="size-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">The syllabus is currently being finalized. Check back soon!</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Course Content</h2>
      <Accordion className="w-full space-y-4">
        {topics.map((topic: any, index: number) => (
          <AccordionItem 
            key={topic.id} 
            value={topic.id}
            className="border border-white/5 bg-card/30 rounded-xl overflow-hidden px-4"
          >
            <div className="flex items-center justify-between border border-white/5 bg-card/30 rounded-xl overflow-hidden px-4 hover:bg-card/50 transition-colors">
              <div 
                className="flex-1 flex items-center gap-4 py-4 cursor-pointer group"
                onClick={() => {
                  navigate(`/courses/${courseId}/topics/${topic.id}`);
                }}
              >
                <div className="bg-primary/10 text-primary size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {index + 1}
                </div>
                <div className="font-bold group-hover:text-primary transition-colors text-left uppercase text-sm tracking-wide">
                  {topic.topicName}
                </div>
                <div className="text-[10px] text-muted-foreground ml-2">
                  {topic.lessons?.length || 0} Units
                </div>
              </div>
              <AccordionTrigger className="w-12 h-12 flex items-center justify-center hover:no-underline p-0" />
            </div>
            <AccordionContent className="pb-4">
              <div className="space-y-1 pt-2">
                {topic.lessons?.map((lesson: any) => (
                  <div 
                    key={lesson.id} 
                    className="flex items-center justify-between p-3 px-15 rounded-lg hover:bg-primary/5 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/courses/${courseId}/topics/${topic.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="size-4 text-primary" />
                      <span className="text-sm font-medium">{lesson.lessonName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
