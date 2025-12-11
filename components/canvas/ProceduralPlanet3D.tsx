'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';
import ProceduralPlanetMesh from './ProceduralPlanetMesh';
import ProceduralAtmosphere from './ProceduralAtmosphere';

interface ProceduralPlanet3DProps {
  config: ProceduralPlanetConfig;
}

export default function ProceduralPlanet3D({
  config,
}: ProceduralPlanet3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group ref={groupRef} position={config.position}>
      <ProceduralPlanetMesh
        ref={meshRef}
        terrain={config.terrain}
        colors={config.colors}
        lighting={config.lighting}
        scale={config.scale}
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
    </group>
  );
}
