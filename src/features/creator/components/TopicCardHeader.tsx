import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GripVertical, Edit2, Trash, Check } from 'lucide-react';

type TopicCardHeaderProps = {
  topic: any;
  index: number;
  editingId: string | null;
  editValue: string;
  editPosition: string;
  setEditValue: (value: string) => void;
  setEditPosition: (value: string) => void;
  onUpdateTopic: (topicId: string) => Promise<void>;
  onDeleteTopic: (topicId: string) => void;
  onBeginEditing: (topic: any) => void;
  onCancelEditing: () => void;
};

export default function TopicCardHeader({
  topic,
  index,
  editingId,
  editValue,
  editPosition,
  setEditValue,
  setEditPosition,
  onUpdateTopic,
  onDeleteTopic,
  onBeginEditing,
  onCancelEditing,
}: TopicCardHeaderProps) {
  const isEditingTopic = editingId === topic.id;

  return (
    <CardHeader className="p-4 flex flex-row items-center gap-4 border-b border-white/5">
      <GripVertical className="size-5 text-muted-foreground/30" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Topic {index + 1}
          </span>
        </div>

        {isEditingTopic ? (
          <div className="grid gap-3 mt-1 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-3">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="h-9 font-bold"
                placeholder="Topic name"
              />
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={`position-${topic.id}`}
                  className="text-sm text-muted-foreground"
                >
                  Position
                </Label>
                <Input
                  id={`position-${topic.id}`}
                  type="number"
                  value={editPosition}
                  onChange={(e) => setEditPosition(e.target.value)}
                  className="h-9 w-24"
                  min={1}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => onUpdateTopic(topic.id)}>
                <Check />
              </Button>
              <Button variant="ghost" size="sm" onClick={onCancelEditing}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 group/topic">
            <CardTitle className="text-lg font-bold cursor-pointer">
              {topic.topicName}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover/topic:opacity-100 transition-opacity h-6 w-6 rounded-full"
              onClick={() => onBeginEditing(topic)}
            >
              <Edit2 className="size-3" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full opacity-50 hover:opacity-100"
          onClick={() => onDeleteTopic(topic.id)}
        >
          <Trash className="size-4 text-red-500" />
        </Button>
      </div>
    </CardHeader>
  );
}
