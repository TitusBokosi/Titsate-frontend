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
  const [isTopicDialogOpen, setIsTopicDialogOpen] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [lessonTopicId, setLessonTopicId] = useState<string | null>(null);

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
          if (!open) setLessonTopicId(null);
          setIsLessonDialogOpen(open);
        }}
        initial={undefined}
        onSave={async (data) => {
          if (!lessonTopicId) return;
          await handleCreateLesson(lessonTopicId, data);
        }}
      />
    </div>
  );
}
