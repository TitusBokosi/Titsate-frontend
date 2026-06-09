import { useState, type FormEvent } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

interface TopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (topicName: string) => Promise<void>;
}

export function TopicDialog({
  open,
  onOpenChange,
  onCreate,
}: TopicDialogProps) {
  const [topicName, setTopicName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = topicName.trim();

    if (!trimmed) {
      setError('Topic name is required');
      return;
    }

    setError('');
    await onCreate(trimmed);
    setTopicName('');
    onOpenChange(false);
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen: boolean) => {
        if (!nextOpen) {
          setError('');
          setTopicName('');
        }
        onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent className="max-w-md bg-card border-none shadow-2xl ring-1 ring-white/10">
        <AlertDialogHeader>
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <PlusCircle className="size-6 text-primary" />
          </div>
          <AlertDialogTitle className="text-xl">
            Create a new topic
          </AlertDialogTitle>
          <AlertDialogDescription>
            Enter a topic name to add it to your course curriculum.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="topic-name"
              className="text-sm font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Topic name
            </Label>
            <Input
              id="topic-name"
              placeholder="e.g. Getting Started"
              value={topicName}
              onChange={(event) => setTopicName(event.target.value)}
              autoFocus
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <AlertDialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              Create topic
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
