import { useParams, useNavigate } from 'react-router-dom'
import { useLesson } from '../hooks/useLessons'
import { useTopics } from '@/features/topic/hooks/useTopics'
import { useMarkComplete, useMyProgress } from '@/features/progress/hooks/useProgress'
import { useMyEnrollments, useEnrollInCourse } from '@/features/enrollments/hooks/useEnrollments'
import { useAuthContext } from '@/providers/AuthProvider'
import { Loader2, Menu, X } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

import { LearningSidebar } from '@/features/topic/components/LearningSidebar'
import { LessonContent } from '../components/LessonContent'
import { LessonNavigation } from '../components/LessonNavigation'

export function LessonDetailPage() {
  const { courseId, topicId, lessonId } = useParams<{
    courseId: string
    topicId: string
    lessonId: string
  }>()

  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthContext()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { data: lessonRes, isLoading: isLessonLoading } =
    useLesson(courseId!, topicId!, lessonId!)

  const { data: syllabusRes, isLoading: isSyllabusLoading } =
    useTopics(courseId!)

  const { data: enrollmentRes } = useMyEnrollments({ enabled: isAuthenticated })
  const { data: progressRes } = useMyProgress({ enabled: isAuthenticated })
  const markCompleteMutation = useMarkComplete()
  const enrollMutation = useEnrollInCourse()

  const lesson = lessonRes?.data
  const topics = syllabusRes?.data || []

  const currentTopic = topics.find((t: any) => t.id === topicId)

  const isEnrolled = isAuthenticated && !!enrollmentRes?.data?.some(
    (e: any) => e.courseid === courseId
  )

  const completedLessonIds = new Set<string>(
    progressRes?.data?.map((p: any) => p.lessonid) || []
  )

  const lessonsInTopic = currentTopic?.lessons || []

  const lessonIndex = lessonsInTopic.findIndex(
    (l: any) => l.id === lessonId
  )

  const prevLesson =
    lessonIndex > 0 ? lessonsInTopic[lessonIndex - 1] : null

  const nextLesson =
    lessonIndex < lessonsInTopic.length - 1
      ? lessonsInTopic[lessonIndex + 1]
      : null

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to enroll in this course')
      navigate('/login')
      return
    }

    try {
      await enrollMutation.mutateAsync({
        courseId: courseId!,
        userId: user?.id,
      })
      toast.success('Successfully enrolled in the course!')
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to enroll in the course'
      )
    }
  }

  const handleMarkComplete = async () => {
    try {
      await markCompleteMutation.mutateAsync({
        lessonId: lessonId!,
        userId: user?.id,
      })

      toast.success('Unit completed!')

      if (nextLesson) {
        navigate(
          `/courses/${courseId}/topics/${topicId}/lessons/${nextLesson.id}`
        )
      } else {
        const topicIndex = topics.findIndex(
          (t: any) => t.id === topicId
        )

        if (topicIndex < topics.length - 1) {
          const nextTopic = topics[topicIndex + 1]
          navigate(`/courses/${courseId}/topics/${nextTopic.id}`)
        }
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to update progress'
      )
    }
  }

  if (isLessonLoading || isSyllabusLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">
          Loading unit content...
        </p>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h2 className="text-2xl font-bold mb-2">Unit not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline mt-4"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background pt-16 relative">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MOBILE TOGGLE */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-lg border-white border-2"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      <LearningSidebar
        courseId={courseId!}
        topicId={topicId!}
        completedLessonIds={completedLessonIds}
        isSidebarOpen={isSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto pb-24 lg:px-16 px-6">
        <div className="max-w-4xl mx-auto">

          <LessonContent lesson={lesson} />

          <LessonNavigation
            courseId={courseId!}
            topicId={topicId!}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            isCompleted={completedLessonIds.has(lessonId!)}
            onMarkComplete={handleMarkComplete}
            isEnrolled={isEnrolled}
            isMarkingPending={markCompleteMutation.isPending}
            onEnroll={handleEnroll}
            isEnrolling={enrollMutation.isPending}
          />

        </div>
      </main>
    </div>
  )
}