'use client';

import { useEffect, useState, useCallback } from 'react';

export interface WheelZoomState {
  /** Zoom progress as percentage (0-100) */
  progress: number;
  /** Zoom direction: 1 for zoom in (scroll down), -1 for zoom out (scroll up) */
  direction: number;
  /** Is currently zooming (debounced) */
  isZooming: boolean;
}

/**
 * Hook to track wheel events and convert them to zoom progress
 * Wheel down = zoom in (increase progress)
 * Wheel up = zoom out (decrease progress)
 * Progress is clamped between 0-100
 *
 * IMPORTANT: This completely prevents page scrolling
 */
export function useWheelZoom(): WheelZoomState {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    // Disable Lenis smooth scroll if it exists
    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.stop();
    }

    // Prevent all scrolling on body
    document.body.style.overflow = 'hidden';

    const handleWheel = (e: WheelEvent) => {
      // Prevent default scroll behavior
      e.preventDefault();
      e.stopPropagation();

      // Determine direction
      const wheelDirection = e.deltaY > 0 ? 1 : -1;
      setDirection(wheelDirection);
      setIsZooming(true);

      // Update progress
      // Sensitivity: 1 wheel unit = 0.05% progress (adjust for feel)
      const sensitivity = 0.05;
      setProgress((prev) => {
        const newProgress = prev + (e.deltaY * sensitivity);
        // Clamp between 0 and 100
        return Math.max(0, Math.min(100, newProgress));
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Also prevent touch scrolling
      e.preventDefault();
    };

    // Add listeners with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Prevent scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove);

      // Restore scrolling on cleanup
      document.body.style.overflow = '';

      // Re-enable Lenis if it exists
      if (typeof window !== 'undefined' && (window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, []);

  // Debounce isZooming
  useEffect(() => {
    if (isZooming) {
      const timeout = setTimeout(() => setIsZooming(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isZooming]);

  return { progress, direction, isZooming };
}
