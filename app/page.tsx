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
  const [isMounted, setIsMounted] = useState(false);
  const [whitePageOpen, setWhitePageOpen] = useState(false);

  // Disable wheel zoom when white page is open to allow scrolling
  const { progress } = useWheelZoom(whitePageOpen);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Listen for white page open/close events
  useEffect(() => {
    const handleWhitePageOpen = () => setWhitePageOpen(true);
    const handleWhitePageClose = () => setWhitePageOpen(false);

    window.addEventListener('whitePageOpen' as any, handleWhitePageOpen);
    window.addEventListener('whitePageClose' as any, handleWhitePageClose);

    return () => {
      window.removeEventListener('whitePageOpen' as any, handleWhitePageOpen);
      window.removeEventListener('whitePageClose' as any, handleWhitePageClose);
    };
  }, []);

  // Listen for navigate to about event from footer
  useEffect(() => {
    const handleNavigateToAbout = () => {
      // Dispatch event to trigger zoom and planet click
      window.dispatchEvent(new CustomEvent('zoomToPlanetAndOpen'));
    };

    window.addEventListener('navigateToAbout' as any, handleNavigateToAbout);
    return () => window.removeEventListener('navigateToAbout' as any, handleNavigateToAbout);
  }, []);

  // Calculate scale based on zoom progress with easing
  // 0% = scale 1 (normal)
  // 100% = scale 10 (zoomed in 10x)
  // Apply ease-out curve for smoother acceleration
  const normalizedProgress = progress / 100;
  const easedProgress = 1 - Math.pow(1 - normalizedProgress, 3); // Cubic ease-out
  const scale = 1 + easedProgress * 9;

  // Calculate opacity - fade out as we zoom
  // Start fading at 10% progress, fully gone by 30%
  const opacity = progress < 10 ? 1 : Math.max(0, 1 - ((progress - 10) / 20));

  return (
    <>
      {/* Space background - FIXED, never zooms, always crisp - hide when white page open */}
      <div
        className="fixed inset-0 transition-opacity duration-800"
        style={{
          zIndex: 0,
          opacity: whitePageOpen ? 0 : 1,
          pointerEvents: whitePageOpen ? 'none' : 'auto',
        }}
      >
        <SpaceBackground />
      </div>

      {/* Main content that zooms - everything except footer/header/background - hide when white page open */}
      <div
        className="fixed inset-0 origin-center transition-opacity duration-800"
        style={{
          transform: isMounted ? `scale(${scale})` : 'scale(1)',
          transition: 'opacity 0.8s ease',
          pointerEvents: (opacity > 0 && !whitePageOpen) ? 'auto' : 'none',
          zIndex: 1,
          opacity: whitePageOpen ? 0 : 1,
        }}
      >
        <main
          className="relative h-screen w-screen"
          style={{
            animation: 'pageZoomOut 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            opacity,
          }}
        >
          {/* Half planet on right side */}
          <DecorativePlanet />

          {/* Hero content only */}
          <Hero />
        </main>
      </div>

      {/* 3D Scene Layer - Becomes visible as hero fades */}
      <Suspense fallback={null}>
        <Scene3D progress={progress} />
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
