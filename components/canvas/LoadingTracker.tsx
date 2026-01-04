'use client';

import { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { useLoading } from '@/contexts/LoadingContext';

export default function LoadingTracker() {
  const { active, progress } = useProgress();
  const { setAssetsLoaded } = useLoading();

  useEffect(() => {
    if (!active && progress === 100) {
      setAssetsLoaded(true);
    }
  }, [active, progress, setAssetsLoaded]);

  return null;
}
