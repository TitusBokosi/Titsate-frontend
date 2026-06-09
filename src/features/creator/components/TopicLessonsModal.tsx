import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import LessonDialog from './LessonDialog';
import { useState } from 'react';

type TopicLessonsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: any;
  onCreateLesson: (topicId: string, data: any) => Promise<void>;
  onUpdateLesson: (
    topicId: string,
    lessonId: string,
    data: any,
  ) => Promise<void>;
  onDeleteLesson: (topicId: string, lessonId: string) => Promise<void>;
};

export function TopicLessonsModal({
  open,
  onOpenChange,
  topic,
  onCreateLesson,
  onUpdateLesson,
  onDeleteLesson,
}: TopicLessonsModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);

  const handleCreate = async (data: any) => {
    await onCreateLesson(topic.id, data);
  };

  const handleUpdate = async (data: any) => {
    if (!editingLesson) return;
    await onUpdateLesson(topic.id, editingLesson.id, data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{topic?.topicName || 'Topic'}</DialogTitle>
            <div>
              <Button
                onClick={() => {
                  setEditingLesson(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="size-4 mr-2" /> Add Lesson
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          {!topic?.lessons || topic.lessons.length === 0 ? (
            <div className="text-center py-14">
              <h3 className="text-xl font-bold">No lessons yet</h3>
              <p className="text-muted-foreground mt-2">
                Add lessons to this topic to build your curriculum.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {topic.lessons.map((lesson: any, idx: number) => (
                <div
                  key={lesson.id}
                  className="p-4 bg-card border border-white/5 rounded-md flex justify-between items-center"
                >
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Lesson {idx + 1}
                    </div>
                    <div className="font-bold">{lesson.lessonName}</div>
                    <div className="text-xs text-muted-foreground">
                      {lesson.lessonType}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditingLesson(lesson);
                        setIsDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDeleteLesson(topic.id, lesson.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>

      <LessonDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initial={editingLesson || undefined}
        onSave={editingLesson ? handleUpdate : handleCreate}
      />
    </Dialog>
  );
}

export default TopicLessonsModal;
