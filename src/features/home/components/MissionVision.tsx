import { Card, CardContent } from '@/components/ui/card';
import { Target, Zap } from 'lucide-react';

export default function MissionVision() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Mission Card */}
          <Card className="border-none bg-white shadow-2xl shadow-black/5 rounded-md overflow-hidden group hover:translate-y-[-8px] transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                <Target className="size-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight">Our Mission</h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  To empower the next generation of tech leaders by providing high-quality, practical content mentored by industry experts. We focus on <span className="text-primary font-semibold">"Learning by Doing"</span>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vision Card */}
          <Card className="border-none bg-white shadow-2xl shadow-black/5 rounded-md overflow-hidden group hover:translate-y-[-8px] transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                <Zap className="size-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight">Our Vision</h2>
                <p className="text-muted-foreground text-base leading-relaxed">
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
