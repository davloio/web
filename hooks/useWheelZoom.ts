'use client';

import { useEffect, useState, useRef } from 'react';

export interface WheelZoomState {
  /** Zoom progress as percentage (0-100) */
  progress: number;
  /** Zoom direction: 1 for zoom in (scroll down), -1 for zoom out (scroll up) */
  direction: number;
  /** Is currently zooming (debounced) */
  isZooming: boolean;
}

// CRITICAL: Global synchronous lock to prevent race conditions
// This is set IMMEDIATELY when planet is clicked, before any React state updates
// This prevents wheel events from firing during the transition period
export let globalWheelDisabled = false;

export function setGlobalWheelDisabled(disabled: boolean) {
  globalWheelDisabled = disabled;
}

/**
 * Hook to track wheel events and convert them to zoom progress
 * @param disabled - When true, wheel zoom is disabled and normal scrolling works
 */
export function useWheelZoom(disabled: boolean = false): WheelZoomState {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZooming, setIsZooming] = useState(false);

  // Simple: Save progress when disabled (modal open), restore when enabled (modal close)
  const savedProgressRef = useRef<number | null>(null);

  useEffect(() => {
    if (disabled && savedProgressRef.current === null) {
      // Modal just opened - save current progress
      savedProgressRef.current = progress;
    } else if (!disabled && savedProgressRef.current !== null) {
      // Modal just closed - restore saved progress
      setProgress(savedProgressRef.current);
      savedProgressRef.current = null;
    }
  }, [disabled]);

  // Listen for programmatic zoom changes
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
      // Check global lock first
      if (globalWheelDisabled) {
        return;
      }

      // If modal is open, don't process zoom
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

  // Note: Body scroll locking is now handled by DetailModal for better control
  // This hook only manages wheel event listening

  useEffect(() => {
    if (isZooming) {
      const timeout = setTimeout(() => setIsZooming(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isZooming]);

  return { progress, direction, isZooming };
}
