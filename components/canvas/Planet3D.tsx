'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, CanvasTexture, MeshStandardMaterial, SpriteMaterial } from 'three';
import { Planet3DProps } from '@/types/planet';
import CloudLayer from './CloudLayer';
import Logo3DSatellite from './Logo3DSatellite';
import ParticleNetwork from './ParticleNetwork';
import ScannerEffect from './ScannerEffect';
import ComingSoonOverlay from './ComingSoonOverlay';
import HolographicLogo from './HolographicLogo';

export default function Planet3D({
  position,
  scale = 1,
  color,
  emissive = color,
  emissiveIntensity = 0.3,
  roughness = 0.9,
  metalness = 0.1,
  onClick,
  onHover,
  disableHover = false,
  showLabel = false,
  zoomProgress = 0,
  textFadeStart = 75,
  textFadeRange = 25,
  glowColor = '#ffffff',
  showClouds = false,
  show3DLogo = false,
  cloudConfig,
  logoConfig,
  textureType,
  showParticleNetwork = false,
  networkConfig,
  showScanner = false,
  showComingSoonOnHover = false,
  showHolographicLogo = false,
  holographicConfig,
}: Planet3DProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const glowSpriteRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [currentGlow, setCurrentGlow] = useState(emissiveIntensity);
  const [currentGlowScale, setCurrentGlowScale] = useState(1);
  const [currentGlowOpacity, setCurrentGlowOpacity] = useState(0.7);
  const [currentMeshScale, setCurrentMeshScale] = useState(1);

  const glowTexture = useMemo(() => {
    if (!glowColor) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const r = parseInt(glowColor.slice(1, 3), 16);
    const g = parseInt(glowColor.slice(3, 5), 16);
    const b = parseInt(glowColor.slice(5, 7), 16);

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.5)`);
    gradient.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.15)`);
    gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.05)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    return new CanvasTexture(canvas);
  }, [glowColor]);

  const surfaceTexture = useMemo(() => {
    if (!showLabel) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 4096;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 4096, 2048);

    const centerX = 2048;
    const centerY = 1024;
    const logoSize = 400;

    const img = new Image();
    img.src = '/logo-black.svg';

    img.onload = () => {
      ctx.drawImage(img, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const textY = centerY + logoSize / 2 + 80;
      ctx.font = '700 100px nexa, sans-serif';
      ctx.letterSpacing = '-0.06em';

      ctx.strokeStyle = 'rgb(0, 0, 0)';
      ctx.lineWidth = 6;
      ctx.lineJoin = 'round';
      ctx.strokeText('about', centerX, textY);

      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillText('about', centerX, textY);

      texture.needsUpdate = true;
    };

    const texture = new CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  }, [showLabel]);

  const craterTexture = useMemo(() => {
    if (!textureType) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d')!;

    const baseColor = textureType === 'rocky-dark' ? '#404040' : '#aaaaaa';
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 2048, 2048);

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    if (textureType === 'rocky-dark') {
      const craterCount = 15;
      for (let i = 0; i < craterCount; i++) {
        const x = seededRandom(i * 2.5) * 2048;
        const y = seededRandom(i * 3.7) * 2048;
        const radius = 150 + seededRandom(i * 5.3) * 250;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.3, '#1a1a1a');
        gradient.addColorStop(0.5, '#2a2a2a');
        gradient.addColorStop(0.7, '#404040');
        gradient.addColorStop(0.85, '#606060');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 2048, 2048);
      }
    } else {
      const craterCount = 28;
      for (let i = 0; i < craterCount; i++) {
        const x = seededRandom(i * 1.8) * 2048;
        const y = seededRandom(i * 2.3) * 2048;
        const radius = 70 + seededRandom(i * 4.1) * 100;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, '#8a8a8a');
        gradient.addColorStop(0.3, '#939393');
        gradient.addColorStop(0.5, '#9c9c9c');
        gradient.addColorStop(0.7, '#aaaaaa');
        gradient.addColorStop(0.85, '#b8b8b8');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 2048, 2048);
      }
    }

    const noiseImageData = ctx.getImageData(0, 0, 2048, 2048);
    const data = noiseImageData.data;
    const noiseStrength = textureType === 'rocky-dark' ? 30 : 25;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (seededRandom(i / 4) - 0.5) * noiseStrength;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(noiseImageData, 0, 0);

    const texture = new CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  }, [textureType]);

  useFrame(({ camera }) => {
    if (materialRef.current && !disableHover) {
      const targetGlow = hovered ? emissiveIntensity * 2 : emissiveIntensity;
      const newGlow = currentGlow + (targetGlow - currentGlow) * 0.1;
      setCurrentGlow(newGlow);
      materialRef.current.emissiveIntensity = newGlow;
    }

    if (glowSpriteRef.current) {
      glowSpriteRef.current.quaternion.copy(camera.quaternion);

      if (!disableHover) {
        const targetGlowScale = hovered ? 1.15 : 1;
        const targetGlowOpacity = hovered ? 1.1 : 0.7;
        const targetMeshScale = hovered ? 1.2 : 1;

        const newGlowScale = currentGlowScale + (targetGlowScale - currentGlowScale) * 0.1;
        const newGlowOpacity = currentGlowOpacity + (targetGlowOpacity - currentGlowOpacity) * 0.1;
        const newMeshScale = currentMeshScale + (targetMeshScale - currentMeshScale) * 0.1;

        setCurrentGlowScale(newGlowScale);
        setCurrentGlowOpacity(newGlowOpacity);
        setCurrentMeshScale(newMeshScale);

        glowSpriteRef.current.scale.set(4.5 * newGlowScale * newMeshScale, 4.5 * newGlowScale * newMeshScale, 1);
        (glowSpriteRef.current.material as SpriteMaterial).opacity = newGlowOpacity;
      }
    }
  });

  const handlePointerOver = () => {
    if (!disableHover) {
      setHovered(true);
      onHover?.(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    if (!disableHover) {
      setHovered(false);
      onHover?.(false);
      document.body.style.cursor = 'auto';
    }
  };

  const handleClick = () => {
    onClick?.();
  };

  useEffect(() => {
    if (disableHover) {
      document.body.style.cursor = 'auto';
      setHovered(false);
      setCurrentMeshScale(1);
    }
  }, [disableHover]);

  useEffect(() => {
    if (meshRef.current && showLabel) {
      meshRef.current.rotation.y = -Math.PI / 2;
    }
  }, [showLabel]);

  return (
    <group position={position} scale={scale}>
      {!showLabel && glowTexture && (
        <sprite ref={glowSpriteRef} scale={[4.5, 4.5, 1]} renderOrder={0}>
          <spriteMaterial
            map={glowTexture}
            transparent={true}
            opacity={currentGlowOpacity}
            depthWrite={false}
            depthTest={false}
          />
        </sprite>
      )}

      {showClouds && (
        <CloudLayer
          planetRadius={1}
          planetScale={currentMeshScale}
          hovered={hovered}
          {...cloudConfig}
        />
      )}

      {showParticleNetwork && (
        <ParticleNetwork
          planetRadius={1}
          planetScale={currentMeshScale}
          particleColor="#aaaaaa"
          lineColor="#6b8fb8"
          {...networkConfig}
        />
      )}

      {showScanner && (
        <ScannerEffect
          planetRadius={1}
          planetScale={currentMeshScale}
          color={color}
        />
      )}

      {showComingSoonOnHover && (
        <ComingSoonOverlay
          planetRadius={1}
          planetScale={currentMeshScale}
          show={hovered}
        />
      )}

      {showHolographicLogo && (
        <HolographicLogo
          planetRadius={1}
          planetScale={currentMeshScale}
          hovered={hovered}
          {...holographicConfig}
        />
      )}

      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        renderOrder={1}
        scale={currentMeshScale}
      >
        <sphereGeometry args={[1, 32, 32]} />

        {showLabel ? (
          <>
            <meshStandardMaterial
              color={color}
              emissive={emissive}
              emissiveIntensity={emissiveIntensity}
              roughness={roughness}
              metalness={metalness}
              map={craterTexture}
            />
          </>
        ) : (
          <meshStandardMaterial
            ref={materialRef}
            color={color}
            emissive={emissive}
            emissiveIntensity={currentGlow}
            roughness={roughness}
            metalness={metalness}
            map={craterTexture}
          />
        )}
      </mesh>

      {show3DLogo && (
        <Logo3DSatellite
          position={logoConfig?.position || [0, 2.5, 0]}
          hovered={hovered}
          {...logoConfig}
        />
      )}

      {showLabel && (
        <mesh
          position={[0, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          renderOrder={2}
        >
          <sphereGeometry args={[1.001, 32, 32]} />
          <meshBasicMaterial
            map={surfaceTexture}
            toneMapped={false}
            opacity={zoomProgress <= textFadeStart ? 0 : Math.min(1, (zoomProgress - textFadeStart) / textFadeRange)}
            transparent={true}
          />
        </mesh>
      )}
    </group>
  );
}
