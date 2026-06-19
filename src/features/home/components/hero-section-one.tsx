import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { HeroHeader } from '../../../components/header';
import { ChevronRight, CirclePlay } from 'lucide-react';
import hero from '../../../assets/hero.jpeg';

import Marquee from "../components/Marquee";

import github from "../../../assets/marquee/github-142-svgrepo-com.svg";
import java from "../../../assets/marquee/java-svgrepo-com.svg";
import reactLogo from "../../../assets/marquee/react-svgrepo-com.svg";
import javascript from "../../../assets/marquee/javascript-svgrepo-com.svg";
import node from "../../../assets/marquee/node-js-svgrepo-com.svg";

import { useAuthContext } from '@/providers/AuthProvider';
import Announcements from './Announcements';

export default function HeroSection() {
  const { user } = useAuthContext();
  const role = user?.role;
  const logos = [github, java, reactLogo, javascript, node];

  return (
    <>
      <Announcements/>
      <main className="overflow-hidden">
        <section className="bg-linear-to-b to-muted from-background">
          <div className="relative py-36">
            <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
              <div className="md:w-1/2">
                <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                  <h1 className="max-w-md text-balance text-5xl font-medium md:text-6xl">
                    Kickstart your tech journey
                  </h1>
                  <p className="text-muted-foreground my-8 max-w-2xl text-balance text-xl animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
                    Stop Watching.{' '}
                    <span className="text-[#d9450f]">Start Building</span>.
                    Titsate helps you turn knowledge into real skills with
                    hands-on learning that gets you hired.
                  </p>

                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <Link to={user ? (role === 'ADMIN' ? '/admin' : role?.includes('CREATOR') ? '/creator' : `/dashboard/${user.id}/learning`) : '/signup'}>
                      <Button size="lg" className="pr-4.5" nativeButton={false}>
                        <span className="text-nowrap">
                          {user ? 'Go to Dashboard' : 'Get Started'}
                        </span>
                        <ChevronRight className="opacity-50" />
                      </Button>
                    </Link>
                  </div>
                </div>

               <div className="mt-10 animate-in fade-in duration-900 delay-100">
  <Marquee items={logos} speed={5} size={36} />
</div>
              </div>
            </div>

            <div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0 animate-in fade-in zoom-in-95 duration-1000 delay-300">
              <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
                <div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">
                  <img
                    src={hero}
                    alt="app screen"
                    width="2880"
                    height="1842"
                    className="object-top-left size-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
