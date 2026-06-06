import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCourseById } from '@/features/course/api/course'
import { useContentActions } from '../hooks/useAdmin'
import { TopicAccordion } from '../components/TopicAccordion'
import { LessonContent } from '../components/LessonContent'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Check, 
  X, 
  Loader2, 
  BookOpen, 
  FolderOpen 
} from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Lesson } from '@/features/course/api/course'
import { RejectionDialog } from '../components/RejectionDialog'

export function CoursePreviewPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  
  const { data: courseData, isLoading, isError } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourseById(courseId!),
    enabled: !!courseId
  })

  const { approveCourse, rejectCourse, isProcessing } = useContentActions()

  const course = courseData?.data

  const handleReject = (feedback: string) => {
    rejectCourse({ courseId: course.id, feedback })
    navigate('/admin/approvals')
  }

  // Automatically select first lesson of first topic if available
  useEffect(() => {
    if (course?.topics?.[0]?.lessons?.[0] && !selectedLesson) {
      setSelectedLesson(course.topics[0].lessons[0])
    }
  }, [course, selectedLesson])

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading course content...</p>
      </div>
    )
  }

  if (isError || !course) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <X className="size-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Failed to load course</h2>
        <p className="text-muted-foreground mb-4">The course you are looking for might have been deleted or the link is invalid.</p>
        <Button onClick={() => navigate('/admin/approvals')}>Back to Approvals</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-700">
      <RejectionDialog 
         isOpen={isRejectDialogOpen}
         onClose={() => setIsRejectDialogOpen(false)}
         onConfirm={handleReject}
         title={course.courseName}
         isProcessing={isProcessing}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 p-6 rounded-2xl border border-white/5 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/admin/approvals')}
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] uppercase tracking-wider font-bold">
                {course.category?.categoryName || 'Uncategorized'}
              </Badge>
              <Badge className={course.status === 'PENDING' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}>
                {course.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{course.courseName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="destructive" 
            onClick={() => setIsRejectDialogOpen(true)}
            disabled={isProcessing}
            className="px-6 font-semibold shadow-lg shadow-destructive/20"
          >
            <X className="size-4 mr-2" /> Reject
          </Button>
          <Button 
            variant="default"
            onClick={() => {
                approveCourse(course.id)
                navigate('/admin/approvals')
            }}
            disabled={isProcessing}
            className="px-6 font-semibold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
          >
            <Check className="size-4 mr-2" /> Approve
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-[600px] items-start">
        {/* Sidebar: Content Tree */}
        <div className="lg:col-span-4 flex flex-col space-y-4 lg:sticky lg:top-8">
          <div className="flex items-center gap-2 px-1">
            <FolderOpen className="size-4 text-primary" />
            <h2 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Curriculum</h2>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-2 scrollbar-thin scrollbar-thumb-primary/10">
            <TopicAccordion 
              courseId={course.id}
              topics={course.topics || []} 
              selectedLessonId={selectedLesson?.id}
              onLessonSelect={setSelectedLesson}
            />
            {(course.topics?.length === 0 || !course.topics) && (
              <div className="text-center py-16 border border-dashed rounded-xl bg-muted/5">
                <BookOpen className="size-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-muted-foreground italic text-sm px-4">This course doesn't have any topics or lessons yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main: Lesson Preview */}
        <div className="lg:col-span-8 bg-card/30 rounded-2xl border border-white/5 p-8 min-h-[500px] shadow-sm">
          {selectedLesson ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <LessonContent 
                  courseId={course.id} 
                  topicId={selectedLesson.topicid} 
                  lesson={selectedLesson} 
                />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
              <div className="size-20 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                <BookOpen className="size-10 text-primary opacity-40" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">Curriculum Preview</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">Select a lesson from the curriculum list on the left to review its content and media.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
