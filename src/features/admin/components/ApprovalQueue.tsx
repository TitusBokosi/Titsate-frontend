import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye, Clock } from 'lucide-react';
import type { Course } from '@/features/course/api/course';
import { useContentActions } from '../hooks/useAdmin';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ApprovalQueueProps {
  courses: Course[];
}

export function ApprovalQueue({ courses }: ApprovalQueueProps) {
  const { approveCourse, rejectCourse, isProcessing } = useContentActions();

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
        <Clock className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
        <h3 className="text-lg font-medium">No pending approvals</h3>
        <p className="text-muted-foreground">All content is up to date.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((course) => (
        <Card
          key={course.id}
          className="overflow-hidden flex flex-col border-none shadow-md ring-1 ring-white/10 bg-card/50"
        >
          <div className="aspect-video relative overflow-hidden">
            <img
              src={
                course.imageUrl ||
                `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`
              }
              className="w-full h-full object-cover"
              alt={course.courseName}
            />
            <div className="absolute top-2 right-2">
              <Badge
                className={cn(
                  'font-bold border-none',
                  course.status === 'PENDING_DELETE'
                    ? 'bg-red-500'
                    : 'bg-yellow-500',
                )}
              >
                {course.status === 'PENDING_DELETE'
                  ? 'DELETE REQUEST'
                  : 'NEW/UPDATED'}
              </Badge>
            </div>
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-lg line-clamp-1">
              {course.courseName}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {course.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-4 pt-0 mt-auto flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => approveCourse(course.id)}
              disabled={isProcessing}
            >
              <Check className="size-4 mr-1" /> Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => rejectCourse(course.id)}
              disabled={isProcessing}
            >
              <X className="size-4 mr-1" /> Reject
            </Button>
            <Link
              to={`/creator/approvals/${course.id}`}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'icon' }),
                'shrink-0',
              )}
            >
              <Eye className="size-4" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
