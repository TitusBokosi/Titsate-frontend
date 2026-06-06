import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

interface CourseSidebarProps {
  isEnrolled: boolean;
  onEnroll: () => void;
  isEnrolling: boolean;
}

export function CourseSidebar({ isEnrolled, onEnroll, isEnrolling }: CourseSidebarProps) {
  const features = [
    { icon: <BookOpen className="size-4" />, label: "Course Curriculum", value: "Total Lifetime Access" },
    { icon: <BookOpen className="size-4" />, label: "Reading Material", value: "Included" },
    { icon: <CheckCircle className="size-4" />, label: "Hands-on Projects", value: "3 Projects" },
    { icon: <CheckCircle className="size-4" />, label: "Certificate", value: "Yes" },
  ];

  return (
    <div className="bg-card/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm sticky top-28">
      <h3 className="font-bold text-lg mb-6">Course Features</h3>
      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              {feature.icon}
              {feature.label}
            </span>
            <span className="font-medium">{feature.value}</span>
          </li>
        ))}
      </ul>

      {!isEnrolled && (
        <Button 
          onClick={onEnroll} 
          disabled={isEnrolling}
          className="w-full h-12 mb-4 font-bold"
        >
          Enroll to Track Progress
        </Button>
      )}
      <p className="text-[10px] text-center text-muted-foreground px-4">
        Get full lifetime access to this course for free. Enroll to save your progress and earn marks.
      </p>
    </div>
  );
}
