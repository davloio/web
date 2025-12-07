'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface CloudLayerProps {
  planetRadius?: number
  planetScale?: number
  cloudCount?: number
  rotationSpeed?: number
  cloudOpacity?: number
  layerHeight?: number
  cloudColor?: string
  hovered?: boolean
  enabled?: boolean
}

const CloudLayer = ({
  planetRadius = 1,
  planetScale = 1,
  cloudCount = 20,
  rotationSpeed = 0.0008,
  cloudOpacity = 0.85,
  layerHeight = 1.03,
  cloudColor = '#ffffff',
  hovered = false,
  enabled = true,
}: CloudLayerProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const currentSpeed = useRef(rotationSpeed)
  const spriteRefs = useRef<(THREE.Sprite | null)[]>([])

  const createCloudTexture = (seed: number, color: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, 512, 512)

    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)

    const random = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    const numMainPuffs = 8 + Math.floor(random() * 8)
    for (let i = 0; i < numMainPuffs; i++) {
      const offsetX = (random() - 0.5) * 220
      const offsetY = (random() - 0.5) * 220
      const size = 50 + random() * 90

      const gradient = ctx.createRadialGradient(
        256 + offsetX, 256 + offsetY, size * 0.15,
        256 + offsetX, 256 + offsetY, size
      )

      const innerAlpha = 0.95 + random() * 0.05
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${innerAlpha})`)
      gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${0.75 + random() * 0.15})`)
      gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${0.5 + random() * 0.2})`)
      gradient.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, ${0.25 + random() * 0.15})`)
      gradient.addColorStop(0.9, `rgba(${r}, ${g}, ${b}, ${0.05 + random() * 0.1})`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 512, 512)
    }

    const numDetailPuffs = 10 + Math.floor(random() * 10)
    for (let i = 0; i < numDetailPuffs; i++) {
      const offsetX = (random() - 0.5) * 180
      const offsetY = (random() - 0.5) * 180
      const size = 30 + random() * 50

      const gradient = ctx.createRadialGradient(
        256 + offsetX, 256 + offsetY, 0,
        256 + offsetX, 256 + offsetY, size
      )

      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.6 + random() * 0.3})`)
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.2 + random() * 0.2})`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 512, 512)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }

  const cloudData = useMemo(() => {
    const clouds = []
    for (let i = 0; i < cloudCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const radiusVariation = 0.1
      const radius = planetRadius * layerHeight * (1 + (Math.random() - 0.5) * radiusVariation)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      clouds.push({
        position: new THREE.Vector3(x, y, z),
        scale: 0.3 + Math.random() * 0.4,
        scaleX: 1.2 + Math.random() * 0.6,
        scaleY: 0.5 + Math.random() * 0.3,
        texture: createCloudTexture(i * 1000 + Math.random() * 1000, cloudColor),
      })
    }
    return clouds
  }, [planetRadius, cloudCount, layerHeight, cloudColor])


  useFrame(() => {
    if (!groupRef.current || !enabled) return

    const targetSpeed = hovered ? rotationSpeed * 3 : rotationSpeed
    currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.1

    groupRef.current.rotation.y += currentSpeed.current

    spriteRefs.current.forEach((sprite, i) => {
      if (sprite && cloudData[i]) {
        const normal = cloudData[i].position.clone().normalize()

        const worldUp = Math.abs(normal.y) < 0.999
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(1, 0, 0)

        const right = new THREE.Vector3().crossVectors(worldUp, normal).normalize()
        const up = new THREE.Vector3().crossVectors(normal, right).normalize()

        const matrix = new THREE.Matrix4()
        matrix.makeBasis(right, up, normal)

        sprite.quaternion.setFromRotationMatrix(matrix)
      }
    })
  })

  if (!enabled) return null

  return (
    <group ref={groupRef} scale={planetScale}>
      {cloudData.map((cloud, i) => (
        <sprite
          key={i}
          ref={(el) => { spriteRefs.current[i] = el }}
          position={cloud.position}
          scale={[cloud.scale * cloud.scaleX, cloud.scale * cloud.scaleY, 1]}
          renderOrder={0.5}
        >
          <spriteMaterial
            map={cloud.texture}
            transparent={true}
            opacity={cloudOpacity}
            depthWrite={false}
            depthTest={true}
          />
        </sprite>
      ))}
    </group>
  )
}

export default CloudLayer
