'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { noiseFunctions } from '@/lib/shaders/noise.glsl';
import { proceduralAtmosphereVertexShader } from '@/lib/shaders/proceduralAtmosphereVertex.glsl';
import { proceduralAtmosphereFragmentShader } from '@/lib/shaders/proceduralAtmosphereFragment.glsl';

interface ProceduralAtmosphereProps {
  radius: number;
  particles: number;
  minParticleSize: number;
  maxParticleSize: number;
  thickness: number;
  density: number;
  opacity: number;
  scale: number;
  color: string;
  speed: number;
}

export default function ProceduralAtmosphere({
  radius,
  particles,
  minParticleSize,
  maxParticleSize,
  thickness,
  density,
  opacity,
  scale,
  color,
  speed
}: ProceduralAtmosphereProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const cloudTexture = useLoader(THREE.TextureLoader, '/textures/cloud.png');

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];
    const sizes: number[] = [];

    for (let i = 0; i < particles; i++) {
      const r = Math.random() * thickness + radius;

      const p = new THREE.Vector3(
        2 * Math.random() - 1,
        2 * Math.random() - 1,
        2 * Math.random() - 1
      );
      p.normalize().multiplyScalar(r);

      const size = Math.random() * (maxParticleSize - minParticleSize) + minParticleSize;

      verts.push(p.x, p.y, p.z);
      sizes.push(size);
    }

    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
    geo.setAttribute('size', new THREE.BufferAttribute(new Float32Array(sizes), 1));

    return geo;
  }, [particles, radius, thickness, minParticleSize, maxParticleSize]);

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    speed: { value: speed },
    opacity: { value: opacity },
    density: { value: density },
    scale: { value: scale },
    color: { value: new THREE.Color(color) },
    pointTexture: { value: cloudTexture },
  }), [speed, opacity, density, scale, color, cloudTexture]);

  const fragmentShader = useMemo(() =>
    proceduralAtmosphereFragmentShader.replace(
      'void main() {',
      `${noiseFunctions}\nvoid main() {`
    ), []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} renderOrder={0.5} raycast={() => null}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={proceduralAtmosphereVertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={true}
        transparent
      />
    </points>
  );
}
