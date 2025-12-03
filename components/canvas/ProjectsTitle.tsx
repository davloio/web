'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface ProjectsTitleProps {
  position: readonly [number, number, number];
  progress: number;
  scale?: number;
  color?: string;
  opacity?: number;
  radius?: number;
  startAngle?: number;
  arcLength?: number;
}

export default function ProjectsTitle({
  position,
  progress,
  scale = 2,
  color = '#ffffff',
  opacity = 0.8,
  radius = 30,
  startAngle = 240,
  arcLength = 40,
}: ProjectsTitleProps) {
  const text = 'PROJECTS';

  const fadeOpacity = useMemo(() => {
    if (progress < 210) return 0;
    if (progress >= 230) return opacity;
    return ((progress - 210) / 20) * opacity;
  }, [progress, opacity]);

  const letterData = useMemo(() => {
    return text.split('').map((letter) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      ctx.clearRect(0, 0, 256, 256);
      ctx.font = '700 180px nexa, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.fillText(letter, 128, 128);

      ctx.shadowBlur = 30;
      ctx.globalAlpha = 0.3;
      ctx.fillText(letter, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return { letter, texture };
    });
  }, [color]);

  const letterPositions = useMemo(() => {
    const positions: Array<{ pos: THREE.Vector3; angle: number }> = [];
    const spacing = scale * 0.7;
    const totalWidth = (text.length - 1) * spacing;
    const startX = position[0] - totalWidth / 2;

    for (let i = 0; i < text.length; i++) {
      const x = startX + i * spacing;
      const z = position[2];
      const y = position[1];

      positions.push({
        pos: new THREE.Vector3(x, y, z),
        angle: 0
      });
    }

    return positions;
  }, [position, scale, text.length]);

  return (
    <group>
      {letterData.map(({ texture }, index) => {
        const { pos, angle } = letterPositions[index];

        return (
          <mesh
            key={`letter-${index}`}
            position={[pos.x, pos.y, pos.z]}
            rotation={[-Math.PI / 2, 0, angle]}
            renderOrder={2}
          >
            <planeGeometry args={[scale, scale]} />
            <meshBasicMaterial
              map={texture}
              transparent
              opacity={fadeOpacity}
              depthWrite={false}
              depthTest={true}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}
