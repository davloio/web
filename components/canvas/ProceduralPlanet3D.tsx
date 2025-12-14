'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';
import ProceduralPlanetMesh from './ProceduralPlanetMesh';
import ProceduralAtmosphere from './ProceduralAtmosphere';
import OrbitalLabel from './OrbitalLabel';

interface ProceduralPlanet3DProps {
  config: ProceduralPlanetConfig;
  progress?: number;
  onClick?: () => void;
  interactiveZoneStart?: number;
  interactiveZoneEnd?: number;
  labelText?: string;
  labelFontSize?: number;
  labelTextColor?: string;
  isPlaceholder?: boolean;
}

export default function ProceduralPlanet3D({
  config,
  progress,
  onClick,
  interactiveZoneStart,
  interactiveZoneEnd,
  labelText,
  labelFontSize,
  labelTextColor,
  isPlaceholder = false,
}: ProceduralPlanet3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [inInteractiveZone, setInInteractiveZone] = useState(false);

  useEffect(() => {
    if (progress === undefined || interactiveZoneStart === undefined || interactiveZoneEnd === undefined) {
      setInInteractiveZone(true);
      return;
    }
    const isInteractive = progress >= interactiveZoneStart && progress <= interactiveZoneEnd;
    setInInteractiveZone(isInteractive);
  }, [progress, interactiveZoneStart, interactiveZoneEnd]);

  const handlePointerOver = () => {
    if (inInteractiveZone) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = () => {
    if (inInteractiveZone && onClick) {
      onClick();
    }
  };

  return (
    <group
      ref={groupRef}
      position={config.position}
    >
      <mesh
        scale={config.scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[config.terrain.radius, 32, 32]} />
        <meshBasicMaterial transparent={true} opacity={0} />
      </mesh>

      <ProceduralPlanetMesh
        ref={meshRef}
        terrain={config.terrain}
        colors={config.colors}
        lighting={config.lighting}
        scale={config.scale}
        hovered={isPlaceholder && hovered}
      />

      {config.atmosphere.enabled && (
        <ProceduralAtmosphere
          radius={config.atmosphere.radius}
          particles={config.atmosphere.particles}
          minParticleSize={config.atmosphere.minParticleSize}
          maxParticleSize={config.atmosphere.maxParticleSize}
          thickness={config.atmosphere.thickness}
          density={config.atmosphere.density}
          opacity={config.atmosphere.opacity}
          scale={config.atmosphere.scale}
          color={config.atmosphere.color}
          speed={config.atmosphere.speed}
        />
      )}

      {labelText && (
        <OrbitalLabel
          planetRadius={config.terrain.radius * config.scale}
          text={labelText}
          progress={progress ?? 0}
          interactiveZoneStart={interactiveZoneStart ?? 0}
          interactiveZoneEnd={interactiveZoneEnd ?? 350}
          onClick={onClick}
          fontSize={labelFontSize}
          textColor={labelTextColor}
        />
      )}

      {isPlaceholder && (
        <OrbitalLabel
          planetRadius={config.terrain.radius * config.scale}
          text="COMING SOON"
          progress={progress ?? 0}
          interactiveZoneStart={interactiveZoneStart ?? 0}
          interactiveZoneEnd={interactiveZoneEnd ?? 350}
          fontSize={500}
          textColor="#ffffff"
          centered={true}
          visible={hovered}
        />
      )}
    </group>
  );
}
