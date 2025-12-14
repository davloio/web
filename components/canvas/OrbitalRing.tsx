'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitalRingProps {
  radius: number;
  color: string;
  center: readonly [number, number, number];
  opacity?: number;
  progress: number;
}

export default function OrbitalRing({
  radius,
  color,
  center,
  opacity = 0.3,
  progress,
}: OrbitalRingProps) {
  const geometry = useMemo(() => {
    const segments = 128;
    const points: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      points.push(new THREE.Vector3(x, 0, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [radius]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
    });
  }, [color]);

  const fadeOpacity = useMemo(() => {
    if (progress < 220) return 0;
    if (progress >= 230) return opacity;
    return ((progress - 220) / 10) * opacity;
  }, [progress, opacity]);

  const line = useMemo(() => {
    const line = new THREE.Line(geometry, material);
    line.position.set(center[0], center[1], center[2]);
    line.renderOrder = 0.3;
    return line;
  }, [geometry, material, center]);

  if (material) {
    material.opacity = fadeOpacity;
  }

  return <primitive object={line} />;
}
