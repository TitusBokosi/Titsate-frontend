import { Card } from '@/components/ui/card';
import { LayoutGrid } from 'lucide-react';
import React from 'react';

export function EmptyStateCard() {
  return (
    <Card className="border-dashed border-2 bg-muted/20 py-16 flex flex-col items-center justify-center rounded-3xl">
      <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <LayoutGrid className="size-10 text-primary opacity-50" />
      </div>
      <h3 className="text-2xl font-bold">No courses yet</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-center">
        You haven't created any courses yet. Start by creating your first course
        and sharing your knowledge.
      </p>
    </Card>
  );
}

export default EmptyStateCard;
