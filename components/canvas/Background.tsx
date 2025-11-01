'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Background() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Shader material for animated gradient background
  const uniforms = useRef({
    time: { value: 0 },
    color1: { value: new THREE.Color('#000000') },
    color2: { value: new THREE.Color('#1a0b2e') },
    color3: { value: new THREE.Color('#16213e') },
  });

  useFrame((state) => {
    if (uniforms.current) {
      uniforms.current.time.value = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -50]}>
      <planeGeometry args={[200, 200]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;

            // Create flowing gradient
            float noise = sin(uv.x * 2.0 + time) * cos(uv.y * 2.0 + time * 0.5);

            vec3 color = mix(color1, color2, uv.y + noise * 0.1);
            color = mix(color, color3, uv.x * 0.3);

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}
