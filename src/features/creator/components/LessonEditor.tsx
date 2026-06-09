import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Type } from 'lucide-react';

type LessonEditorProps = {
  editValue: string;
  editContent: string;
  setEditValue: (value: string) => void;
  setEditContent: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function LessonEditor({
  editValue,
  editContent,
  setEditValue,
  setEditContent,
  onCancel,
  onSave,
}: LessonEditorProps) {
  return (
    <div className="px-14 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          <Type className="size-3" /> Lesson Content (Markdown/Text)
        </Label>
        <Textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Write your lesson content here..."
          className="min-h-50 text-sm bg-background/50 border-white/10"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
