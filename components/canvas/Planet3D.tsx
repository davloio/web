'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
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
  disableHover = false,
}: Planet3DProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<any>(null);
  const glowSpriteRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [currentGlow, setCurrentGlow] = useState(emissiveIntensity);
  const [currentGlowScale, setCurrentGlowScale] = useState(1);
  const [currentGlowOpacity, setCurrentGlowOpacity] = useState(0.7);

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

    // Smooth glow transition - disabled when disableHover is true
    if (materialRef.current && !disableHover) {
      const targetGlow = hovered ? emissiveIntensity * 2 : emissiveIntensity;
      const newGlow = currentGlow + (targetGlow - currentGlow) * 0.1;
      setCurrentGlow(newGlow);
      materialRef.current.emissiveIntensity = newGlow;
    }

    // Animate glow sprite on hover
    if (glowSpriteRef.current) {
      // Make sprite always face camera
      glowSpriteRef.current.quaternion.copy(camera.quaternion);

      // Animate glow size and opacity on hover
      if (!disableHover) {
        const targetGlowScale = hovered ? 1.15 : 1;
        const targetGlowOpacity = hovered ? 1.1 : 0.7;

        const newGlowScale = currentGlowScale + (targetGlowScale - currentGlowScale) * 0.1;
        const newGlowOpacity = currentGlowOpacity + (targetGlowOpacity - currentGlowOpacity) * 0.1;

        setCurrentGlowScale(newGlowScale);
        setCurrentGlowOpacity(newGlowOpacity);

        glowSpriteRef.current.scale.set(4.5 * newGlowScale, 4.5 * newGlowScale, 1);
        glowSpriteRef.current.material.opacity = newGlowOpacity;
      }
    }
  });

  const handlePointerOver = () => {
    if (!disableHover) {
      setHovered(true);
      onHover?.(true);
      document.body.style.cursor = 'pointer'; // Show pointer cursor
    }
  };

  const handlePointerOut = () => {
    if (!disableHover) {
      setHovered(false);
      onHover?.(false);
      document.body.style.cursor = 'auto'; // Reset cursor
    }
  };

  const handleClick = () => {
    onClick?.();
  };

  // Reset cursor when hover is disabled (e.g., when modal opens or zoom level changes)
  useEffect(() => {
    if (disableHover) {
      document.body.style.cursor = 'auto';
      setHovered(false);
    }
  }, [disableHover]);

  return (
    <group position={position} scale={scale}>
      {/* Glow sprite behind planet (CSS box-shadow effect) */}
      <sprite ref={glowSpriteRef} scale={[4.5, 4.5, 1]} renderOrder={-1}>
        <spriteMaterial
          map={glowTexture}
          transparent={true}
          opacity={currentGlowOpacity}
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
