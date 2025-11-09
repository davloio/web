'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import Hero, { HeroHeader } from '@/components/ui/Hero';
import DecorativePlanet from '@/components/ui/DecorativePlanet';
import SpaceBackground from '@/components/canvas/SpaceBackground';
import Footer from '@/components/ui/Footer';
import { useWheelZoom } from '@/hooks/useWheelZoom';

// Lazy load 3D scene for better initial page load
const Scene3D = lazy(() => import('@/components/canvas/Scene3D'));

export default function Home() {
  const { progress } = useWheelZoom();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate scale based on zoom progress
  // 0% = scale 1 (normal)
  // 100% = scale 10 (zoomed in 10x)
  const scale = 1 + (progress / 100) * 9;

  // Calculate opacity - fade out as we zoom
  // Start fading at 10% progress, fully gone by 30%
  const opacity = progress < 10 ? 1 : Math.max(0, 1 - ((progress - 10) / 20));

  return (
    <>
      {/* Main content that zooms - everything except footer/header */}
      <div
        className="fixed inset-0 origin-center"
        style={{
          transform: isMounted ? `scale(${scale})` : 'scale(1)',
          transition: 'none', // Smooth via transform updates
          pointerEvents: opacity > 0 ? 'auto' : 'none',
        }}
      >
        <main
          className="relative h-screen w-screen"
          style={{
            animation: 'pageZoomOut 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            opacity,
          }}
        >
          {/* Space background with stars and nebulae */}
          <SpaceBackground />

          {/* Half planet on right side */}
          <DecorativePlanet />

          {/* Hero content only */}
          <Hero />
        </main>
      </div>

      {/* 3D Scene Layer - Becomes visible as hero fades */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      {/* Footer - ALWAYS visible, never scales */}
      <div className="fixed bottom-0 left-0 z-[100] p-6">
        <Footer />
      </div>

      {/* Header - ALWAYS visible, never scales (controlled by Hero's event) */}
      <HeroHeader />

    </>
  );
}
