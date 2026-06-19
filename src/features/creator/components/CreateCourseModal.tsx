import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { useCategories } from '@/features/course/hooks/useCategories';
import { Plus, Trash2 } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    description?: string,
    categoryId?: string | null,
    benefits?: string[]
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
  const [benefits, setBenefits] = React.useState<string[]>(['']);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const { data: categoriesData } = useCategories();

  React.useEffect(() => {
    if (!open) {
      setTitle('');
      setDescription('');
      setCategoryId(null);
      setBenefits(['']);
      setError(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const addBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const removeBenefit = (index: number) => {
    if (benefits.length === 1) return;
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Please provide a course title.');
      return;
    }

    try {
      setLoading(true);
      const filteredBenefits = benefits.filter(b => b.trim() !== '');
      await onSubmit(
        title.trim(), 
        description.trim() || undefined, 
        categoryId,
        filteredBenefits.length > 0 ? filteredBenefits : undefined
      );
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => {
          if (!loading) onClose();
        }}
      />
      <Card className="z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold">Course Title</label>
              <Input
                aria-label="Course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced Web Development"
                className="mt-2"
                disabled={loading || isProcessing}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold">Category (optional)</label>
                <div className="mt-2">
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm bg-background transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/20"
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
            </div>

            <div>
              <label className="text-sm font-semibold">
                What will students learn? (Benefits)
              </label>
              <div className="space-y-3 mt-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      placeholder={`Benefit #${index + 1}`}
                      disabled={loading || isProcessing}
                      className="bg-muted/30"
                    />
                    {benefits.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBenefit(index)}
                        className="text-destructive hover:bg-destructive/10"
                        disabled={loading || isProcessing}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addBenefit}
                  className="mt-1 gap-2"
                  disabled={loading || isProcessing}
                >
                  <Plus className="size-4" />
                  Add Another Benefit
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">
                Description (optional)
              </label>
              <Textarea
                aria-label="Course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give a brief overview of what this course covers..."
                className="mt-2 min-h-[100px]"
                disabled={loading || isProcessing}
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={loading || isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading || isProcessing}
                className="px-8"
              >
                {loading ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateCourseModal;
