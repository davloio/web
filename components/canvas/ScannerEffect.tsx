'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ScannerEffectProps {
  planetRadius: number;
  planetScale?: number;
  color?: string;
  opacity?: number;
  rotationSpeed?: number;
}

export default function ScannerEffect({
  planetRadius,
  planetScale = 1,
  color = '#DB7093',
  opacity = 0.8,
  rotationSpeed = 0.0005,
}: ScannerEffectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const orbitalRing1Ref = useRef<THREE.Group>(null);
  const orbitalRing2Ref = useRef<THREE.Group>(null);
  const radarSweepRef = useRef<THREE.Mesh>(null);
  const pulseRing1Ref = useRef<THREE.Mesh>(null);
  const pulseRing2Ref = useRef<THREE.Mesh>(null);

  const orbitalRingGeometry = useMemo(() => {
    const geometry = new THREE.TorusGeometry(planetRadius * 1.2, 0.025, 8, 64);
    return geometry;
  }, [planetRadius]);

  const radarSweepGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const radius = planetRadius * 1.35;
    shape.moveTo(0, 0);
    shape.arc(0, 0, radius, 0, Math.PI / 3, false);
    shape.lineTo(0, 0);
    const geometry = new THREE.ShapeGeometry(shape);
    return geometry;
  }, [planetRadius]);

  const pulseRingGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(
      planetRadius * 1.1,
      planetRadius * 1.14,
      64
    );
    return geometry;
  }, [planetRadius]);

  const dataNodesGeometry = useMemo(() => {
    const positions: number[] = [];
    const angles = [30, 80, 150, 200, 280, 330];

    angles.forEach(deg => {
      const angle = (deg * Math.PI) / 180;
      const radius = planetRadius * 1.32;
      positions.push(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      );
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [planetRadius]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const pulse = Math.sin(time * 2) * 0.5 + 0.5;

    if (groupRef.current) {
      groupRef.current.rotation.z += rotationSpeed;
    }
    if (orbitalRing1Ref.current) {
      orbitalRing1Ref.current.rotation.x = Math.PI / 4;
      orbitalRing1Ref.current.rotation.y += 0.002;
    }
    if (orbitalRing2Ref.current) {
      orbitalRing2Ref.current.rotation.x = -Math.PI / 4;
      orbitalRing2Ref.current.rotation.y -= 0.0015;
    }
    if (radarSweepRef.current) {
      radarSweepRef.current.rotation.z = time * 0.8;
    }
    if (pulseRing1Ref.current) {
      const scale = 1 + pulse * 0.15;
      pulseRing1Ref.current.scale.set(scale, scale, 1);
      (pulseRing1Ref.current.material as THREE.Material).opacity = opacity * (0.3 + pulse * 0.2);
    }
    if (pulseRing2Ref.current) {
      const scale = 1 + (1 - pulse) * 0.15;
      pulseRing2Ref.current.scale.set(scale, scale, 1);
      (pulseRing2Ref.current.material as THREE.Material).opacity = opacity * (0.3 + (1 - pulse) * 0.2);
    }
  });

  return (
    <group scale={planetScale}>
      <group ref={groupRef}>
      </group>

      <group ref={orbitalRing1Ref}>
        <mesh geometry={orbitalRingGeometry} renderOrder={1.5}>
          <meshBasicMaterial
            color={color}
            transparent={true}
            opacity={opacity * 0.3}
            depthWrite={false}
          />
        </mesh>
      </group>

      <group ref={orbitalRing2Ref}>
        <mesh geometry={orbitalRingGeometry} renderOrder={1.5}>
          <meshBasicMaterial
            color={color}
            transparent={true}
            opacity={opacity * 0.25}
            depthWrite={false}
          />
        </mesh>
      </group>

      <mesh ref={radarSweepRef} geometry={radarSweepGeometry} renderOrder={1.5}>
        <meshBasicMaterial
          color={color}
          transparent={true}
          opacity={opacity * 0.15}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={pulseRing1Ref} geometry={pulseRingGeometry} renderOrder={1.5}>
        <meshBasicMaterial
          color={color}
          transparent={true}
          opacity={opacity * 0.3}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={pulseRing2Ref} geometry={pulseRingGeometry} renderOrder={1.5}>
        <meshBasicMaterial
          color={color}
          transparent={true}
          opacity={opacity * 0.3}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <points geometry={dataNodesGeometry} renderOrder={1.5}>
        <pointsMaterial
          color={color}
          size={0.12}
          transparent={true}
          opacity={opacity}
          depthWrite={false}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
