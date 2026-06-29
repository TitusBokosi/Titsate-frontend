import { HeroHeader } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Shield, Zap } from 'lucide-react';
import MissionVision from '../components/MissionVision';
import { useAuthContext } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function AboutUsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();

  const handleButtonClick = () => {
    if (isAuthenticated && user) {
      let dashboardHref = `/dashboard/${user.id}`;
      if (user.role === 'ADMIN') {
        dashboardHref = '/admin';
      } else if (user.role === 'SUPER_CREATOR' || user.role === 'CREATOR') {
        dashboardHref = '/creator';
      }
      navigate(dashboardHref);
    } else {
      navigate('/signup');
    }
  };

  const buttonText = isAuthenticated ? 'Go to Dashboard' : 'Join for Free';
  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-white">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="  text-5xl md:text-10xl font-extrabold tracking-tight text-foreground">
                Empowering the next generation of <span className="text-primary ">Tech Leaders</span>
              </h2>
              <p className="text-xl text-left text-muted-foreground leading-relaxed">
                Titsate is more than just an e-learning platform. We're a community-driven ecosystem designed to bridge the gap between theoretical knowledge and real-world expertise.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-10 ">
        <MissionVision></MissionVision>
        </section>

    
        <section className="py-24 ">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl font-bold">The Values that Drive Us</h2>
              <p className="text-muted-foreground">These principles are the foundation of everything we build at Titsate.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Excellence', icon: Zap, desc: 'We strive for the highest quality in every lesson and line of code.' },
                { title: 'Community', icon: Users, desc: 'Growth happens best together. We foster a supportive, collaborative environment.' },
                { title: 'Integrity', icon: Shield, desc: 'Transparency and honesty are at the heart of our platform.' },
                { title: 'Innovation', icon: Target, desc: 'We constantly evolve our platform to meet the needs of a changing industry.' },
              ].map((value, i) => (
                <Card key={i} className="border-none bg-card shadow-xl  hover:translate-y-[-8px] transition-all">
                  <CardContent className="p-8 space-y-4 text-center">
                    <div className="mx-auto w-fit rounded-xl  text-primary  flex items-center justify-center">
                      <value.icon className="size-6" />
                    </div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

       
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto rounded-3xl bg-linear-to-r from-primary to-primary/60 p-12 md:p-16 text-center text-primary-foreground space-y-8 shadow-2xl shadow-primary/20">
              <h2 className="text-3xl md:text-5xl font-bold">Ready to start your journey?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join thousands of students and creators who are already building their dreams on Titsate.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={handleButtonClick}
                  className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:shadow-lg transition-all active:scale-95"
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
