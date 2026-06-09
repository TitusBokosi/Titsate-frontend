import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type TopicCardFooterProps = {
  topicId: string;
  onOpenLessonForm?: (topicId: string) => void;
};

export default function TopicCardFooter({
  topicId,
  onOpenLessonForm,
}: TopicCardFooterProps) {
  return (
    <div className="p-4">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit border-dashed border border-primary/20 text-primary/70 hover:text-primary hover:bg-primary/5 rounded-xl py-6"
        onClick={() => onOpenLessonForm?.(topicId)}
      >
        <Plus className="size-4 mr-2" /> Add Lesson to this Topic
      </Button>
    </div>
  );
}
