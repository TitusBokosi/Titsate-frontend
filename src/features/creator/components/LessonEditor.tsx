import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Type, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="px-14 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Type className="size-3" /> Lesson Content (Markdown)
          </Label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-[10px] gap-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? (
              <><EyeOff className="size-3" /> Hide Preview</>
            ) : (
              <><Eye className="size-3" /> Live Preview</>
            )}
          </Button>
        </div>
        
        {isPreview ? (
          <div className="min-h-50 p-4 rounded-xl bg-black/20 border border-white/5 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {editContent || '*No content to preview*'}
            </ReactMarkdown>
          </div>
        ) : (
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Write your lesson content here... Use markdown for rich formatting."
            className="min-h-50 text-sm bg-background/50 border-white/10 focus:border-primary/30 transition-all rounded-xl"
          />
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel} className="rounded-lg">
          Cancel
        </Button>
        <Button size="sm" onClick={onSave} className="rounded-lg shadow-lg shadow-primary/10 px-6">
          Update Lesson
        </Button>
      </div>
    </div>
  );
}
