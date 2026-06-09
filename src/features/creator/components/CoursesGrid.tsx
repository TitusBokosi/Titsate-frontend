import React from 'react';
import CourseCard from './CourseCard';
import EmptyStateCard from './EmptyStateCard';
import { Button } from '@/components/ui/button';

type Course = any;

export function CoursesGrid({
  courses,
  isLoading,
  onDelete,
}: {
  courses?: Course[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div>
        <EmptyStateCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default CoursesGrid;
