import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import React from 'react';

export function RejectionFeedback({ feedback }: { feedback?: string }) {
  if (!feedback) return null;
  return (
    <Card className="border-red-500/20 bg-red-500/5 shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 py-4">
        <AlertCircle className="size-6 text-red-500" />
        <div>
          <CardTitle className="text-lg text-red-500">
            Rejection Feedback
          </CardTitle>
          <CardDescription className="text-red-500/80">
            Please address the following issues before resubmitting.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="p-4 rounded-xl bg-background/50 text-foreground/90 font-medium border border-red-500/10">
          "{feedback}"
        </p>
      </CardContent>
    </Card>
  );
}

export default RejectionFeedback;
