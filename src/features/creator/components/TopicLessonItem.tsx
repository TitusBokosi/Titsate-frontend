import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Video, Edit2, Trash, AlertCircle } from 'lucide-react';
import { LessonEditor } from './LessonEditor';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type TopicLessonItemProps = {
  lesson: any;
  editingId: string | null;
  editValue: string;
  editContent: string;
  setEditValue: (value: string) => void;
  setEditContent: (value: string) => void;
  onBeginLessonEdit: () => void;
  onCancelLessonEdit: () => void;
  onSaveLesson: () => void;
  onDeleteLesson: () => void;
  onOpenEditLesson: () => void;
};

export default function TopicLessonItem({
  lesson,
  editingId,
  editValue,
  editContent,
  setEditValue,
  setEditContent,
  onBeginLessonEdit,
  onCancelLessonEdit,
  onSaveLesson,
  onDeleteLesson,
  onOpenEditLesson,
}: TopicLessonItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isEditingLesson = editingId === lesson.id;
  const isVideo = lesson.lessonType === 'VIDEO';

  const toggleExpand = () => {
    if (isEditingLesson) return;
    setIsExpanded((current) => !current);
  };

  return (
    <div className="flex flex-col border-b border-white/5 bg-black/5 last:border-0 hover:bg-white/5 transition-colors">
      <div
        role="button"
        tabIndex={0}
        className="p-4 flex items-center gap-4 group/lesson w-full text-left cursor-pointer"
        onClick={toggleExpand}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleExpand();
          }
        }}
      >
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {isVideo ? (
            <Video className="size-5" />
          ) : (
            <FileText className="size-5" />
          )}
        </div>

        <div className="flex-1">
          {isEditingLesson ? (
            <div className="flex items-center gap-2">
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-8 text-sm font-bold w-full bg-background border border-white/10 rounded-md px-2"
                placeholder="Lesson name"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">{lesson.lessonName}</h4>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover/lesson:opacity-100 transition-opacity h-6 w-6 rounded-full"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenEditLesson();
                }}
              >
                <Edit2 className="size-3" />
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            {lesson.lessonType}
          </p>
        </div>

        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full opacity-50 hover:opacity-100"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="size-4 text-red-500" />
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <AlertCircle className="size-5" />
                  <AlertDialogTitle>Delete Lesson?</AlertDialogTitle>
                </div>
                <AlertDialogDescription>
                  This will permanently remove the lesson <strong>{lesson.lessonName}</strong>. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="ghost" className="rounded-xl px-4" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4"
                  onClick={() => {
                    onDeleteLesson();
                    setIsDeleteDialogOpen(false);
                  }}
                >
                  Confirm Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {isExpanded && !isEditingLesson && (
        <div className="px-14 pb-4 whitespace-pre-wrap text-sm text-muted-foreground">
          {lesson.content ? lesson.content : 'No lesson content available.'}
        </div>
      )}

      {isEditingLesson && (
        <LessonEditor
          editValue={editValue}
          editContent={editContent}
          setEditValue={setEditValue}
          setEditContent={setEditContent}
          onCancel={onCancelLessonEdit}
          onSave={onSaveLesson}
        />
      )}
    </div>
  );
}
