import { useState } from "react"
import type { Topic, Lesson } from "@/features/course/api/course"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { ChevronRight, PlayCircle, FileText, Code, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContentActions } from "../hooks/useAdmin"
import { RejectionDialog } from "./RejectionDialog"

interface TopicAccordionProps {
  courseId: string
  topics: Topic[]
  selectedLessonId?: string
  onLessonSelect: (lesson: Lesson) => void
}

export function TopicAccordion({ courseId, topics, selectedLessonId, onLessonSelect }: TopicAccordionProps) {
  const { approveTopic, rejectTopic, approveLesson, rejectLesson, isProcessing } = useContentActions()
  
  // States for nested rejection dialogs
  const [rejectingItem, setRejectingItem] = useState<{ id: string; name: string; type: 'topic' | 'lesson'; topicId?: string } | null>(null)

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <PlayCircle className="size-4" />
      case 'MINI_PROJECT': return <Code className="size-4" />
      default: return <FileText className="size-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 className="size-3 text-green-500" />
      case 'REJECTED': return <XCircle className="size-3 text-destructive" />
      case 'PENDING': return <Clock className="size-3 text-yellow-500" />
      default: return null
    }
  }

  const handleRejectConfirm = (feedback: string) => {
    if (!rejectingItem) return
    
    if (rejectingItem.type === 'topic') {
      rejectTopic({ courseId, topicId: rejectingItem.id, feedback })
    } else if (rejectingItem.type === 'lesson' && rejectingItem.topicId) {
      rejectLesson({ courseId, topicId: rejectingItem.topicId, lessonId: rejectingItem.id, feedback })
    }
    
    setRejectingItem(null)
  }

  return (
    <>
      <RejectionDialog 
        isOpen={!!rejectingItem}
        onClose={() => setRejectingItem(null)}
        onConfirm={handleRejectConfirm}
        title={rejectingItem?.name || ''}
        isProcessing={isProcessing}
      />

      <Accordion className="w-full space-y-2">
        {topics.map((topic) => (
          <AccordionItem key={topic.id} value={topic.id} className="border-none bg-card/40 rounded-lg px-2">
            <div className="flex items-center gap-2 pr-2">
              <AccordionTrigger className="hover:no-underline py-4 px-2 flex-1">
                <div className="flex items-center gap-3 text-left">
                  <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                    {topic.position}
                  </div>
                  <span className="font-semibold text-sm line-clamp-1">{topic.topicName}</span>
                  {getStatusIcon(topic.status)}
                </div>
              </AccordionTrigger>
              
              {topic.status === 'PENDING' && (
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-7 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      approveTopic({ courseId, topicId: topic.id });
                    }}
                  >
                    <CheckCircle2 className="size-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-7 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRejectingItem({ id: topic.id, name: topic.topicName, type: 'topic' });
                    }}
                  >
                    <XCircle className="size-4" />
                  </Button>
                </div>
              )}
            </div>

            <AccordionContent className="pb-4 px-2">
              <div className="space-y-1 pl-4 border-l-2 border-primary/10 ml-3">
                {topic.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center gap-1 group">
                    <button
                      onClick={() => onLessonSelect(lesson)}
                      className={cn(
                        "flex-1 flex items-center gap-3 p-2 rounded-md text-sm transition-all text-left",
                        selectedLessonId === lesson.id 
                          ? "bg-primary/20 text-primary font-medium" 
                          : "hover:bg-muted/50 text-muted-foreground"
                      )}
                    >
                      {getLessonIcon(lesson.lessonType)}
                      <span className="flex-1 line-clamp-1">{lesson.lessonName}</span>
                      {getStatusIcon(lesson.status)}
                      {selectedLessonId === lesson.id && <ChevronRight className="size-3" />}
                    </button>

                    {lesson.status === 'PENDING' && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-7 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                          disabled={isProcessing}
                          onClick={() => approveLesson({ courseId, topicId: topic.id, lessonId: lesson.id })}
                        >
                          <CheckCircle2 className="size-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="size-7 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          disabled={isProcessing}
                          onClick={() => setRejectingItem({ id: lesson.id, name: lesson.lessonName, type: 'lesson', topicId: topic.id })}
                        >
                          <XCircle className="size-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}
