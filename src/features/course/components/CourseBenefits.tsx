import { CheckCircle } from 'lucide-react';
import type { Benefit } from '../api/course';

interface CourseBenefitsProps {
  benefits?: Benefit[];
}

export function CourseBenefits({ benefits }: CourseBenefitsProps) {
  // Use provided benefits or fall back to empty array if needed, 
  // though we might want to keep the hardcoded ones as a fallback 
  // or just show nothing if none in DB. 
  // The user wants them in DB, so if empty, we might show a message or nothing.
  
  if (!benefits || benefits.length === 0) {
    return null; // Or show nothing if no benefits defined yet
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="flex items-start gap-3">
            <CheckCircle className="size-5 text-primary mt-0.5" />
            <span className="text-muted-foreground text-sm">{benefit.content}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
