import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type Props = {
  onOpen: () => void;
  disabled?: boolean;
};

export function CreateCourseButton({ onOpen, disabled }: Props) {
  return (
    <Button
      className="font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-full px-6"
      size="lg"
      onClick={onOpen}
      disabled={disabled}
    >
      <Plus className="size-5 mr-2" /> Create New Course
    </Button>
  );
}

export default CreateCourseButton;
