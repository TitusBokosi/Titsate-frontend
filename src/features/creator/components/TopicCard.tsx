import { Card, CardContent } from '@/components/ui/card';
import TopicCardHeader from './TopicCardHeader';
import TopicLessonList from './TopicLessonList';
import TopicCardFooter from './TopicCardFooter';

type TopicProps = {
  topic: any;
  index: number;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editValue: string;
  setEditValue: (v: string) => void;
  editContent: string;
  setEditContent: (v: string) => void;
  onUpdateTopic: (topicId: string) => Promise<void>;
  onDeleteTopic: (topicId: string) => void;
  onDeleteLesson: (opts: { topicId: string; lessonId: string }) => void;
  onUpdateLesson: (topicId: string, lessonId: string) => Promise<void>;
  editPosition: string;
  setEditPosition: (value: string) => void;
  onOpenLessonForm?: (topicId: string) => void;
};

export function TopicCard({
  topic,
  index,
  editingId,
  setEditingId,
  editValue,
  setEditValue,
  editContent,
  setEditContent,
  onUpdateTopic,
  onDeleteTopic,
  onDeleteLesson,
  onUpdateLesson,
  editPosition,
  setEditPosition,
  onOpenLessonForm,
}: TopicProps) {
  return (
    <Card className="border-none shadow-md ring-1 ring-white/5 bg-card/40 backdrop-blur-sm overflow-hidden">
      <TopicCardHeader
        topic={topic}
        index={index}
        editingId={editingId}
        editValue={editValue}
        editPosition={editPosition}
        setEditValue={setEditValue}
        setEditPosition={setEditPosition}
        onUpdateTopic={onUpdateTopic}
        onDeleteTopic={onDeleteTopic}
        onBeginEditing={(topicToEdit) => {
          setEditingId(topicToEdit.id);
          setEditValue(topicToEdit.topicName);
          setEditPosition(topicToEdit.position?.toString() || '');
        }}
        onCancelEditing={() => {
          setEditingId(null);
          setEditPosition('');
          setEditValue('');
        }}
      />
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          <TopicLessonList
            topic={topic}
            editingId={editingId}
            editValue={editValue}
            editContent={editContent}
            setEditValue={setEditValue}
            setEditContent={setEditContent}
            setEditingId={setEditingId}
            onUpdateLesson={onUpdateLesson}
            onDeleteLesson={onDeleteLesson}
          />
          <TopicCardFooter
            topicId={topic.id}
            onOpenLessonForm={onOpenLessonForm}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default TopicCard;
