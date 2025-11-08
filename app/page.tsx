'use client';

import Hero from '@/components/ui/Hero';
import DecorativePlanet from '@/components/ui/DecorativePlanet';
import SpaceBackground from '@/components/canvas/SpaceBackground';

export default function Home() {
  return (
    <main className="relative">
      {/* Space background with stars and nebulae */}
      <SpaceBackground />

      {/* Half planet on right side */}
      <DecorativePlanet />

      {/* Hero content only */}
      <Hero />
    </main>
  );
}
