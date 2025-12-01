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
  const scanLineRef = useRef<THREE.Mesh>(null);
  const orbitalRing1Ref = useRef<THREE.Group>(null);
  const orbitalRing2Ref = useRef<THREE.Group>(null);
  const radarSweepRef = useRef<THREE.Mesh>(null);
  const pulseRing1Ref = useRef<THREE.Mesh>(null);
  const pulseRing2Ref = useRef<THREE.Mesh>(null);
  const hexGridRef = useRef<THREE.Group>(null);

  const cornerBrackets = useMemo(() => {
    const brackets: THREE.BufferGeometry[] = [];
    const radius = planetRadius * 1.35;
    const bracketSize = 0.35;
    const thickness = 0.025;

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(bracketSize, 0);
      shape.lineTo(bracketSize, thickness);
      shape.lineTo(thickness, thickness);
      shape.lineTo(thickness, bracketSize);
      shape.lineTo(0, bracketSize);
      shape.lineTo(0, 0);

      const geometry = new THREE.ShapeGeometry(shape);
      geometry.translate(x - thickness / 2, y - thickness / 2, 0);
      geometry.rotateZ(angle);

      brackets.push(geometry);
    }

    return brackets;
  }, [planetRadius]);

  const crosshairGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const radius = planetRadius * 1.3;
    const innerRadius = planetRadius * 1.15;
    const gap = 0.1;

    [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((angle) => {
      const x1 = Math.cos(angle) * innerRadius;
      const y1 = Math.sin(angle) * innerRadius;
      const x2 = Math.cos(angle) * (innerRadius + gap);
      const y2 = Math.sin(angle) * (innerRadius + gap);
      const x3 = Math.cos(angle) * radius;
      const y3 = Math.sin(angle) * radius;

      points.push(new THREE.Vector3(x1, y1, 0));
      points.push(new THREE.Vector3(x2, y2, 0));

      points.push(new THREE.Vector3(x2, y2, 0));
      points.push(new THREE.Vector3(x3, y3, 0));
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [planetRadius]);

  const ringGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(
      planetRadius * 1.25,
      planetRadius * 1.27,
      64
    );
    return geometry;
  }, [planetRadius]);

  const orbitalRingGeometry = useMemo(() => {
    const geometry = new THREE.TorusGeometry(planetRadius * 1.2, 0.025, 8, 64);
    return geometry;
  }, [planetRadius]);

  const scanLineGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(planetRadius * 2.5, 0.015);
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

  const tickMarksGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const radius = planetRadius * 1.27;
    const tickLength = 0.08;

    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle) * (radius + tickLength);
      const y2 = Math.sin(angle) * (radius + tickLength);

      points.push(new THREE.Vector3(x1, y1, 0));
      points.push(new THREE.Vector3(x2, y2, 0));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [planetRadius]);

  const scanDotsGeometry = useMemo(() => {
    const positions: number[] = [];
    const radius = planetRadius * 1.2;

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      positions.push(x, y, 0);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [planetRadius]);

  const arcSegmentsGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const radius = planetRadius * 1.18;
    const segments = 8;
    const arcLength = Math.PI / 6;
    const gap = Math.PI / 12;

    for (let i = 0; i < segments; i++) {
      const startAngle = i * (arcLength + gap);
      const endAngle = startAngle + arcLength;

      for (let a = startAngle; a <= endAngle; a += 0.1) {
        points.push(new THREE.Vector3(
          Math.cos(a) * radius,
          Math.sin(a) * radius,
          0
        ));
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [planetRadius]);

  const hexGridGeometry = useMemo(() => {
    const hexSize = 0.15;
    const gridRadius = planetRadius * 1.22;
    const hexagons: THREE.Vector3[] = [];

    const createHexagon = (cx: number, cy: number, size: number) => {
      const hex: THREE.Vector3[] = [];
      for (let i = 0; i <= 6; i++) {
        const angle = (Math.PI / 3) * i;
        hex.push(new THREE.Vector3(
          cx + size * Math.cos(angle),
          cy + size * Math.sin(angle),
          0
        ));
      }
      return hex;
    };

    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const x = Math.cos(angle) * gridRadius;
      const y = Math.sin(angle) * gridRadius;
      hexagons.push(...createHexagon(x, y, hexSize));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(hexagons);
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
