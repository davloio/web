'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function LoadingSolarSystem() {
  const groupRef = useRef<THREE.Group>(null);
  const planet1Ref = useRef<THREE.Mesh>(null);
  const planet2Ref = useRef<THREE.Mesh>(null);
  const planet3Ref = useRef<THREE.Mesh>(null);
  const planet4Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();

    groupRef.current.rotation.y = time * 0.2;

    if (planet1Ref.current) {
      planet1Ref.current.rotation.y = time * 4;
    }
    if (planet2Ref.current) {
      planet2Ref.current.rotation.y = time * 1.2;
    }
    if (planet3Ref.current) {
      planet3Ref.current.rotation.y = time * 1.8;
    }
    if (planet4Ref.current) {
      planet4Ref.current.rotation.y = time * 2.5;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.4, 64, 64]} />
          <meshBasicMaterial
            color="#FDB813"
            toneMapped={false}
          />
          <pointLight intensity={3} distance={15} decay={2} color="#FDB813" />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.46, 32, 32]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshBasicMaterial
            color="#FFA500"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.78, 0.79, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.08, 1.09, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.48, 1.49, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.98, 1.99, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>

        <group rotation={[0, 0, 0]}>
          <mesh ref={planet1Ref} position={[0.8, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial
              color="#B8B8B8"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        </group>

        <group rotation={[0, Math.PI * 0.4, 0]}>
          <mesh ref={planet2Ref} position={[1.1, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial
              color="#F5DEB3"
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
          <mesh position={[1.1, 0, 0]}>
            <sphereGeometry args={[0.17, 32, 32]} />
            <meshBasicMaterial
              color="#FFC649"
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
        </group>

        <group rotation={[0, Math.PI * 0.8, 0]}>
          <mesh ref={planet3Ref} position={[1.5, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshStandardMaterial
              color="#4A90D9"
              roughness={0.5}
              metalness={0.4}
            />
          </mesh>
          <mesh position={[1.5, 0, 0]}>
            <sphereGeometry args={[0.18, 32, 32]} />
            <meshBasicMaterial
              color="#88CCFF"
              transparent
              opacity={0.25}
              side={THREE.BackSide}
            />
          </mesh>
        </group>

        <group rotation={[0, Math.PI * 1.3, 0]}>
          <mesh ref={planet4Ref} position={[2.0, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.11, 32, 32]} />
            <meshStandardMaterial
              color="#E27B58"
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        </group>
      </group>

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[0, 0, 0]}
        intensity={3}
        color="#FDB813"
        castShadow
      />
      <hemisphereLight intensity={0.8} groundColor="#1a1a2e" color="#3a3a5e" />
    </>
  );
}
