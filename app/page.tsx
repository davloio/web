'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import Hero, { HeroHeader } from '@/components/ui/Hero';
import DecorativePlanet from '@/components/ui/DecorativePlanet';
import SpaceBackground from '@/components/canvas/SpaceBackground';
import Footer from '@/components/ui/Footer';
import { useWheelZoom } from '@/hooks/useWheelZoom';
const Scene3D = lazy(() => import('@/components/canvas/Scene3D'));

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [whitePageOpen, setWhitePageOpen] = useState(false);
  const { progress } = useWheelZoom(whitePageOpen);

  useEffect(() => {
    setIsMounted(true);
  }, []);
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
  useEffect(() => {
    const handleNavigateToAbout = () => {

      window.dispatchEvent(new CustomEvent('zoomToPlanetAndOpen'));
    };

    window.addEventListener('navigateToAbout' as any, handleNavigateToAbout);
    return () => window.removeEventListener('navigateToAbout' as any, handleNavigateToAbout);
  }, []);

  const normalizedProgress = progress / 100;
  const easedProgress = 1 - Math.pow(1 - normalizedProgress, 3);
  const scale = 1 + easedProgress * 9;

  const opacity = progress < 10 ? 1 : Math.max(0, 1 - ((progress - 10) / 20));

  return (
    <>
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
          <DecorativePlanet />

          <Hero />
        </main>
      </div>

      <Suspense fallback={null}>
        <Scene3D progress={progress} />
      </Suspense>

      <div className="footer-container fixed bottom-0 left-0 z-[100]">
        <Footer />
      </div>

      <HeroHeader />

    </>
  );
}
