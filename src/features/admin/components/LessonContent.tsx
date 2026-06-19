import { useState } from "react"
import type { Lesson } from "@/features/course/api/course"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Video, Code, CheckCircle2, XCircle, ExternalLink } from "lucide-react"
import { useContentActions } from "../hooks/useAdmin"
import { cn } from "@/lib/utils"
import { RejectionDialog } from "./RejectionDialog"

interface LessonContentProps {
  courseId: string
  topicId: string
  lesson: Lesson
}

export function LessonContent({ courseId, topicId, lesson }: LessonContentProps) {
  const { approveLesson, rejectLesson, isProcessing } = useContentActions()
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const videoUrl = lesson.videoUrl?.trim()
  const isEmbeddableVideo = videoUrl && /(?:youtube\.com\/embed\/|player\.vimeo\.com\/video\/)/.test(videoUrl)

  const handleReject = (feedback: string) => {
    rejectLesson({ courseId, topicId, lessonId: lesson.id, feedback })
    setIsRejectDialogOpen(false)
  }

  const getIcon = () => {
    switch (lesson.lessonType) {
      case 'VIDEO': return <Video className="size-6 text-blue-500" />
      case 'MINI_PROJECT': return <Code className="size-6 text-purple-500" />
      default: return <FileText className="size-6 text-green-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 font-bold tracking-tight">APPROVED</Badge>
      case 'REJECTED': return <Badge variant="destructive" className="px-3 py-1 font-bold tracking-tight">REJECTED</Badge>
      case 'PENDING': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-3 py-1 font-bold tracking-tight">PENDING REVIEW</Badge>
      default: return null
    }
  }

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <RejectionDialog 
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleReject}
        title={lesson.lessonName}
        isProcessing={isProcessing}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">{lesson.lessonType}</Badge>
               {getStatusBadge(lesson.status)}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{lesson.lessonName}</h2>
          </div>
        </div>

        {lesson.status === 'PENDING' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 sm:flex-none border-destructive/20 text-destructive hover:bg-destructive/10"
                disabled={isProcessing}
                onClick={() => setIsRejectDialogOpen(true)}
             >
                <XCircle className="size-4 mr-2" /> Reject
             </Button>
             <Button 
                variant="default" 
                size="sm" 
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 font-semibold"
                disabled={isProcessing}
                onClick={() => approveLesson({ courseId, topicId, lessonId: lesson.id })}
             >
                <CheckCircle2 className="size-4 mr-2" /> Approve
             </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Media Content */}
        {lesson.lessonType === 'VIDEO' && (
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 shadow-2xl">
              {videoUrl ? (
                isEmbeddableVideo ? (
                  <iframe
                    src={videoUrl}
                    title={lesson.lessonName}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoUrl}
                    controls
                    className="h-full w-full bg-black"
                  />
                )
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                  <Video className="mb-4 size-16 opacity-30" />
                  <p className="font-medium text-foreground">No video source provided</p>
                </div>
              )}
            </div>
            {videoUrl && (
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 h-9"
                onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="size-4" /> Open Source URL
              </Button>
            )}
          </div>
        )}

        {/* Text Content */}
        <div className={cn(
          "bg-muted/5 rounded-2xl p-8 ring-1 ring-white/5",
          lesson.lessonType === 'VIDEO' && "mt-4"
        )}>
           <div className="flex items-center gap-2 mb-6 text-muted-foreground">
              <FileText className="size-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Lesson Content</h3>
           </div>
           
           <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-code:text-primary">
              {lesson.content ? (
                <div className="whitespace-pre-wrap leading-relaxed text-lg">
                  {lesson.content}
                </div>
              ) : (
                <div className="py-20 text-center border border-dashed rounded-xl bg-background/50 border-white/5">
                  <FileText className="size-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground italic">No descriptive content provided for this lesson.</p>
                </div>
              )}
           </div>
        </div>

        {lesson.lessonType === 'MINI_PROJECT' && (
           <div className="bg-purple-500/5 rounded-2xl p-8 border border-purple-500/10 ring-1 ring-white/5">
              <div className="flex items-center gap-2 mb-6 text-purple-400">
                <Code className="size-5" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Project Requirements</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This lesson contains a practical mini-project. Review the project objectives and ensure they align with the course goals.
              </p>
           </div>
        )}
      </div>
    </div>
  )
}
