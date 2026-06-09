import TopicLessonItem from './TopicLessonItem';

type TopicLessonListProps = {
  topic: any;
  editingId: string | null;
  editValue: string;
  editContent: string;
  setEditValue: (value: string) => void;
  setEditContent: (value: string) => void;
  setEditingId: (id: string | null) => void;
  onUpdateLesson: (topicId: string, lessonId: string) => Promise<void>;
  onDeleteLesson: (opts: { topicId: string; lessonId: string }) => void;
};

export default function TopicLessonList({
  topic,
  editingId,
  editValue,
  editContent,
  setEditValue,
  setEditContent,
  setEditingId,
  onUpdateLesson,
  onDeleteLesson,
}: TopicLessonListProps) {
  return (
    <>
      {topic.lessons?.map((lesson: any) => (
        <TopicLessonItem
          key={lesson.id}
          lesson={lesson}
          editingId={editingId}
          editValue={editValue}
          editContent={editContent}
          setEditValue={setEditValue}
          setEditContent={setEditContent}
          onBeginLessonEdit={() => {
            setEditingId(lesson.id);
            setEditValue(lesson.lessonName);
            setEditContent(lesson.content || '');
          }}
          onCancelLessonEdit={() => {
            setEditingId(null);
            setEditValue('');
            setEditContent('');
          }}
          onSaveLesson={() => onUpdateLesson(topic.id, lesson.id)}
          onDeleteLesson={() =>
            onDeleteLesson({ topicId: topic.id, lessonId: lesson.id })
          }
        />
      ))}
    </>
  );
}
