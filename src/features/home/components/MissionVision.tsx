import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap } from 'lucide-react';

export default function MissionVision() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mission Card */}
          <Card className="border-none bg-white shadow-2xl shadow-black/5 rounded-md overflow-hidden group hover:translate-y-[-8px] transition-all duration-500">
            <CardContent className="p-10 space-y-6">
              <div className="w-16 h-16 rounded-md bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                <Target className="size-8" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To empower the next generation of tech leaders by providing high-quality, practical content mentored by industry experts. We focus on <span className="text-primary font-semibold">"Learning by Doing"</span> to ensure our students are job-ready from day one.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vision Card */}
          <Card className="border-none bg-white shadow-2xl shadow-black/5 rounded-md overflow-hidden group hover:translate-y-[-8px] transition-all duration-500">
            <CardContent className="p-10 space-y-6">
              <div className="w-16 h-16 rounded-md bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                <Zap className="size-8" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold tracking-tight">Our Vision</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To become the world's most accessible and effective platform for hands-on technical education, where anyone, anywhere, can master the skills needed to <span className="text-primary font-semibold">build the future</span>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
