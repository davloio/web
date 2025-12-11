'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleNetworkProps {
  planetRadius: number;
  planetScale?: number;
  particleCount?: number;
  layerHeight?: number;
  connectionDistance?: number;
  particleColor?: string;
  lineColor?: string;
  particleSize?: number;
  opacity?: number;
  rotationSpeed?: number;
}

export default function ParticleNetwork({
  planetRadius,
  planetScale = 1,
  particleCount = 100,
  layerHeight = 1.15,
  connectionDistance = 0.35,
  particleColor = '#ffffff',
  lineColor = '#ffffff',
  particleSize = 0.04,
  opacity = 0.7,
  rotationSpeed = 0.0003,
}: ParticleNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);

  const { positions, particlePositions } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const particlePositions: THREE.Vector3[] = [];

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const radius = planetRadius * layerHeight;

    for (let i = 0; i < particleCount; i++) {
      const theta = seededRandom(i * 2.5) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i * 3.7) - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      particlePositions.push(new THREE.Vector3(x, y, z));
    }

    return { positions, particlePositions };
  }, [particleCount, planetRadius, layerHeight]);

  const linePositions = useMemo(() => {
    const lines: number[] = [];

    for (let i = 0; i < particlePositions.length; i++) {
      for (let j = i + 1; j < particlePositions.length; j++) {
        const distance = particlePositions[i].distanceTo(particlePositions[j]);

        if (distance < connectionDistance * planetRadius) {
          lines.push(
            particlePositions[i].x, particlePositions[i].y, particlePositions[i].z,
            particlePositions[j].x, particlePositions[j].y, particlePositions[j].z
          );
        }
      }
    }

    return new Float32Array(lines);
  }, [particlePositions, connectionDistance, planetRadius]);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  const pointsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);

  const linesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return geometry;
  }, [linePositions]);

  return (
    <group ref={groupRef} scale={planetScale}>
      <points geometry={pointsGeometry} renderOrder={0.5}>
        <pointsMaterial
          size={particleSize}
          color={particleColor}
          transparent={true}
          opacity={opacity}
          map={particleTexture}
          depthWrite={false}
          depthTest={true}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments geometry={linesGeometry} renderOrder={0.5}>
        <lineBasicMaterial
          color={lineColor}
          transparent={true}
          opacity={opacity * 0.65}
          depthWrite={false}
          depthTest={true}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
