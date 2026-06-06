import { useUserEnrollments } from '@/features/enrollments/hooks/useEnrollments'
import { useUserProgress } from '@/features/progress/hooks/useProgress'
import { CourseCard } from '@/features/course/components/CourseCard'
import { Loader2 } from 'lucide-react'

export function UserEnrollments({ userId }: { userId: string }) {
  const { data: enrollmentResponse, isLoading: isLoadingEnrollments, isError: isErrorEnrollments, error: enrollmentError } = useUserEnrollments(userId)
  const { data: progressResponse, isLoading: isLoadingProgress } = useUserProgress(userId)

  if (isLoadingEnrollments || isLoadingProgress) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    )
  }

  if (isErrorEnrollments) {
    return <p className="text-destructive px-10">Failed to load enrollments: {(enrollmentError as Error).message}</p>
  }

  const enrollments = enrollmentResponse?.data || []
  const completedLessonIds = new Set(progressResponse?.data?.map((p: any) => p.lessonid) || [])

  return (
    <div className="mt-4 md:mt-12">
      <h3 className="text-xl md:text-2xl font-bold mb-6 tracking-tight text-center md:text-left">Enrolled Courses</h3>
      {enrollments.length === 0 ? (
        <div className="bg-muted/30 border border-dashed rounded-xl p-12 text-center">
          <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment: any) => {
            const course = enrollment.course;
            const courseLessons = course.topics?.flatMap((t: any) => t.lessons) || [];
            const totalLessonsCount = courseLessons.length;
            const completedCount = courseLessons.filter((l: any) => completedLessonIds.has(l.id)).length;

            return (
              <CourseCard
                key={enrollment.id}
                courseId={course.id}
                courseName={course.courseName}
                description={course.description}
                imageUrl={course.imageUrl}
                isEnrolled={true}
                totalLessonsCount={totalLessonsCount}
                completedLessonsCount={completedCount}
              />
            );
          })}
        </div>
      )}
    </div>
  )
}
