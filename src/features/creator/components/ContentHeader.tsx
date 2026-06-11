import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Send, Edit2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/features/course/hooks/useCategories';
import { cn } from '@/lib/utils';

type Props = {
  course?: any;
  isEditingCourse: boolean;
  editValue: string;
  setEditValue: (v: string) => void;
  setIsEditingCourse: (v: boolean) => void;
  onUpdateCourseName: () => Promise<void>;
  onSubmitForReview: () => Promise<void>;
  isEditingDetails?: boolean;
  setIsEditingDetails?: (v: boolean) => void;
  descriptionValue?: string;
  setDescriptionValue?: (v: string) => void;
  categoryValue?: string | null;
  setCategoryValue?: (v: string | null) => void;
  onUpdateCourseDetails?: () => Promise<void>;
};

import { useAuthContext } from '@/providers/AuthProvider';

export function ContentHeader({
  course,
  isEditingCourse,
  editValue,
  setEditValue,
  setIsEditingCourse,
  onUpdateCourseName,
  onSubmitForReview,
  isEditingDetails,
  setIsEditingDetails,
  descriptionValue,
  setDescriptionValue,
  categoryValue,
  setCategoryValue,
  onUpdateCourseDetails,
}: Props) {
  const { data: categoriesData } = useCategories();
  const { user } = useAuthContext();
  const isSuperCreator = user?.role === 'SUPER_CREATOR';

  return (
    <div className="flex items-center gap-4">
      <Link to="/creator">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ChevronLeft className="size-6" />
        </Button>
      </Link>
      <div className="flex-1">
        {isEditingCourse ? (
          <div className="flex items-center gap-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-2xl font-bold h-12 max-w-md"
            />
            <Button size="icon" onClick={onUpdateCourseName}>
              <Check className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditingCourse(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 group">
            <h1 className="text-3xl font-bold">{course?.courseName}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8"
              onClick={() => {
                setEditValue(course?.courseName || '');
                setIsEditingCourse(true);
              }}
            >
              <Edit2 className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8"
              onClick={() => {
                setDescriptionValue &&
                  setDescriptionValue(course?.description || '');
                setCategoryValue &&
                  setCategoryValue(course?.category?.categoryid || null);
                setIsEditingDetails && setIsEditingDetails(true);
              }}
            >
              <Edit2 className="size-4" />
            </Button>
          </div>
        )}

        {isEditingDetails ? (
          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={descriptionValue}
              onChange={(e) =>
                setDescriptionValue && setDescriptionValue(e.target.value)
              }
              className="mt-1"
            />

            <div>
              <label className="text-sm font-medium">Category</label>
              <div className="mt-2">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={categoryValue ?? ''}
                  onChange={(e) =>
                    setCategoryValue && setCategoryValue(e.target.value || null)
                  }
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

            <div className="flex gap-2 mt-2">
              <Button onClick={onUpdateCourseDetails}>Save</Button>
              <Button
                variant="ghost"
                onClick={() =>
                  setIsEditingDetails && setIsEditingDetails(false)
                }
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-2 mt-1">
          <Badge
            variant="outline"
            className="font-bold border-primary/20 text-primary"
          >
            {course?.category?.categoryName}
          </Badge>
          {!isSuperCreator && (
            <Badge
              className={cn(
                'font-bold border-none',
                course?.status === 'APPROVED'
                  ? 'bg-green-500/10 text-green-500'
                  : course?.status === 'REJECTED'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-yellow-500/10 text-yellow-500',
              )}
            >
              {course?.status}
            </Badge>
          )}
        </div>
      </div>
      {!isSuperCreator && (
        <div className="ml-auto flex gap-3">
          <Button
            className="font-bold rounded-full px-6 shadow-lg shadow-primary/20"
            onClick={onSubmitForReview}
            disabled={course?.status === 'PENDING'}
          >
            <Send className="size-4 mr-2" />
            {course?.status === 'REJECTED'
              ? 'Resubmit for Review'
              : 'Submit for Review'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ContentHeader;
