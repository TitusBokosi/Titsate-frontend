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
import { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Terminal, 
  Eye, 
  Edit3, 
  ArrowUpNarrowWide,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type LessonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => Promise<void>;
  initial?: any;
  siblingLessons?: any[];
};

export function LessonDialog({
  open,
  onOpenChange,
  onSave,
  initial,
  siblingLessons = [],
}: LessonDialogProps) {
  const [activeTab, setActiveTab] = useState('edit');
  const [lessonName, setLessonName] = useState(initial?.lessonName || '');
  const [lessonType, setLessonType] = useState(initial?.lessonType || 'TEXT');
  const [content, setContent] = useState(initial?.content || '');
  const [position, setPosition] = useState(
    initial?.position ? String(initial.position) : '',
  );

  useEffect(() => {
    if (open) {
      setLessonName(initial?.lessonName || '');
      setLessonType(initial?.lessonType || 'TEXT');
      setContent(initial?.content || '');
      setPosition(initial?.position ? String(initial.position) : '');
      setActiveTab('edit');
    }
  }, [initial, open]);

  const previewLessons = useMemo(() => {
    const list = [...siblingLessons];
    const currentIndex = list.findIndex((l) => l.id === initial?.id);
    
    // If we are editing, remove the current lesson from the list temporarily
    if (currentIndex !== -1) {
      list.splice(currentIndex, 1);
    }
    
    // Current lesson being edited/added
    const currentLesson = {
      id: initial?.id || 'new-lesson',
      lessonName: lessonName || 'Untitled Lesson',
      lessonType: lessonType,
      isCurrent: true
    };

    let targetPos = Number(position);
    if (isNaN(targetPos) || targetPos < 1) targetPos = list.length + 1;
    if (targetPos > list.length + 1) targetPos = list.length + 1;

    list.splice(targetPos - 1, 0, currentLesson);
    return list;
  }, [siblingLessons, initial, lessonName, lessonType, position]);

  const handleSave = async () => {
    const payload: any = { 
      lessonName: lessonName.trim(), 
      lessonType,
      content: content.trim() 
    };
    if (position.trim()) {
      const p = Number(position);
      if (!Number.isNaN(p)) payload.position = p;
    }
    await onSave(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl h-[85vh] flex flex-col p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {initial ? 'Fine-tune Lesson' : 'Craft New Lesson'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden px-6">
          <TabsList className="bg-black/20 border border-white/5 h-12 p-1 rounded-xl shrink-0 mt-4">
            <TabsTrigger value="edit" className="rounded-lg gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Edit3 className="size-4" /> Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-lg gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Eye className="size-4" /> Visual Preview
            </TabsTrigger>
            <TabsTrigger value="reorder" className="rounded-lg gap-2 px-4 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <ArrowUpNarrowWide className="size-4" /> Placement
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-6">
            <TabsContent value="edit" className="mt-0 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Lesson Designation</Label>
                  <Input
                    value={lessonName}
                    placeholder="e.g. Introduction to React"
                    onChange={(e) => setLessonName(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-primary/50 transition-all h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Lesson Archetype</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={lessonType === 'TEXT' ? 'default' : 'outline'}
                      className={`h-11 gap-2 rounded-xl border-white/10 transition-all ${lessonType === 'TEXT' ? 'shadow-lg shadow-primary/20' : 'bg-white/5'}`}
                      onClick={() => setLessonType('TEXT')}
                    >
                      <FileText className="size-4" /> Text
                    </Button>
                    <Button
                      type="button"
                      variant={lessonType === 'MINI_PROJECT' ? 'default' : 'outline'}
                      className={`h-11 gap-2 rounded-xl border-white/10 transition-all ${lessonType === 'MINI_PROJECT' ? 'shadow-lg shadow-primary/20' : 'bg-white/5'}`}
                      onClick={() => setLessonType('MINI_PROJECT')}
                    >
                      <Terminal className="size-4" /> Project
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Content Manuscript</Label>
                  <Badge variant="outline" className="font-mono text-[10px] bg-white/5 border-white/10 opacity-70">Markdown Supported</Badge>
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your lesson content here... Use markdown for headers, lists, and code blocks."
                  className="min-h-[250px] bg-white/5 border-white/10 focus:border-primary/50 transition-all resize-none shadow-inner"
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div className="rounded-2xl border border-white/5 bg-black/20 p-8 min-h-[350px]">
                {content ? (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4 py-20">
                    <div className="size-16 rounded-3xl bg-white/5 flex items-center justify-center">
                      <FileText className="size-8" />
                    </div>
                    <p>Start writing to see the preview live</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reorder" className="mt-0 space-y-6">
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-4 items-center">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowUpNarrowWide className="size-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">Current Flow Position</h4>
                  <p className="text-xs text-muted-foreground">Adjust where this lesson sits in the topic sequence</p>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    value={position}
                    placeholder={`Max: ${siblingLessons.length + (initial ? 0 : 1)}`}
                    onChange={(e) => setPosition(e.target.value)}
                    className="bg-black/20 border-white/10 text-center h-10 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium px-1">Curriculum Flow Preview</Label>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {previewLessons.map((l, idx) => (
                    <div 
                      key={l.id} 
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        l.isCurrent 
                          ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20' 
                          : 'bg-white/5 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="size-7 rounded-lg bg-black/20 flex items-center justify-center text-xs font-mono font-bold text-muted-foreground">
                        {idx + 1}
                      </div>
                      <div className="flex-1 flex items-center gap-2 overflow-hidden">
                        {l.lessonType === 'MINI_PROJECT' ? <Terminal className="size-3.5 text-primary" /> : <FileText className="size-3.5 text-blue-400" />}
                        <span className="text-sm font-medium truncate">{l.lessonName}</span>
                      </div>
                      {l.isCurrent && (
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-2 rounded-full text-[10px]">Active Edit</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="p-6 pt-2 bg-gradient-to-t from-black/20 to-transparent">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl px-6 h-11 border border-white/5">
            Dismiss
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!lessonName.trim()}
            className="rounded-xl px-8 h-11 shadow-lg shadow-primary/20"
          >
            {initial ? 'Apply Changes' : 'Initialize Lesson'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LessonDialog;
