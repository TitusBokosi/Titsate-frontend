import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../hooks/useCourses';
import {
  useEnrollInCourse,
  useMyEnrollments,
  useDeleteEnrollment,
} from '@/features/enrollments/hooks/useEnrollments';
import { useAuthContext } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CourseHero } from '../components/CourseHero';
import { CourseSyllabus } from '../components/CourseSyllabus';
import { CourseBenefits } from '../components/CourseBenefits';
import { CourseSidebar } from '../components/CourseSidebar';
import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

import { useMyProgress } from '@/features/progress/hooks/useProgress';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();
  const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);

  const { data: courseRes, isLoading, error } = useCourse(courseId!);
  const { data: enrollmentsRes } = useMyEnrollments({
    enabled: isAuthenticated,
  });
  const { data: progressRes } = useMyProgress({ enabled: isAuthenticated });
  const enrollMutation = useEnrollInCourse();
  const unenrollMutation = useDeleteEnrollment();

  const course = courseRes?.data;
  const userEnrollment = isAuthenticated && enrollmentsRes?.data?.find((e: any) => e.courseid === courseId);
  const isEnrolled = !!userEnrollment;

  const courseLessons = course?.topics?.flatMap((t: any) => t.lessons) || [];
  const totalCount = courseLessons.length;
  const completedCount = courseLessons.filter((l: any) =>
    progressRes?.data?.some((p: any) => p.lessonid === l.id),
  ).length;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to enroll in this course');
      navigate('/login');
      return;
    }

    try {
      await enrollMutation.mutateAsync({
        courseId: courseId!,
        userId: user?.id,
      });
      toast.success('Successfully enrolled in the course!');
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to enroll in the course',
      );
    }
  };

  const handleUnenroll = async () => {
    setShowUnenrollDialog(true);
  };

  const confirmUnenroll = async () => {
    if (!userEnrollment?.id) return;
    try {
      await unenrollMutation.mutateAsync(userEnrollment.id);
      setShowUnenrollDialog(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">
          Loading course details...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h2 className="text-2xl font-bold mb-2">Course not found</h2>
        <p className="text-muted-foreground mb-6">
          The course you are looking for does not exist or has been removed.
        </p>
        <Link to="/courses" className={buttonVariants()}>
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CourseHero
        course={course}
        isEnrolled={!!isEnrolled}
        onEnroll={handleEnroll}
        onUnenroll={handleUnenroll}
        isEnrolling={enrollMutation.isPending}
        isUnenrolling={unenrollMutation.isPending}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <CourseBenefits benefits={course.benefits} />
          <CourseSyllabus
            courseId={courseId!}
            topics={course.topics || []}
            isEnrolled={!!isEnrolled}
          />
        </div>
      </div>
      <AlertDialog open={showUnenrollDialog} onOpenChange={setShowUnenrollDialog}>
        <AlertDialogContent className="bg-zinc-950 border border-white/10 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-white">Deregister from course?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This action will remove you from <span className="font-bold text-white">{course.courseName}</span>. 
              Your progress will be saved if you decide to enroll again later, but you will lose immediate access to the lessons.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white p-2 px-5 rounded-sm hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmUnenroll}
              className="bg-red-600 text-white hover:bg-red-700 font-bold p-2 px-5 rounded-md"
            >
              Deregister
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
