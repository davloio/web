'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PlanetSectionProps {
  id: string;
  title: string;
  description: string;
  planetColor: string;
}

export default function PlanetSection({
  id,
  title,
  description,
  planetColor,
}: PlanetSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const section = sectionRef.current;
    const content = contentRef.current;

    // Create ScrollTrigger animation
    const ctx = gsap.context(() => {
      // Fade in animation
      gsap.fromTo(
        content,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'center center',
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      <div ref={contentRef} className="text-center max-w-4xl">
        {/* Planet preview circle (placeholder) */}
        <div
          className="w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto mb-12 animate-pulse"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${planetColor}, ${planetColor}00)`,
            boxShadow: `0 0 100px ${planetColor}80`,
          }}
        />

        <h2 className="text-5xl md:text-7xl font-bold mb-6">{title}</h2>
        <p className="text-xl md:text-2xl text-white/70">{description}</p>

        {/* Placeholder for more content */}
        <div className="mt-12 space-y-4 text-white/50">
          <p>🚀 Feature One - Coming soon</p>
          <p>⚡ Feature Two - Coming soon</p>
          <p>🌟 Feature Three - Coming soon</p>
        </div>

        <button
          className="mt-12 px-8 py-3 border border-white/20 hover:border-white/60 transition-colors"
          data-cursor-hover
        >
          Learn More
        </button>
      </div>
    </section>
  );
}
