'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ComingSoonOverlayProps {
  planetRadius: number;
  planetScale?: number;
  show: boolean;
}

export default function ComingSoonOverlay({
  planetScale = 1,
  show,
}: ComingSoonOverlayProps) {
  const groupRef = useRef<THREE.Group>(null);
  const billboardGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (billboardGroupRef.current) {
      billboardGroupRef.current.quaternion.copy(camera.quaternion);
    }
  });

  const lockIconTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const width = 512;
    const height = 655;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const svgPath = new Path2D('M2.892,56.036h8.959v-1.075V37.117c0-10.205,4.177-19.484,10.898-26.207v-0.009 C29.473,4.177,38.754,0,48.966,0C59.17,0,68.449,4.177,75.173,10.901l0.01,0.009c6.721,6.723,10.898,16.002,10.898,26.207v17.844 v1.075h7.136c1.59,0,2.892,1.302,2.892,2.891v61.062c0,1.589-1.302,2.891-2.892,2.891H2.892c-1.59,0-2.892-1.302-2.892-2.891 V58.927C0,57.338,1.302,56.036,2.892,56.036L2.892,56.036z M26.271,56.036h45.387v-1.075V36.911c0-6.24-2.554-11.917-6.662-16.03 l-0.005,0.004c-4.111-4.114-9.787-6.669-16.025-6.669c-6.241,0-11.917,2.554-16.033,6.665c-4.109,4.113-6.662,9.79-6.662,16.03 v18.051V56.036L26.271,56.036z M49.149,89.448l4.581,21.139l-12.557,0.053l3.685-21.423c-3.431-1.1-5.918-4.315-5.918-8.111 c0-4.701,3.81-8.511,8.513-8.511c4.698,0,8.511,3.81,8.511,8.511C55.964,85.226,53.036,88.663,49.149,89.448L49.149,89.448z');

    ctx.save();
    const scale = width / 96.108;
    const paddingY = (height - 122.88 * scale) / 2;
    ctx.translate(0, paddingY);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';
    ctx.fill(svgPath, 'evenodd');
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  const textTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 72px nexa, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '-0.02em';
    ctx.fillText('COMING SOON', 512, 128);

    return new THREE.CanvasTexture(canvas);
  }, []);

  if (!show) return null;

  return (
    <group ref={groupRef} scale={planetScale}>
      <group ref={billboardGroupRef}>
        <mesh position={[0, 0.2, 0]} renderOrder={3.5}>
          <planeGeometry args={[0.6, 0.77]} />
          <meshBasicMaterial
            map={lockIconTexture}
            transparent={true}
            opacity={0.85}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>

        <mesh position={[0, -0.5, 0]} renderOrder={3.5}>
          <planeGeometry args={[3, 0.8]} />
          <meshBasicMaterial
            map={textTexture}
            transparent={true}
            opacity={0.8}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      </group>
    </group>
  );
}
