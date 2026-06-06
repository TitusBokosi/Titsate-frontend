import { CheckCircle } from 'lucide-react';

export function CourseBenefits() {
  const benefits = [
    "Comprehensive understanding of core concepts and industry best practices.",
    "Hands-on experience with real-world projects and case studies.",
    "Mastering tools and techniques used by top professionals.",
    "Practical skills that you can apply immediately to your work."
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <CheckCircle className="size-5 text-primary mt-0.5" />
            <span className="text-muted-foreground text-sm">{benefit}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
