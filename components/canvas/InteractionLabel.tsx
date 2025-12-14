'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractionLabelProps {
  show: boolean;
  text?: string;
  planetScale?: number;
  offset?: [number, number, number];
  inInteractiveZone?: boolean;
}

export default function InteractionLabel({
  show,
  text = 'EXPLORE',
  planetScale = 1,
  offset = [0, 0, 0],
  inInteractiveZone = true,
}: InteractionLabelProps) {
  const billboardGroupRef = useRef<THREE.Group>(null);
  const backgroundRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const [currentOpacity, setCurrentOpacity] = useState(0);
  const [currentScale, setCurrentScale] = useState(0.8);

  const backgroundTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const borderRadius = 20;
    const padding = 20;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.moveTo(borderRadius + padding, padding);
    ctx.lineTo(canvas.width - borderRadius - padding, padding);
    ctx.quadraticCurveTo(canvas.width - padding, padding, canvas.width - padding, borderRadius + padding);
    ctx.lineTo(canvas.width - padding, canvas.height - borderRadius - padding);
    ctx.quadraticCurveTo(canvas.width - padding, canvas.height - padding, canvas.width - borderRadius - padding, canvas.height - padding);
    ctx.lineTo(borderRadius + padding, canvas.height - padding);
    ctx.quadraticCurveTo(padding, canvas.height - padding, padding, canvas.height - borderRadius - padding);
    ctx.lineTo(padding, borderRadius + padding);
    ctx.quadraticCurveTo(padding, padding, borderRadius + padding, padding);
    ctx.closePath();
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }, []);

  const textTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.font = '700 120px nexa, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '-0.02em';

    ctx.shadowColor = '#8B5CF6';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 512, 128);

    ctx.shadowBlur = 35;
    ctx.fillText(text, 512, 128);

    return new THREE.CanvasTexture(canvas);
  }, [text]);

  useFrame(() => {
    if (billboardGroupRef.current) {
      billboardGroupRef.current.quaternion.copy(camera.quaternion);
    }

    const targetOpacity = show && inInteractiveZone ? 1 : 0;
    const targetScale = show && inInteractiveZone ? 1.0 : 0.8;

    const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.15;
    const newScale = currentScale + (targetScale - currentScale) * 0.15;

    setCurrentOpacity(newOpacity);
    setCurrentScale(newScale);

    if (backgroundRef.current && textRef.current) {
      (backgroundRef.current.material as THREE.MeshBasicMaterial).opacity = newOpacity;
      (textRef.current.material as THREE.MeshBasicMaterial).opacity = newOpacity;

      billboardGroupRef.current?.scale.set(newScale, newScale, newScale);
    }
  });

  useEffect(() => {
    return () => {
      backgroundTexture.dispose();
      textTexture.dispose();
    };
  }, [backgroundTexture, textTexture]);

  if (!inInteractiveZone) return null;

  return (
    <group position={offset} scale={planetScale}>
      <group ref={billboardGroupRef}>
        <mesh ref={backgroundRef} renderOrder={2.0}>
          <planeGeometry args={[2.2, 0.6]} />
          <meshBasicMaterial
            map={backgroundTexture}
            transparent={true}
            opacity={currentOpacity}
            depthWrite={false}
            depthTest={true}
          />
        </mesh>

        <mesh ref={textRef} position={[0, 0, 0.001]} renderOrder={2.1}>
          <planeGeometry args={[2.0, 0.5]} />
          <meshBasicMaterial
            map={textTexture}
            transparent={true}
            opacity={currentOpacity}
            depthWrite={false}
            depthTest={true}
          />
        </mesh>
      </group>
    </group>
  );
}
