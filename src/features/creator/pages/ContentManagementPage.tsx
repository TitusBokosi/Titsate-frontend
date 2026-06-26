import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as courseApi from '@/features/course/api/course';
import {
  useContentManagementActions,
  useCreatorActions,
} from '../hooks/useCreator';
import { useState } from 'react';
import ContentHeader from '../components/ContentHeader';
import RejectionFeedback from '../components/RejectionFeedback';
import Curriculum from '../components/Curriculum';
import { TopicDialog } from '../components/TopicDialog';
import LessonDialog from '../components/LessonDialog';

export function ContentManagementPage() {
  const { courseId } = useParams();
  const {
    data: courseData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => courseApi.getCourseById(courseId as string),
  });

  const {
    createTopic,
    updateTopic,
    deleteTopic,
    createLesson,
    updateLesson,
    deleteLesson,
  } = useContentManagementActions(courseId as string);
  const { updateCourse } = useCreatorActions();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState('');
  const [categoryValue, setCategoryValue] = useState<string | null>(null);
  const [benefitsValue, setBenefitsValue] = useState<string[]>([]);
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [lessonTopicId, setLessonTopicId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);

  const course = courseData?.data;

  const handleOpenTopicDialog = () => {
    setIsTopicDialogOpen(true);
  };

  const handleCreateTopic = async (topicName: string) => {
    await createTopic({ topicName });
    refetch();
  };

  const handleOpenLessonForm = (topicId: string) => {
    setLessonTopicId(topicId);
    setIsLessonDialogOpen(true);
  };

  const handleCreateLesson = async (topicId: string, data: any) => {
    await createLesson({ topicId, data });
    refetch();
  };

  const handleOpenEditLesson = (topicId: string, lesson: any) => {
    setLessonTopicId(topicId);
    setEditingLesson(lesson);
    setIsLessonDialogOpen(true);
  };

  const handleUpdateLessonComplex = async (topicId: string, lessonId: string, data: any) => {
    if (!course) return;

    const topic = course.topics?.find((t: any) => t.id === topicId);
    if (!topic) return;

    const lessons = (topic.lessons || []).slice().map((l: any, i: number) => ({
      ...l,
      position: typeof l.position === 'number' ? l.position : i + 1,
    }));

    const currentIndex = lessons.findIndex((l: any) => l.id === lessonId);
    if (currentIndex === -1) return;

    let requestedPos: number | null = null;
    if (data.position !== undefined) {
      requestedPos = Math.max(1, Math.min(data.position, lessons.length));
    }

    const isPositionChange = requestedPos !== null && requestedPos !== (currentIndex + 1);

    if (!isPositionChange) {
      await updateLesson({ topicId, lessonId, data });
      refetch();
      return;
    }

    // Standard reordering logic
    const moved = lessons.splice(currentIndex, 1)[0];
    const insertIndex = (requestedPos as number) - 1;
    lessons.splice(insertIndex, 0, moved);

    const updates: Array<Promise<any>> = [];
    for (let i = 0; i < lessons.length; i++) {
        const l = lessons[i];
        const newPos = i + 1;
        const payload: any = {};
        if (l.position !== newPos) payload.position = newPos;
        if (l.id === lessonId) {
            // Apply other updates as well
            Object.assign(payload, data);
            payload.position = newPos; // override
        }
        if (Object.keys(payload).length > 0) {
            updates.push(updateLesson({ topicId, lessonId: l.id, data: payload }));
        }
    }

    await Promise.all(updates);
    refetch();
  };

  const handleSubmitForReview = async () => {
    if (!course) return;
    await updateCourse({ id: course.id, data: { status: 'PENDING' } });
    refetch();
  };

  const handleUpdateCourseName = async () => {
    if (!course) return;
    await updateCourse({ id: course.id, data: { courseName: editValue } });
    setIsEditingCourse(false);
    refetch();
  };

  const handleUpdateCourseDetails = async () => {
    if (!course) return;
    const payload: any = {};
    if (descriptionValue !== undefined) payload.description = descriptionValue;
    if (categoryValue !== undefined) payload.categoryId = categoryValue;
    if (benefitsValue !== undefined) {
      payload.benefits = benefitsValue.filter((b) => b.trim() !== '');
    }

    await updateCourse({ id: course.id, data: payload });
    setIsEditingDetails(false);
    refetch();
  };

  const handleUpdateTopic = async (topicId: string) => {
    if (!course) return;

    const trimmedName = editValue.trim();

    // Build current topics list, sorted by position if available, else by array order
    const topics = (course.topics || []).slice().map((t: any, i: number) => ({
      ...t,
      __origIndex: i,
      position: typeof t.position === 'number' ? t.position : i + 1,
    }));

    const currentIndex = topics.findIndex((t: any) => t.id === topicId);
    if (currentIndex === -1) return;

    // Validate and parse requested position
    let requestedPos: number | null = null;
    if (editPosition.trim() !== '') {
      const parsedPosition = Number(editPosition);
      if (!Number.isNaN(parsedPosition)) {
        // clamp to valid range 1..topics.length
        requestedPos = Math.max(1, Math.min(parsedPosition, topics.length));
      }
    }

    // If no name change and no position change, just reset UI
    const isNameChange = !!trimmedName;
    const isPositionChange =
      requestedPos !== null && requestedPos !== currentIndex + 1;
    if (!isNameChange && !isPositionChange) {
      setEditingId(null);
      setEditPosition('');
      setEditValue('');
      return;
    }

    // If only updating name, update single topic
    if (!isPositionChange) {
      const updateData: any = {};
      if (isNameChange) updateData.topicName = trimmedName;
      await updateTopic({ topicId, data: updateData });
      setEditingId(null);
      setEditPosition('');
      setEditValue('');
      refetch();
      return;
    }

    // Position change: move the topic within the array by inserting at requestedPos (1-based)
    const moved = topics.splice(currentIndex, 1)[0];
    const insertIndex = (requestedPos as number) - 1;
    topics.splice(insertIndex, 0, moved);

    // Build list of updates for any topic whose position changes, plus name change for moved topic
    const updates: Array<Promise<any>> = [];
    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      const newPos = i + 1;
      const payload: any = {};
      if (t.position !== newPos) payload.position = newPos;
      if (t.id === topicId && isNameChange) payload.topicName = trimmedName;
      if (Object.keys(payload).length > 0) {
        updates.push(updateTopic({ topicId: t.id, data: payload }));
      }
    }

    // Execute all updates
    await Promise.all(updates);
    setEditingId(null);
    setEditPosition('');
    setEditValue('');
    refetch();
  };

  const handleInlineUpdateLesson = async (
    topicId: string,
    lessonId: string,
  ) => {
    await updateLesson({
      topicId,
      lessonId,
      data: { lessonName: editValue, content: editContent },
    });
    setEditingId(null);
    refetch();
  };

  if (isLoading)
    return <div className="p-10 text-center">Loading content...</div>;

  return (
    <div className="container mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-500">
      <ContentHeader
        course={course}
        isEditingCourse={isEditingCourse}
        editValue={editValue}
        setEditValue={setEditValue}
        setIsEditingCourse={setIsEditingCourse}
        onUpdateCourseName={handleUpdateCourseName}
        onSubmitForReview={handleSubmitForReview}
        isEditingDetails={isEditingDetails}
        setIsEditingDetails={setIsEditingDetails}
        descriptionValue={descriptionValue}
        setDescriptionValue={setDescriptionValue}
        categoryValue={categoryValue}
        setCategoryValue={setCategoryValue}
        benefitsValue={benefitsValue}
        setBenefitsValue={setBenefitsValue}
        onUpdateCourseDetails={handleUpdateCourseDetails}
      />

      <RejectionFeedback
        feedback={course?.status === 'REJECTED' ? course?.feedback : undefined}
      />

      <Curriculum
        course={course}
        editingId={editingId}
        setEditingId={setEditingId}
        editValue={editValue}
        setEditValue={setEditValue}
        editPosition={editPosition}
        setEditPosition={setEditPosition}
        editContent={editContent}
        setEditContent={setEditContent}
        onOpenTopicDialog={handleOpenTopicDialog}
        onOpenLessonForm={handleOpenLessonForm}
        onOpenEditLesson={handleOpenEditLesson}
        deleteTopic={deleteTopic}
        deleteLesson={deleteLesson}
        updateTopic={handleUpdateTopic}
        updateLesson={handleInlineUpdateLesson}
      />

      <TopicDialog
        open={isTopicDialogOpen}
        onOpenChange={setIsTopicDialogOpen}
        onCreate={handleCreateTopic}
      />

      <LessonDialog
        open={isLessonDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
              setLessonTopicId(null);
              setEditingLesson(null);
          }
          setIsLessonDialogOpen(open);
        }}
        initial={editingLesson}
        siblingLessons={course?.topics?.find((t: any) => t.id === lessonTopicId)?.lessons || []}
        onSave={async (data) => {
          if (!lessonTopicId) return;
          if (editingLesson) {
              await handleUpdateLessonComplex(lessonTopicId, editingLesson.id, data);
          } else {
              await handleCreateLesson(lessonTopicId, data);
          }
        }}
      />
    </div>
  );
}
