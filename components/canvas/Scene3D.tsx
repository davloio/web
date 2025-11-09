'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import { useWheelZoom } from '@/hooks/useWheelZoom';
import { getScrollZone } from '@/utils/scrollZones';
import * as THREE from 'three';
import Planet3D from './Planet3D';

/**
 * Camera controller that moves based on wheel zoom
 */
function CameraController() {
  const { progress } = useWheelZoom();
  const { camera } = useThree();
  const currentZone = getScrollZone(progress);

  // Debug: Log zoom progress and zone
  useEffect(() => {
    console.log(`Zoom: ${progress.toFixed(1)}% | Zone: ${currentZone}`);
  }, [progress, currentZone]);

  useFrame(() => {
    // Planet is at origin [0, 0, 0]
    // Camera tilts from looking left/up to looking at center as it zooms
    const normalizedProgress = progress / 100;

    // Camera moves forward in Z only
    const startZ = 50;
    const endZ = 8; // Closer to planet for bigger zoom
    camera.position.set(0, 0, startZ - (startZ - endZ) * normalizedProgress);

    // Interpolate camera lookAt target
    // Start: looking right and down (10, -10, 0) -> planet appears left and up
    // End: looking at center (0, 0, 0) -> planet centered
    const lookAtX = 10 - (10 * normalizedProgress);  // 10 -> 0
    const lookAtY = -10 + (10 * normalizedProgress); // -10 -> 0
    const lookAtZ = 0;

    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  });

  return null;
}

/**
 * Main 3D scene component using React Three Fiber
 * Handles camera, lighting, and all 3D planet elements
 * Wheel scrolling zooms the camera instead of scrolling the page
 */
export default function Scene3D() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-auto" style={{ zIndex: 2 }}>
      <Canvas
        camera={{
          position: [0, 0, 50],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        dpr={[1, 2]} // Responsive pixel ratio
      >
        <Suspense fallback={null}>
          {/* Camera controller for wheel zoom */}
          <CameraController />

          {/* Ambient light for overall illumination */}
          <ambientLight intensity={0.3} />

          {/* Main directional light (sun-like) */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
          />

          {/* Fill light from opposite side */}
          <directionalLight
            position={[-10, -10, -5]}
            intensity={0.3}
          />

          {/* Point light for planet highlights */}
          <pointLight
            position={[0, 5, 10]}
            intensity={0.5}
            color="#ffffff"
          />

          {/* Test Planet - White Planet (davlo.io) */}
          <Planet3D
            position={[0, 0, 0]}
            scale={4}
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
            name="davlo.io"
            roughness={0.7}
            metalness={0.1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
