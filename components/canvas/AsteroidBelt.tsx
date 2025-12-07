'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AsteroidBeltConfig } from '@/types/planet';

interface AsteroidBeltProps {
  config: AsteroidBeltConfig;
  planetRadius: number;
  fadeStartDistance?: number;
  fadeRange?: number;
  planetPosition?: [number, number, number];
}

export default function AsteroidBelt({
  config,
  planetRadius,
}: AsteroidBeltProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mediumMeshesRef = useRef<(THREE.InstancedMesh | null)[]>([]);
  const largeMeshesRef = useRef<(THREE.InstancedMesh | null)[]>([]);
  const pointsRef = useRef<THREE.Points>(null);

  const {
    orbitRadius,
    beltThickness,
    beltHeight,
    smallCount,
    mediumCount,
    largeCount,
    baseColor,
    emissiveColor,
    roughness,
    metalness,
    orbitSpeed,
    tumbleSpeed,
    wobbleAmount,
    renderOrder = 0.4,
    castShadow = true,
    receiveShadow = true,
  } = config;

  let seed = 54321;
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const smallAsteroidsData = useMemo(() => {
    const positions = new Float32Array(smallCount * 3);
    const wobblePhases = new Float32Array(smallCount);

    for (let i = 0; i < smallCount; i++) {
      const theta = seededRandom() * Math.PI * 2;

      let radiusOffset;
      const layerRoll = seededRandom();
      if (layerRoll < 0.7) {
        radiusOffset = seededRandom() * 0.3;
      } else if (layerRoll < 0.9) {
        radiusOffset = 0.3 + seededRandom() * 0.2;
      } else {
        radiusOffset = 0.5 + seededRandom() * (beltThickness - 0.5);
      }

      const radius = (orbitRadius * planetRadius) + radiusOffset;
      const height = (seededRandom() - 0.5) * beltHeight;

      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = radius * Math.sin(theta);

      wobblePhases[i] = seededRandom() * Math.PI * 2;
    }

    return { positions, wobblePhases };
  }, [smallCount, orbitRadius, beltThickness, beltHeight, planetRadius]);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  const mediumAsteroidsData = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const tumbleSpeeds: THREE.Vector3[] = [];
    const wobblePhases: number[] = [];
    const geometryIndices: number[] = [];

    for (let i = 0; i < mediumCount; i++) {
      const theta = seededRandom() * Math.PI * 2;

      let radiusOffset;
      const layerRoll = seededRandom();
      if (layerRoll < 0.7) {
        radiusOffset = seededRandom() * 0.3;
      } else if (layerRoll < 0.9) {
        radiusOffset = 0.3 + seededRandom() * 0.2;
      } else {
        radiusOffset = 0.5 + seededRandom() * (beltThickness - 0.5);
      }

      const radius = (orbitRadius * planetRadius) + radiusOffset;
      const height = (seededRandom() - 0.5) * beltHeight;

      const baseSize = 0.04 + seededRandom() * 0.04;
      const scaleX = baseSize * (0.7 + seededRandom() * 0.6);
      const scaleY = baseSize * (0.7 + seededRandom() * 0.6);
      const scaleZ = baseSize * (0.7 + seededRandom() * 0.6);

      const x = radius * Math.cos(theta);
      const y = height;
      const z = radius * Math.sin(theta);

      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion(),
        new THREE.Vector3(scaleX, scaleY, scaleZ)
      );
      matrices.push(matrix);

      tumbleSpeeds.push(
        new THREE.Vector3(
          (seededRandom() - 0.5) * tumbleSpeed * 2,
          (seededRandom() - 0.5) * tumbleSpeed * 2,
          (seededRandom() - 0.5) * tumbleSpeed * 2
        )
      );

      wobblePhases.push(seededRandom() * Math.PI * 2);
      geometryIndices.push(Math.floor(seededRandom() * 4));
    }

    return { matrices, tumbleSpeeds, wobblePhases, geometryIndices };
  }, [mediumCount, orbitRadius, beltThickness, beltHeight, planetRadius, tumbleSpeed]);

  const largeAsteroidsData = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const tumbleSpeeds: THREE.Vector3[] = [];
    const wobblePhases: number[] = [];
    const geometryIndices: number[] = [];

    for (let i = 0; i < largeCount; i++) {
      const theta = seededRandom() * Math.PI * 2;

      let radiusOffset;
      const layerRoll = seededRandom();
      if (layerRoll < 0.7) {
        radiusOffset = seededRandom() * 0.3;
      } else if (layerRoll < 0.9) {
        radiusOffset = 0.3 + seededRandom() * 0.2;
      } else {
        radiusOffset = 0.5 + seededRandom() * (beltThickness - 0.5);
      }

      const radius = (orbitRadius * planetRadius) + radiusOffset;
      const height = (seededRandom() - 0.5) * beltHeight;

      const baseSize = 0.1 + seededRandom() * 0.1;
      const scaleX = baseSize * (0.6 + seededRandom() * 0.8);
      const scaleY = baseSize * (0.6 + seededRandom() * 0.8);
      const scaleZ = baseSize * (0.6 + seededRandom() * 0.8);

      const x = radius * Math.cos(theta);
      const y = height;
      const z = radius * Math.sin(theta);

      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion(),
        new THREE.Vector3(scaleX, scaleY, scaleZ)
      );
      matrices.push(matrix);

      tumbleSpeeds.push(
        new THREE.Vector3(
          (seededRandom() - 0.5) * tumbleSpeed * 2,
          (seededRandom() - 0.5) * tumbleSpeed * 2,
          (seededRandom() - 0.5) * tumbleSpeed * 2
        )
      );

      wobblePhases.push(seededRandom() * Math.PI * 2);
      geometryIndices.push(Math.floor(seededRandom() * 4));
    }

    return { matrices, tumbleSpeeds, wobblePhases, geometryIndices };
  }, [largeCount, orbitRadius, beltThickness, beltHeight, planetRadius, tumbleSpeed]);

  const geometries = useMemo(() => {
    const geoArray = [];

    const ico1 = new THREE.IcosahedronGeometry(1, 0);
    ico1.computeVertexNormals();
    geoArray.push(ico1);

    const dodeca = new THREE.DodecahedronGeometry(1, 0);
    dodeca.computeVertexNormals();
    geoArray.push(dodeca);

    const octa = new THREE.OctahedronGeometry(1, 0);
    octa.computeVertexNormals();
    geoArray.push(octa);

    const ico2 = new THREE.IcosahedronGeometry(1, 1);
    ico2.computeVertexNormals();
    geoArray.push(ico2);

    return geoArray;
  }, []);

  let frameCount = 0;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    frameCount++;
    const time = clock.getElapsedTime();

    groupRef.current.rotation.y += orbitSpeed;

    const tempMatrix = new THREE.Matrix4();
    const tempPos = new THREE.Vector3();
    const tempQuat = new THREE.Quaternion();
    const tempScale = new THREE.Vector3();
    const rotation = new THREE.Euler();

    mediumMeshesRef.current.forEach((mesh, geoIndex) => {
      if (!mesh) return;

      const asteroidIndices = mediumAsteroidsData.geometryIndices
        .map((idx, i) => idx === geoIndex ? i : -1)
        .filter(i => i !== -1);

      asteroidIndices.forEach((asteroidIndex, localIndex) => {
        mediumAsteroidsData.matrices[asteroidIndex].decompose(tempPos, tempQuat, tempScale);

        if (frameCount % 2 === 0 && wobbleAmount > 0) {
          const wobbleOffset = Math.sin(time * 0.0003 + mediumAsteroidsData.wobblePhases[asteroidIndex]) * wobbleAmount;
          tempPos.y += wobbleOffset * 0.5;
          const radius = Math.sqrt(tempPos.x * tempPos.x + tempPos.z * tempPos.z);
          const angle = Math.atan2(tempPos.z, tempPos.x);
          const newRadius = radius + wobbleOffset;
          tempPos.x = newRadius * Math.cos(angle);
          tempPos.z = newRadius * Math.sin(angle);
        }

        rotation.set(
          mediumAsteroidsData.tumbleSpeeds[asteroidIndex].x * time,
          mediumAsteroidsData.tumbleSpeeds[asteroidIndex].y * time,
          mediumAsteroidsData.tumbleSpeeds[asteroidIndex].z * time
        );
        tempQuat.setFromEuler(rotation);

        tempMatrix.compose(tempPos, tempQuat, tempScale);
        mesh.setMatrixAt(localIndex, tempMatrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
    });

    largeMeshesRef.current.forEach((mesh, geoIndex) => {
      if (!mesh) return;

      const asteroidIndices = largeAsteroidsData.geometryIndices
        .map((idx, i) => idx === geoIndex ? i : -1)
        .filter(i => i !== -1);

      asteroidIndices.forEach((asteroidIndex, localIndex) => {
        largeAsteroidsData.matrices[asteroidIndex].decompose(tempPos, tempQuat, tempScale);

        if (frameCount % 2 === 0 && wobbleAmount > 0) {
          const wobbleOffset = Math.sin(time * 0.0003 + largeAsteroidsData.wobblePhases[asteroidIndex]) * wobbleAmount;
          tempPos.y += wobbleOffset * 0.5;
          const radius = Math.sqrt(tempPos.x * tempPos.x + tempPos.z * tempPos.z);
          const angle = Math.atan2(tempPos.z, tempPos.x);
          const newRadius = radius + wobbleOffset;
          tempPos.x = newRadius * Math.cos(angle);
          tempPos.z = newRadius * Math.sin(angle);
        }

        rotation.set(
          largeAsteroidsData.tumbleSpeeds[asteroidIndex].x * time,
          largeAsteroidsData.tumbleSpeeds[asteroidIndex].y * time,
          largeAsteroidsData.tumbleSpeeds[asteroidIndex].z * time
        );
        tempQuat.setFromEuler(rotation);

        tempMatrix.compose(tempPos, tempQuat, tempScale);
        mesh.setMatrixAt(localIndex, tempMatrix);
      });

      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} renderOrder={renderOrder}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[smallAsteroidsData.positions, 3]}
            count={smallCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#4a4a4a"
          transparent
          opacity={0.4}
          map={particleTexture}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation={true}
        />
      </points>

      {geometries.map((geo, geoIndex) => {
        const asteroidIndices = mediumAsteroidsData.geometryIndices
          .map((idx, i) => idx === geoIndex ? i : -1)
          .filter(i => i !== -1);

        if (asteroidIndices.length === 0) return null;

        return (
          <instancedMesh
            key={`medium-${geoIndex}`}
            args={[geo, undefined, asteroidIndices.length]}
            castShadow={castShadow}
            receiveShadow={receiveShadow}
            renderOrder={renderOrder + 0.05}
            ref={(mesh) => {
              mediumMeshesRef.current[geoIndex] = mesh;

              if (mesh) {
                asteroidIndices.forEach((asteroidIndex, localIndex) => {
                  mesh.setMatrixAt(localIndex, mediumAsteroidsData.matrices[asteroidIndex]);
                });
                mesh.instanceMatrix.needsUpdate = true;
              }
            }}
          >
            <meshStandardMaterial
              color={baseColor}
              emissive={emissiveColor || '#000000'}
              roughness={roughness}
              metalness={metalness}
            />
          </instancedMesh>
        );
      })}

      {geometries.map((geo, geoIndex) => {
        const asteroidIndices = largeAsteroidsData.geometryIndices
          .map((idx, i) => idx === geoIndex ? i : -1)
          .filter(i => i !== -1);

        if (asteroidIndices.length === 0) return null;

        return (
          <instancedMesh
            key={`large-${geoIndex}`}
            args={[geo, undefined, asteroidIndices.length]}
            castShadow={castShadow}
            receiveShadow={receiveShadow}
            renderOrder={renderOrder + 0.1}
            ref={(mesh) => {
              largeMeshesRef.current[geoIndex] = mesh;

              if (mesh) {
                asteroidIndices.forEach((asteroidIndex, localIndex) => {
                  mesh.setMatrixAt(localIndex, largeAsteroidsData.matrices[asteroidIndex]);
                });
                mesh.instanceMatrix.needsUpdate = true;
              }
            }}
          >
            <meshStandardMaterial
              color={new THREE.Color(baseColor).addScalar(0.1)}
              emissive={emissiveColor || '#0a0a0a'}
              roughness={roughness - 0.03}
              metalness={metalness + 0.03}
            />
          </instancedMesh>
        );
      })}
    </group>
  );
}
