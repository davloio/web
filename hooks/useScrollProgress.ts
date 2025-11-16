'use client';

import { useEffect, useState } from 'react';

export interface ScrollProgress {
  progress: number;
  scrollY: number;
  scrollHeight: number;
  viewportHeight: number;
  direction: number;
}

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

      const progress = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;

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

    updateScrollProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  return scrollData;
}
