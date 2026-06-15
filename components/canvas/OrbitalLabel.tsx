'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface OrbitalLabelProps {
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
  const appearRef = useRef(0);
  const hoverScaleRef = useRef(1);
  const [labelHovered, setLabelHovered] = useState(false);
  const { camera } = useThree();

  const { textTexture, canvasWidth, canvasHeight } = useMemo(() => {
    const font = `400 ${fontSize}px nexa, -apple-system, sans-serif`;
    const letterSpacing = '0.28em';

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.font = font;
    tempCtx.letterSpacing = letterSpacing;
    const measuredWidth = tempCtx.measureText(text).width;

    const pad = Math.ceil(fontSize * 0.4);
    const canvasWidth = Math.ceil(measuredWidth + pad * 2);
    const canvasHeight = Math.ceil(fontSize + pad * 2);

    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = font;
    ctx.letterSpacing = letterSpacing;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const r = parseInt(textColor.slice(1, 3), 16);
    const g = parseInt(textColor.slice(3, 5), 16);
    const b = parseInt(textColor.slice(5, 7), 16);

    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.85)`;
    ctx.shadowBlur = fontSize * 0.06;
    ctx.fillStyle = textColor;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
    ctx.shadowBlur = fontSize * 0.22;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return { textTexture: texture, canvasWidth, canvasHeight };
  }, [text, fontSize, textColor]);

  const planeSize = useMemo(() => {
    const pxToWorld = ((fontSize / 320) * 0.8) / 512;
    return {
      width: canvasWidth * pxToWorld,
      height: canvasHeight * pxToWorld,
    };
  }, [fontSize, canvasWidth, canvasHeight]);

  const yOffset = centered ? 0 : -(planetRadius + planeSize.height / 2 + 0.4);

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
  const isClickable = inInteractiveZone && onClick !== undefined;

  useFrame(() => {
    if (!labelGroupRef.current || !meshRef.current) return;

    labelGroupRef.current.quaternion.copy(camera.quaternion);

    const appearTarget = visible !== undefined ? (visible ? 1 : 0) : fadeOpacity;
    appearRef.current += (appearTarget - appearRef.current) * 0.14;
    const appear = appearRef.current;

    const eased = appear * appear * (3 - 2 * appear);

    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = eased;

    const rise = centered ? 0 : (1 - eased) * 0.5;
    meshRef.current.position.y = yOffset - rise;

    const appearScale = centered ? 0.9 + 0.1 * eased : 0.94 + 0.06 * eased;

    const hoverTarget = labelHovered && isClickable ? 1.06 : 1;
    hoverScaleRef.current += (hoverTarget - hoverScaleRef.current) * 0.15;

    meshRef.current.scale.setScalar(appearScale * hoverScaleRef.current);
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isClickable) {
      onClick?.();
    }
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isClickable) {
      setLabelHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setLabelHovered(false);
    document.body.style.cursor = 'auto';
  };

  useEffect(() => {
    return () => {
      textTexture.dispose();
    };
  }, [textTexture]);

  useEffect(() => {
    if (!isClickable && labelHovered) {
      setLabelHovered(false);
      document.body.style.cursor = 'auto';
    }
  }, [isClickable, labelHovered]);

  if (visible === undefined && !isInFadeRange) return null;

  return (
    <group ref={labelGroupRef}>
      <mesh
        ref={meshRef}
        position={[0, yOffset, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        renderOrder={2.2}
      >
        <planeGeometry args={[planeSize.width, planeSize.height]} />
        <meshBasicMaterial
          map={textTexture}
          transparent={true}
          opacity={0}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </group>
  );
}
