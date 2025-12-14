'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitalLabelProps {
  planetPosition: [number, number, number];
  planetRadius: number;
  text: string;
  progress: number;
  interactiveZoneStart: number;
  interactiveZoneEnd: number;
  onClick?: () => void;
  fontSize?: number;
  textColor?: string;
  centered?: boolean;
  visible?: boolean;
}

export default function OrbitalLabel({
  planetPosition,
  planetRadius,
  text,
  progress,
  interactiveZoneStart,
  interactiveZoneEnd,
  onClick,
  fontSize = 320,
  textColor = '#ffffff',
  centered = false,
  visible,
}: OrbitalLabelProps) {
  const labelGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const opacityRef = useRef(0);
  const { camera } = useThree();

  const { textTexture, canvasWidth, canvasHeight } = useMemo(() => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.font = `700 ${fontSize}px nexa, -apple-system, sans-serif`;
    const metrics = tempCtx.measureText(text);
    const measuredWidth = metrics.width;

    const canvasWidth = Math.max(4096, Math.ceil(measuredWidth * 1.5));
    const canvasHeight = 512;

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = `700 ${fontSize}px nexa, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const r = parseInt(textColor.slice(1, 3), 16);
    const g = parseInt(textColor.slice(3, 5), 16);
    const b = parseInt(textColor.slice(5, 7), 16);

    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`;
    ctx.shadowBlur = 50;
    ctx.fillStyle = textColor;
    ctx.fillText(text, canvas.width / 2, 256);

    ctx.shadowBlur = 80;
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
    ctx.fillText(text, canvas.width / 2, 256);

    ctx.shadowBlur = 120;
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
    ctx.fillText(text, canvas.width / 2, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return { textTexture: texture, canvasWidth, canvasHeight };
  }, [text, fontSize, textColor]);

  const planeSize = useMemo(() => {
    const canvasAspectRatio = canvasWidth / canvasHeight;

    const height = (fontSize / 320) * 0.8;
    const width = height * canvasAspectRatio;

    return { width, height };
  }, [fontSize, canvasWidth, canvasHeight]);

  const fadeOpacity = useMemo(() => {
    if (!progress) return 0;

    const fadeInStart = interactiveZoneStart - 10;
    const fadeInEnd = interactiveZoneStart + 5;
    const fadeOutStart = interactiveZoneEnd - 5;
    const fadeOutEnd = interactiveZoneEnd + 10;

    if (progress < fadeInStart) return 0;
    if (progress < fadeInEnd) return (progress - fadeInStart) / 15;
    if (progress < fadeOutStart) return 1;
    if (progress < fadeOutEnd) return 1 - (progress - fadeOutStart) / 15;
    return 0;
  }, [progress, interactiveZoneStart, interactiveZoneEnd]);

  const inInteractiveZone = progress >= interactiveZoneStart && progress <= interactiveZoneEnd;
  const isInFadeRange = progress >= (interactiveZoneStart - 10) && progress <= (interactiveZoneEnd + 10);

  useFrame(() => {
    if (!labelGroupRef.current || !meshRef.current) return;

    if (centered) {
      labelGroupRef.current.position.set(0, 0, 0);
    } else {
      const offset = planetRadius + 1.0;
      labelGroupRef.current.position.set(0, 0, offset);
    }

    labelGroupRef.current.quaternion.copy(camera.quaternion);

    const targetOpacity = visible !== undefined ? (visible ? 1 : 0) : fadeOpacity;
    const currentOpacity = opacityRef.current;
    const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.12;
    opacityRef.current = newOpacity;

    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = newOpacity;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (inInteractiveZone && onClick) {
      onClick();
    }
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (inInteractiveZone) {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'auto';
  };

  useEffect(() => {
    return () => {
      textTexture.dispose();
    };
  }, [textTexture]);

  if (visible === undefined && !isInFadeRange) return null;

  return (
    <group ref={labelGroupRef}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        renderOrder={2.2}
      >
        <planeGeometry args={[planeSize.width, planeSize.height]} />
        <meshBasicMaterial
          map={textTexture}
          transparent={true}
          opacity={opacityRef.current}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </group>
  );
}
