import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import React from 'react';

type Course = any;

function getStatusColor(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    case 'PENDING':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'REJECTED':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'PENDING_DELETE':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
}

import { useAuthContext } from '@/providers/AuthProvider';

export function CourseCard({
  course,
  onDelete,
}: {
  course: Course;
  onDelete: (id: string) => void;
}) {
  const { user } = useAuthContext();
  const isSuperCreator = user?.role === 'SUPER_CREATOR';

  return (
    <Card className="group overflow-hidden rounded-2xl border-none shadow-xl ring-1 ring-white/10 bg-card/60 backdrop-blur-xl hover:translate-y-[-4px] transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={
            course.imageUrl ||
            `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop`
          }
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={course.courseName}
        />
        {!isSuperCreator && (
          <div className="absolute top-4 left-4">
            <Badge
              className={cn(
                'font-bold border-none shadow-sm',
                getStatusColor(course.status),
              )}
            >
              {course.status}
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-bold line-clamp-1">
            {course.courseName}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 size-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="size-3" />
          </Button>
        </div>
        <CardDescription className="line-clamp-2 mt-1 text-xs h-8 leading-snug">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        {course.status === 'REJECTED' && course.feedback && (
          <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 flex gap-2 text-[11px] text-red-500 animate-in zoom-in-95 duration-500">
            <AlertCircle className="size-3 shrink-0" />
            <div>
              <p className="font-bold uppercase tracking-wider text-[10px]">Rejection Reason:</p>
              <p className="mt-0.5 opacity-90">{course.feedback}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-3 flex gap-2">
        <Link to={`/creator/manage/${course.id}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-[11px] font-bold rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
          >
            <Edit className="size-3 mr-1.5" /> Manage
          </Button>
        </Link>
        <Button
          variant="destructive"
          size="icon"
          className="size-8 rounded-lg opacity-80 hover:opacity-100"
          onClick={() => onDelete(course.id)}
          disabled={course.status === 'PENDING_DELETE'}
        >
          <Trash className="size-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CourseCard;
