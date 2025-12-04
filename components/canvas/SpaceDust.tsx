'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface SpaceDustProps {
  count?: number
  size?: number
  opacity?: number
  color?: string
  spread?: number
  driftSpeed?: number
}

const SpaceDust = ({
  count = 800,
  size = 0.08,
  opacity = 0.15,
  color = '#ffffff',
  spread = 200,
  driftSpeed = 0.01,
}: SpaceDustProps) => {
  const pointsRef = useRef<THREE.Points>(null)
  const { camera } = useThree()

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)

    return new THREE.CanvasTexture(canvas)
  }, [])

  const [positions, velocities, layers] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const layers = new Float32Array(count)

    let seed = 98765
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < count; i++) {
      const layer = seededRandom()
      layers[i] = layer

      positions[i * 3] = (seededRandom() - 0.5) * spread * 2
      positions[i * 3 + 1] = (seededRandom() - 0.5) * spread * 2
      positions[i * 3 + 2] = (seededRandom() - 0.5) * spread * 2

      velocities[i * 3] = (seededRandom() - 0.5) * driftSpeed
      velocities[i * 3 + 1] = (seededRandom() - 0.5) * driftSpeed
      velocities[i * 3 + 2] = (seededRandom() - 0.5) * driftSpeed
    }

    return [positions, velocities, layers]
  }, [count, spread, driftSpeed])

  useFrame((state) => {
    if (!pointsRef.current) return

    const positionAttribute = pointsRef.current.geometry.attributes.position
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      positionAttribute.array[i * 3] += velocities[i * 3]
      positionAttribute.array[i * 3 + 1] += velocities[i * 3 + 1]
      positionAttribute.array[i * 3 + 2] += velocities[i * 3 + 2]

      const layer = layers[i]
      const parallaxFactor = (1 - layer) * 0.002

      const cameraOffset = new THREE.Vector3()
      cameraOffset.copy(camera.position)
      cameraOffset.multiplyScalar(parallaxFactor)

      if (Math.abs(positionAttribute.array[i * 3]) > spread) {
        positionAttribute.array[i * 3] = -Math.sign(positionAttribute.array[i * 3]) * spread
      }
      if (Math.abs(positionAttribute.array[i * 3 + 1]) > spread) {
        positionAttribute.array[i * 3 + 1] = -Math.sign(positionAttribute.array[i * 3 + 1]) * spread
      }
      if (Math.abs(positionAttribute.array[i * 3 + 2]) > spread) {
        positionAttribute.array[i * 3 + 2] = -Math.sign(positionAttribute.array[i * 3 + 2]) * spread
      }
    }

    positionAttribute.needsUpdate = true
  })

  return (
    <points ref={pointsRef} renderOrder={0.1}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
        map={particleTexture}
        alphaTest={0.01}
      />
    </points>
  )
}

export default SpaceDust
