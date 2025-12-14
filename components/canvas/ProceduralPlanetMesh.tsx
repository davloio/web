'use client';

import { useRef, useMemo, forwardRef, useEffect } from 'react';
import * as THREE from 'three';
import { ProceduralTerrainParams, ProceduralColorParams, ProceduralLightingParams } from '@/types/proceduralPlanet';
import { noiseFunctions } from '@/lib/shaders/noise.glsl';
import { proceduralPlanetVertexShader } from '@/lib/shaders/proceduralPlanetVertex.glsl';
import { proceduralPlanetFragmentShader } from '@/lib/shaders/proceduralPlanetFragment.glsl';

interface ProceduralPlanetMeshProps {
  terrain: ProceduralTerrainParams;
  colors: ProceduralColorParams;
  lighting: ProceduralLightingParams;
  scale: number;
  hovered?: boolean;
}

const ProceduralPlanetMesh = forwardRef<THREE.Mesh, ProceduralPlanetMeshProps>(
  ({ terrain, colors, lighting, scale, hovered = false }, ref) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const terrainTypeMap: Record<string, number> = { simplex: 1, fractal: 2, ridged: 3 };

    const uniforms = useMemo(() => ({
      type: { value: terrainTypeMap[terrain.type] },
      radius: { value: terrain.radius },
      amplitude: { value: terrain.amplitude },
      sharpness: { value: terrain.sharpness },
      offset: { value: terrain.offset },
      period: { value: terrain.period },
      persistence: { value: terrain.persistence },
      lacunarity: { value: terrain.lacunarity },
      octaves: { value: terrain.octaves },

      color1: { value: new THREE.Color(colors.color1) },
      color2: { value: new THREE.Color(colors.color2) },
      color3: { value: new THREE.Color(colors.color3) },
      color4: { value: new THREE.Color(colors.color4) },
      color5: { value: new THREE.Color(colors.color5) },
      transition2: { value: colors.transition2 },
      transition3: { value: colors.transition3 },
      transition4: { value: colors.transition4 },
      transition5: { value: colors.transition5 },
      blend12: { value: colors.blend12 },
      blend23: { value: colors.blend23 },
      blend34: { value: colors.blend34 },
      blend45: { value: colors.blend45 },

      ambientIntensity: { value: lighting.ambientIntensity },
      diffuseIntensity: { value: lighting.diffuseIntensity },
      specularIntensity: { value: lighting.specularIntensity },
      shininess: { value: lighting.shininess },
      lightDirection: { value: new THREE.Vector3(...lighting.lightDirection) },
      lightColor: { value: new THREE.Color(lighting.lightColor) },
      bumpStrength: { value: lighting.bumpStrength },
      bumpOffset: { value: lighting.bumpOffset },
    }), [terrain, colors, lighting]);

    const geometryRef = useRef<THREE.BufferGeometry>(null);

    useEffect(() => {
      if (geometryRef.current) {
        geometryRef.current.computeTangents();
        const maxDisplacement = terrain.radius + terrain.amplitude;
        geometryRef.current.boundingSphere = new THREE.Sphere(
          new THREE.Vector3(0, 0, 0),
          maxDisplacement
        );
      }
    }, [terrain.radius, terrain.amplitude]);

    const vertexShader = useMemo(() =>
      proceduralPlanetVertexShader.replace(
        'void main() {',
        `${noiseFunctions}\nvoid main() {`
      ), []
    );

    const fragmentShader = useMemo(() =>
      proceduralPlanetFragmentShader.replace(
        'void main() {',
        `${noiseFunctions}\nvoid main() {`
      ), []
    );

    return (
      <mesh
        ref={ref}
        scale={scale}
        castShadow
        receiveShadow
        renderOrder={1}
      >
        <sphereGeometry ref={geometryRef} args={[1, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          depthWrite={true}
          depthTest={true}
          transparent={true}
          opacity={hovered ? 0.5 : 1.0}
        />
      </mesh>
    );
  }
);

ProceduralPlanetMesh.displayName = 'ProceduralPlanetMesh';

export default ProceduralPlanetMesh;
