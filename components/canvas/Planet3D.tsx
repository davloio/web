'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, CanvasTexture } from 'three';
import { Planet3DProps } from '@/types/planet';

/**
 * Reusable 3D Planet Component
 *
 * Features:
 * - High-quality sphere geometry
 * - CSS box-shadow style glow using sprite
 * - Smooth rotation on Y-axis
 * - Smooth hover glow transitions
 * - Click detection ready
 */
export default function Planet3D({
  position,
  scale = 1,
  color,
  emissive = color,
  emissiveIntensity = 0.3,
  name,
  roughness = 0.9,
  metalness = 0.1,
  onClick,
  onHover,
}: Planet3DProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<any>(null);
  const glowSpriteRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [currentGlow, setCurrentGlow] = useState(emissiveIntensity);

  // Create radial gradient texture for glow (like CSS box-shadow blur)
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Create radial gradient from center
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    return new CanvasTexture(canvas);
  }, []);

  // Rotate planet on its axis - faster for visible rotation
  useFrame(({ camera }) => {
    if (meshRef.current) {
      // More visible rotation speed
      meshRef.current.rotation.y += 0.005;
    }

    // Smooth glow transition
    if (materialRef.current) {
      const targetGlow = hovered ? emissiveIntensity * 2 : emissiveIntensity;
      const newGlow = currentGlow + (targetGlow - currentGlow) * 0.1;
      setCurrentGlow(newGlow);
      materialRef.current.emissiveIntensity = newGlow;
    }

    // Make glow sprite always face camera
    if (glowSpriteRef.current) {
      glowSpriteRef.current.quaternion.copy(camera.quaternion);
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover?.(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover?.(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <group position={position} scale={scale}>
      {/* Glow sprite behind planet (CSS box-shadow effect) */}
      <sprite ref={glowSpriteRef} scale={[4.5, 4.5, 1]} renderOrder={-1}>
        <spriteMaterial
          map={glowTexture}
          transparent={true}
          opacity={1.0}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      {/* Main Planet */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Slightly lower poly for subtle faceted look (32 segments - very subtle low-poly) */}
        <sphereGeometry args={[1, 32, 32]} />

        {/* Standard material */}
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={emissive}
          emissiveIntensity={currentGlow}
          roughness={roughness}
          metalness={metalness}
        />
      </mesh>
    </group>
  );
}
