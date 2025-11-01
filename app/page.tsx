'use client';

import Hero from '@/components/ui/Hero';
import PlanetSection from '@/components/ui/PlanetSection';

export default function Home() {
  return (
    <main className="relative">
      {/* Scrollable content */}
      <div className="relative">
        <Hero />

        {/* Planet sections will go here */}
        <PlanetSection
          id="planet-1"
          title="Project Alpha"
          description="Your first blockchain explorer project"
          planetColor="#8B5CF6"
        />

        <PlanetSection
          id="planet-2"
          title="Project Beta"
          description="Next generation blockchain software"
          planetColor="#3B82F6"
        />

        <PlanetSection
          id="planet-3"
          title="Project Gamma"
          description="Software for the Universe"
          planetColor="#EC4899"
        />

        {/* Footer */}
        <footer className="relative min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold">
              Ready to explore?
            </h2>
            <p className="text-xl text-white/60">
              Get in touch with the davlo.io team
            </p>
            <div className="flex gap-6 justify-center mt-8">
              <a
                href="mailto:hello@davlo.io"
                className="px-8 py-3 border border-white/20 hover:border-space-purple transition-colors"
                data-cursor-hover
              >
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
