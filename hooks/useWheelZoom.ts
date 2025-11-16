'use client';

import { useEffect, useState, useRef } from 'react';

export interface WheelZoomState {
  progress: number;
  direction: number;
  isZooming: boolean;
}

export let globalWheelDisabled = false;

export function setGlobalWheelDisabled(disabled: boolean) {
  globalWheelDisabled = disabled;
}

export function useWheelZoom(disabled: boolean = false): WheelZoomState {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZooming, setIsZooming] = useState(false);

  const savedProgressRef = useRef<number | null>(null);

  useEffect(() => {
    if (disabled && savedProgressRef.current === null) {
      savedProgressRef.current = progress;
    } else if (!disabled && savedProgressRef.current !== null) {
      setProgress(savedProgressRef.current);
      savedProgressRef.current = null;
    }
  }, [disabled]);

  useEffect(() => {
    const handleSetZoomProgress = (e: CustomEvent) => {
      setProgress(e.detail.progress);
    };
    window.addEventListener('setZoomProgress' as any, handleSetZoomProgress);
    return () => window.removeEventListener('setZoomProgress' as any, handleSetZoomProgress);
  }, []);

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (globalWheelDisabled) {
        return;
      }

      if (disabledRef.current) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const wheelDirection = e.deltaY > 0 ? 1 : -1;
      setDirection(wheelDirection);
      setIsZooming(true);

      const sensitivity = 0.08;
      setProgress((prev) => {
        const newProgress = prev + (e.deltaY * sensitivity);
        return Math.max(0, Math.min(100, newProgress));
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (disabledRef.current) return;
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel, { passive: false, capture: true } as any);
      window.removeEventListener('touchmove', handleTouchMove, { passive: false } as any);
    };
  }, []);

  useEffect(() => {
    if (isZooming) {
      const timeout = setTimeout(() => setIsZooming(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isZooming]);

  return { progress, direction, isZooming };
}
