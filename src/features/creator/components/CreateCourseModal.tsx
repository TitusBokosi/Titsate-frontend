import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { useCategories } from '@/features/course/hooks/useCategories';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    description?: string,
    categoryId?: string | null,
  ) => Promise<any>;
  isProcessing?: boolean;
};

export function CreateCourseModal({
  open,
  onClose,
  onSubmit,
  isProcessing,
}: Props) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [categoryId, setCategoryId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const { data: categoriesData } = useCategories();

  React.useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setError(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Please provide a course title.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(title.trim(), description.trim() || undefined, categoryId);
      onClose();
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => {
          if (!loading) onClose();
        }}
      />
      <Card className="z-10 w-full max-w-2xl rounded-2xl">
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Course Title</label>
              <Input
                aria-label="Course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title"
                className="mt-2"
                disabled={loading || isProcessing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category (optional)</label>
              <div className="mt-2">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={categoryId ?? ''}
                  onChange={(e) => setCategoryId(e.target.value || null)}
                  disabled={loading || isProcessing}
                >
                  <option value="">No category</option>
                  {categoriesData?.data?.map((c) => (
                    <option key={c.categoryid} value={c.categoryid}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                aria-label="Course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description (optional)"
                className="mt-2"
                disabled={loading || isProcessing}
              />
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={loading || isProcessing}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading || isProcessing}>
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateCourseModal;
