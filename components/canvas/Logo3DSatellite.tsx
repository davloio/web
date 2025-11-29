'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

export interface Logo3DSatelliteProps {
  position?: [number, number, number]
  scale?: number
  svgPath?: string
  hovered?: boolean
  glowColor?: string
  glowIntensity?: number
  enabled?: boolean
}

const Logo3DSatellite = ({
  position = [0, 2.5, 0],
  scale = 0.15,
  svgPath = '/logo-black.svg',
  hovered = false,
  glowColor = '#4488ff',
  glowIntensity = 0.5,
  enabled = true,
}: Logo3DSatelliteProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [geometry, setGeometry] = useState<THREE.ExtrudeGeometry | null>(null)
  const currentScale = useRef(1)
  const currentGlow = useRef(glowIntensity)

  useEffect(() => {
    const loader = new SVGLoader()

    loader.load(
      svgPath,
      (data) => {
        const paths = data.paths
        const shapes: THREE.Shape[] = []

        paths.forEach((path) => {
          const pathShapes = SVGLoader.createShapes(path)
          shapes.push(...pathShapes)
        })

        if (shapes.length === 0) {
          console.warn('No shapes found in SVG')
          return
        }

        const extrudeSettings: THREE.ExtrudeGeometryOptions = {
          depth: 0.15,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.02,
          bevelSegments: 2,
        }

        const geom = new THREE.ExtrudeGeometry(shapes, extrudeSettings)

        geom.center()

        geom.rotateX(Math.PI)
        geom.scale(0.01, 0.01, 0.01)

        setGeometry(geom)
      },
      undefined,
      (error) => {
        console.error('Error loading SVG:', error)
      }
    )

    return () => {
      if (geometry) {
        geometry.dispose()
      }
    }
  }, [svgPath])

  useFrame(() => {
    if (!meshRef.current || !enabled) return

    meshRef.current.rotation.y += 0.01

    const targetScale = hovered ? 1.3 : 1.0
    currentScale.current += (targetScale - currentScale.current) * 0.1
    meshRef.current.scale.setScalar(currentScale.current)

    const targetGlow = hovered ? glowIntensity * 3 : glowIntensity
    currentGlow.current += (targetGlow - currentGlow.current) * 0.1

    if (meshRef.current.material && 'emissiveIntensity' in meshRef.current.material) {
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = currentGlow.current
    }
  })

  if (!enabled || !geometry) return null

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry} renderOrder={1.5}>
      <meshStandardMaterial
        color="#ffffff"
        metalness={0.6}
        roughness={0.3}
        emissive={glowColor}
        emissiveIntensity={glowIntensity * 0.3}
      />
    </mesh>
  )
}

export default Logo3DSatellite
