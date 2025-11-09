'use client';

import { useEffect, useState } from 'react';

export interface ScrollProgress {
  /** Scroll progress as percentage (0-100) */
  progress: number;
  /** Raw scroll position in pixels */
  scrollY: number;
  /** Total scrollable height */
  scrollHeight: number;
  /** Viewport height */
  viewportHeight: number;
  /** Scroll direction: 1 for down, -1 for up, 0 for no scroll */
  direction: number;
}

/**
 * Hook to track scroll progress with smooth updates
 * Returns scroll percentage (0-100) and additional scroll metrics
 */
export function useScrollProgress(): ScrollProgress {
  const [scrollData, setScrollData] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    scrollHeight: 0,
    viewportHeight: 0,
    direction: 0,
  });

  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    let lastScrollY = 0;

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight - viewportHeight;

      // Calculate progress (0-100)
      const progress = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;

      // Calculate direction
      const direction = scrollY > lastScrollY ? 1 : scrollY < lastScrollY ? -1 : 0;
      lastScrollY = scrollY;

      setScrollData({
        progress,
        scrollY,
        scrollHeight: scrollHeight + viewportHeight,
        viewportHeight,
        direction,
      });

      setPrevScrollY(scrollY);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    // Initial calculation
    updateScrollProgress();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return scrollData;
}
