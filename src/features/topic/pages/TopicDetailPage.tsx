import { useParams } from 'react-router-dom';
import { useTopic, useTopics } from '../hooks/useTopics';
import { useMarkComplete, useMyProgress } from '@/features/progress/hooks/useProgress';
import { useMyEnrollments } from '@/features/enrollments/hooks/useEnrollments';
import { useAuthContext } from '@/providers/AuthProvider';
import { Loader2, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { LearningSidebar } from '../components/LearningSidebar';
import { TopicHeader } from '../components/TopicHeader';
import { LessonList } from '../components/LessonList';
import { TopicNavigation } from '../components/TopicNavigation';
import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function TopicDetailPage() {
  const { courseId, topicId } = useParams<{ courseId: string; topicId: string }>();
  const { user } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { data: topicRes, isLoading: isTopicLoading } = useTopic(courseId!, topicId!);
  const { data: syllabusRes, isLoading: isSyllabusLoading } = useTopics(courseId!);
  const { data: enrollmentRes } = useMyEnrollments();
  const { data: progressRes } = useMyProgress();
  const markCompleteMutation = useMarkComplete();

  const topic = topicRes?.data;
  const topics = syllabusRes?.data || [];
  const isEnrolled = !!enrollmentRes?.data?.some((e: any) => e.courseid === courseId);
  const completedLessonIds = new Set<string>(progressRes?.data?.map((p: any) => p.lessonid) || []);

  const currentIndex = topics.findIndex((t: any) => t.id === topicId);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  const handleMarkComplete = async (lessonId: string) => {
    try {
      await markCompleteMutation.mutateAsync({ lessonId, userId: user?.id });
      toast.success('Lesson marked as complete!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update progress');
    }
  };

  if (isTopicLoading || isSyllabusLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Entering learning mode...</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h2 className="text-2xl font-bold mb-2">Topic not found</h2>
        <Link 
          to={`/courses/${courseId}`} 
          className={cn(buttonVariants(), "mt-4")}
        >
          Back to Course
        </Link>
      </div>
    );
  }

  return (
    <div className="flex  min-h-screen bg-background relative pt-16">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      <LearningSidebar 
        courseId={courseId!} 
        topicId={topicId!} 
        completedLessonIds={completedLessonIds} 
        isSidebarOpen={isSidebarOpen} 
      />

      <main className="flex-1 overflow-y-auto pt-12 pb-24 lg:px-12 px-6">
        <div className="max-w-4xl mx-auto">
          <TopicHeader 
            courseId={courseId!} 
            topicName={topic.topicName} 
            currentIndex={currentIndex} 
            lessonCount={topic.lessons?.length || 0} 
          />

          <LessonList 
            courseId={courseId!}
            topicId={topicId!}
            lessons={topic.lessons || []} 
            completedLessonIds={completedLessonIds} 
            isEnrolled={isEnrolled} 
            onMarkComplete={handleMarkComplete} 
            isMarkingPending={markCompleteMutation.isPending} 
            hideActions={true}
          />

          <TopicNavigation 
            courseId={courseId!} 
            prevTopic={prevTopic} 
            nextTopic={nextTopic} 
          />
        </div>
      </main>
    </div>
  );
}
