'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';
import ProceduralPlanetMesh from './ProceduralPlanetMesh';
import ProceduralAtmosphere from './ProceduralAtmosphere';
import AtmosphereLayer from './AtmosphereLayer';

interface ProceduralPlanet3DProps {
  config: ProceduralPlanetConfig;
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
  disableHover?: boolean;
}

export default function ProceduralPlanet3D({
  config,
  onClick,
  onHover,
  disableHover = false,
}: ProceduralPlanet3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [currentScale, setCurrentScale] = useState(1);

  // Hover animation
  useFrame(() => {
    if (disableHover) return;

    const targetScale = hovered ? 1.1 : 1.0;
    const newScale = currentScale + (targetScale - currentScale) * 0.1;
    setCurrentScale(newScale);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(newScale);
    }
  });

  const handlePointerOver = () => {
    console.log('ProceduralPlanet3D handlePointerOver called', config.id, 'disableHover:', disableHover);
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

  const handleClick = (e: any) => {
    console.log('ProceduralPlanet3D handleClick called', config.id);
    e.stopPropagation();
    onClick?.();
  };

  return (
    <group ref={groupRef} position={config.position}>
      <ProceduralPlanetMesh
        ref={meshRef}
        terrain={config.terrain}
        colors={config.colors}
        lighting={config.lighting}
        scale={config.scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      <ProceduralAtmosphere
        params={config.atmosphere}
        lightDirection={config.lighting.lightDirection}
        planetRadius={config.terrain.radius * config.scale}
      />

      {/* Optional: Keep Fresnel atmosphere for added glow effect */}
      <AtmosphereLayer
        planetRadius={config.terrain.radius}
        planetScale={config.scale * currentScale}
        atmosphereColor={config.atmosphere.color}
        atmosphereIntensity={0.1}
        fresnelPower={2.5}
        enabled={config.atmosphere.enabled}
      />
    </group>
  );
}
