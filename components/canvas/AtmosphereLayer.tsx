'use client'

import { useRef, useMemo } from 'react'
import * as THREE from 'three'

export interface AtmosphereLayerProps {
  planetRadius?: number
  planetScale?: number
  atmosphereColor?: string
  atmosphereIntensity?: number
  fresnelPower?: number
  enabled?: boolean
}

const AtmosphereLayer = ({
  planetRadius = 1,
  planetScale = 1,
  atmosphereColor = '#88ccff',
  atmosphereIntensity = 0.3,
  fresnelPower = 3.0,
  enabled = true,
}: AtmosphereLayerProps) => {
  const meshRef = useRef<THREE.Mesh>(null)

  if (!enabled) return null

  const uniforms = useMemo(() => {
    const color = new THREE.Color(atmosphereColor);
    return {
      atmosphereColor: { value: color },
      atmosphereIntensity: { value: atmosphereIntensity },
      fresnelPower: { value: fresnelPower },
    };
  }, [atmosphereColor, atmosphereIntensity, fresnelPower]);

  const vertexShader = `
    precision highp float;

    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `

  const fragmentShader = `
    precision highp float;

    uniform vec3 atmosphereColor;
    uniform float atmosphereIntensity;
    uniform float fresnelPower;

    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 viewDirection = normalize(vViewPosition);
      float dotProduct = clamp(abs(dot(vNormal, viewDirection)), 0.0, 1.0);
      float fresnel = pow(1.0 - dotProduct, fresnelPower);

      float smoothFalloff = smoothstep(0.0, 1.0, fresnel);
      float gradientFalloff = fresnel * fresnel;

      float alpha = clamp(smoothFalloff * gradientFalloff * atmosphereIntensity, 0.0, 1.0);

      gl_FragColor = vec4(atmosphereColor, alpha);
    }
  `

  const effectiveRadius = planetRadius * planetScale * 1.02

  return (
    <mesh ref={meshRef} scale={effectiveRadius} renderOrder={0.8} raycast={() => null}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={true}
      />
    </mesh>
  )
}

export default AtmosphereLayer
