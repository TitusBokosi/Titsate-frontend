import TopicCard from './TopicCard';
import { Button } from '@/components/ui/button';
import { Clock, Plus, BookOpen } from 'lucide-react';

export function Curriculum({
  course,
  editingId,
  setEditingId,
  editValue,
  setEditValue,
  editPosition,
  setEditPosition,
  editContent,
  setEditContent,
  onOpenTopicDialog,
  onOpenLessonForm,
  deleteTopic,
  deleteLesson,
  updateTopic,
  updateLesson,
}: any) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="size-6 text-primary" />
          Curriculum
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={onOpenTopicDialog}
        >
          <Plus className="size-4 mr-2" /> Add Topic
        </Button>
      </div>

      <div className="space-y-6">
        {course?.topics?.map((topic: any, index: number) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            index={index}
            editingId={editingId}
            setEditingId={setEditingId}
            editValue={editValue}
            setEditValue={setEditValue}
            editPosition={editPosition}
            setEditPosition={setEditPosition}
            editContent={editContent}
            setEditContent={setEditContent}
            onUpdateTopic={updateTopic}
            onDeleteTopic={deleteTopic}
            onDeleteLesson={deleteLesson}
            onUpdateLesson={updateLesson}
            onOpenLessonForm={onOpenLessonForm}
          />
        ))}

        {(!course?.topics || course.topics.length === 0) && (
          <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-3xl">
            <Clock className="size-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Your curriculum is empty</h3>
            <p className="text-muted-foreground mt-2">
              Start by adding a topic to organize your lessons.
            </p>
            <Button
              className="mt-6 rounded-full px-8"
              onClick={onOpenTopicDialog}
            >
              <Plus className="size-4 mr-2" /> Add Your First Topic
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Curriculum;
