'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { atmosphereRimVertexShader, atmosphereRimFragmentShader } from '@/lib/shaders/atmosphereRim.glsl';

interface AtmosphereRimProps {
  radius: number;
  color: string;
  intensity: number;
  fresnelPower: number;
  lightDirection: [number, number, number];
}

export default function AtmosphereRim({
  radius,
  color,
  intensity,
  fresnelPower,
  lightDirection,
}: AtmosphereRimProps) {
  const uniforms = useMemo(() => ({
    rimColor: { value: new THREE.Color(color) },
    rimIntensity: { value: intensity },
    fresnelPower: { value: fresnelPower },
    lightDirection: { value: new THREE.Vector3(...lightDirection) },
  }), [color, intensity, fresnelPower, lightDirection]);

  return (
    <mesh scale={radius} renderOrder={0.8} raycast={() => null}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={atmosphereRimVertexShader}
        fragmentShader={atmosphereRimFragmentShader}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={true}
      />
    </mesh>
  );
}
