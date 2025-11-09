'use client';

import Hero from '@/components/ui/Hero';
import DecorativePlanet from '@/components/ui/DecorativePlanet';
import SpaceBackground from '@/components/canvas/SpaceBackground';

export default function Home() {
  return (
    <main
      className="relative"
      style={{
        animation: 'pageZoomOut 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      {/* Space background with stars and nebulae */}
      <SpaceBackground />

      {/* Half planet on right side */}
      <DecorativePlanet />

      {/* Hero content only */}
      <Hero />
    </main>
  );
}
