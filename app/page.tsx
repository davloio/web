'use client';

import Hero from '@/components/ui/Hero';
import DecorativePlanet from '@/components/ui/DecorativePlanet';

export default function Home() {
  return (
    <main className="relative">
      {/* Half planet on right side */}
      <DecorativePlanet />

      {/* Hero content only */}
      <Hero />
    </main>
  );
}
