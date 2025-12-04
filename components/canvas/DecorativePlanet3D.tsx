'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import AsteroidBelt from './AsteroidBelt';
import { DecorativePlanet3DConfig } from '@/types/planet';

export default function DecorativePlanet3D({
  position,
  scale,
  showMoon = false,
  showCrater = false,
  asteroidBelt,
  fadeStartDistance = 50,
  fadeRange = 20,
}: DecorativePlanet3DConfig) {
  const groupRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const planetRadius = scale / 2;

  const planetTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current || !planetMeshRef.current) return;

    const time = clock.getElapsedTime();

    groupRef.current.scale.setScalar(1);

    if (moonMeshRef.current && showMoon) {
      const moonOrbitSpeed = 0.785;
      const moonOrbitRadius = planetRadius * 0.35;
      moonMeshRef.current.position.x = Math.cos(time * moonOrbitSpeed) * moonOrbitRadius;
      moonMeshRef.current.position.z = Math.sin(time * moonOrbitSpeed) * moonOrbitRadius;
      moonMeshRef.current.position.y = Math.sin(time * moonOrbitSpeed * 0.5) * (planetRadius * 0.15);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[Math.PI * 0.15, Math.PI * 0.25, 0]}>
      <sprite scale={[planetRadius * 2.3, planetRadius * 4.0, 1]} renderOrder={0.8}>
        <spriteMaterial
          map={glowTexture}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      <mesh ref={planetMeshRef} renderOrder={1.0}>
        <sphereGeometry args={[planetRadius, 64, 64]} />
        <meshBasicMaterial
          map={planetTexture}
          color="#ffffff"
          toneMapped={false}
        />
      </mesh>

      {showMoon && (
        <mesh ref={moonMeshRef} renderOrder={1.5}>
          <sphereGeometry args={[scale * 0.01, 32, 32]} />
          <meshStandardMaterial
            color="#3a3a3a"
            emissive="#1a1a1a"
            emissiveIntensity={0.1}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      )}

      {asteroidBelt && (
        <group rotation={[0, 0, 0]}>
          <AsteroidBelt
            config={asteroidBelt}
            planetRadius={planetRadius}
            fadeStartDistance={fadeStartDistance}
            fadeRange={fadeRange}
            planetPosition={position}
          />
        </group>
      )}
    </group>
  );
}
