import { CourseCard } from '@/features/course/components/CourseCard';
import { useCourses } from '@/features/course/hooks/useCourses';
import { useMyEnrollments } from '@/features/enrollments/hooks/useEnrollments';
import { useMyProgress } from '@/features/progress/hooks/useProgress';
import { useAuthContext } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function Courses() {
  const { isAuthenticated } = useAuthContext();
  const { data: coursesData, isLoading: isLoadingCourses, isError: isErrorCourses } = useCourses({ limit: 6 });
  const { data: enrollmentsRes } = useMyEnrollments({ enabled: isAuthenticated });
  const { data: progressRes } = useMyProgress({ enabled: isAuthenticated });

  if (isLoadingCourses) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isErrorCourses) {
    return <div className="text-center py-20 text-destructive">Failed to load courses.</div>;
  }

  const enrollments = enrollmentsRes?.data || [];
  const completedLessonIds = new Set(progressRes?.data?.map((p: any) => p.lessonid) || []);

  return (
    <div className="mx-5 md:mx-10 lg:mx-40 py-24 border-b">
      <div className="flex flex-col gap-2 mb-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">Featured Courses</h2>
        <p className="text-muted-foreground">Start your learning journey with our top-rated content.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
        {coursesData?.data?.map((course: any) => {
          const isEnrolled = isAuthenticated && enrollments.some((e: any) => e.courseid === course.id);
          const courseLessons = course.topics?.flatMap((t: any) => t.lessons) || [];
          const totalCount = courseLessons.length;
          const completedCount = courseLessons.filter((l: any) => completedLessonIds.has(l.id)).length;

          return (
            <CourseCard 
              key={course.id} 
              courseId={course.id}
              courseName={course.courseName} 
              description={course.description} 
              imageUrl={course.imageUrl}
              categoryName={course.category?.categoryName}
              isEnrolled={isEnrolled}
              totalLessonsCount={totalCount}
              completedLessonsCount={completedCount}
            />
          );
        })}
      </div>
    </div>
  );
}
