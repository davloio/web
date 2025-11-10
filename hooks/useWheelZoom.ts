'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

// CRITICAL: Global flag for IMMEDIATE synchronous blocking
// Set by whitePageOpen event BEFORE React state updates
let globalWheelLocked = false;

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
 * IMPORTANT: This completely prevents page scrolling when enabled
 * @param disabled - When true, wheel zoom is disabled and normal scrolling works
 */
export function useWheelZoom(disabled: boolean = false): WheelZoomState {
  const [progress, setProgressState] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZooming, setIsZooming] = useState(false);

  // Store progress in a ref so it persists when disabled
  const progressRef = useRef(0);
  const savedProgressRef = useRef(0);

  // Wrapper around setProgress that respects global lock
  // DON'T use useCallback - it would capture stale globalWheelLocked value
  const setProgress = (value: number | ((prev: number) => number)) => {
    // Check global flag DIRECTLY (not via closure) - always gets current value
    if (globalWheelLocked) {
      console.log('[useWheelZoom] BLOCKED progress update - global lock active');
      return;
    }
    setProgressState(value);
  };

  // Update ref whenever progress changes (only when not disabled)
  useEffect(() => {
    if (!disabled) {
      progressRef.current = progress;
    }
  }, [progress, disabled]);

  // Lock progress when modal opens, restore when it closes
  const lockedProgressRef = useRef<number | null>(null);
  const isLockedRef = useRef(false);

  useEffect(() => {
    if (disabled) {
      // Modal opening - lock current progress IMMEDIATELY
      if (!isLockedRef.current) {
        lockedProgressRef.current = progress;
        isLockedRef.current = true;
        console.log('[useWheelZoom] LOCKING progress at:', progress);
      }
    } else {
      // Modal closing - restore locked progress if it exists
      if (lockedProgressRef.current !== null && isLockedRef.current) {
        console.log('[useWheelZoom] RESTORING progress from:', progress, 'to:', lockedProgressRef.current);
        setProgress(lockedProgressRef.current);
        lockedProgressRef.current = null;
        isLockedRef.current = false;
      }
    }
  }, [disabled, progress]);

  // Listen for programmatic zoom changes (e.g., from footer about link)
  useEffect(() => {
    const handleSetZoomProgress = (e: CustomEvent) => {
      const targetProgress = e.detail.progress;
      setProgress(targetProgress);
    };

    window.addEventListener('setZoomProgress' as any, handleSetZoomProgress);
    return () => window.removeEventListener('setZoomProgress' as any, handleSetZoomProgress);
  }, []);

  // CRITICAL: Listen for whitePageOpen/Close events to set global lock IMMEDIATELY
  useEffect(() => {
    const handleWhitePageOpen = () => {
      globalWheelLocked = true;
      console.log('[useWheelZoom] GLOBAL LOCK SET - Wheel completely blocked');
    };

    const handleWhitePageClose = () => {
      globalWheelLocked = false;
      console.log('[useWheelZoom] GLOBAL LOCK CLEARED - Wheel enabled');
    };

    window.addEventListener('whitePageOpen' as any, handleWhitePageOpen);
    window.addEventListener('whitePageClose' as any, handleWhitePageClose);

    return () => {
      window.removeEventListener('whitePageOpen' as any, handleWhitePageOpen);
      window.removeEventListener('whitePageClose' as any, handleWhitePageClose);
    };
  }, []);

  // Use ref to store the current disabled state so event handlers can access it
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  useEffect(() => {
    // Single wheel handler that checks disabled state
    const handleWheel = (e: WheelEvent) => {
      // CRITICAL: Multiple safety checks to prevent modal scroll from affecting zoom

      // 0. FIRST: Check GLOBAL lock (set immediately by whitePageOpen event)
      if (globalWheelLocked) {
        console.log('[useWheelZoom] GLOBAL LOCK - Wheel blocked');
        return; // Completely blocked, don't process anything
      }

      // 1. Check DOM for modal (most reliable, no state delays)
      const modalElement = document.querySelector('[data-modal-container]');
      if (modalElement) {
        console.log('[useWheelZoom] Modal detected in DOM - BLOCKING zoom update');
        return; // Modal exists, allow it to scroll
      }

      // 2. Check if disabled via prop (modal state)
      if (disabledRef.current) {
        console.log('[useWheelZoom] Disabled flag is true - BLOCKING zoom update');
        return; // Modal is open - DO NOT prevent default to allow modal scrolling
      }

      // 3. Check if event is coming from modal container
      const target = e.target as HTMLElement;
      if (target?.closest('[data-modal-container]')) {
        console.log('[useWheelZoom] Event from modal container - BLOCKING zoom update');
        return; // Allow modal to scroll normally
      }

      // Only prevent default and process zoom if NOT in modal
      // Prevent default scroll behavior
      e.preventDefault();
      e.stopPropagation();

      // Determine direction
      const wheelDirection = e.deltaY > 0 ? 1 : -1;
      setDirection(wheelDirection);
      setIsZooming(true);

      // Update progress ONLY if not disabled
      if (!disabledRef.current) {
        const sensitivity = 0.08;
        setProgress((prev) => {
          const newProgress = prev + (e.deltaY * sensitivity);
          console.log('[useWheelZoom] Progress update:', prev, '->', newProgress);
          return Math.max(0, Math.min(100, newProgress));
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (disabledRef.current) return;
      e.preventDefault();
    };

    // Add listeners ONCE
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Cleanup ONCE on unmount
    return () => {
      window.removeEventListener('wheel', handleWheel, { passive: false, capture: true } as any);
      window.removeEventListener('touchmove', handleTouchMove, { passive: false } as any);
    };
  }, []); // Empty deps - run once on mount

  // Separate effect for body styles based on disabled state
  useEffect(() => {
    if (disabled) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = 'hidden'; // Still hidden for zoom control
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [disabled]);

  // Debounce isZooming
  useEffect(() => {
    if (isZooming) {
      const timeout = setTimeout(() => setIsZooming(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isZooming]);

  return { progress, direction, isZooming };
}
