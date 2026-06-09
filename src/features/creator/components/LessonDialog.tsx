import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

type LessonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => Promise<void>;
  initial?: any;
};

export function LessonDialog({
  open,
  onOpenChange,
  onSave,
  initial,
}: LessonDialogProps) {
  const [lessonName, setLessonName] = useState(initial?.lessonName || '');
  const [lessonType, setLessonType] = useState(initial?.lessonType || 'TEXT');
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl || '');
  const [content, setContent] = useState(initial?.content || '');
  const [position, setPosition] = useState(
    initial?.position ? String(initial.position) : '',
  );

  useEffect(() => {
    setLessonName(initial?.lessonName || '');
    setLessonType(initial?.lessonType || 'TEXT');
    setVideoUrl(initial?.videoUrl || '');
    setContent(initial?.content || '');
    setPosition(initial?.position ? String(initial.position) : '');
  }, [initial, open]);

  const handleSave = async () => {
    const payload: any = { lessonName: lessonName.trim(), lessonType };
    if (content.trim()) payload.content = content;
    if (videoUrl.trim()) payload.videoUrl = videoUrl.trim();
    if (position.trim()) {
      const p = Number(position);
      if (!Number.isNaN(p)) payload.position = p;
    }
    await onSave(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div>
            <Label>Lesson Name</Label>
            <Input
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
            />
          </div>

          {lessonType === 'VIDEO' && (
            <div>
              <Label>Video URL</Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-35"
            />
          </div>

          <div>
            <Label>Position (optional)</Label>
            <Input
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{initial ? 'Save' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LessonDialog;
