'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { HolographicLogoConfig } from '@/types/planet'

export interface HolographicLogoProps extends HolographicLogoConfig {
  planetRadius: number
  planetScale: number
  hovered: boolean
}

const HolographicLogo = ({
  planetRadius,
  hovered,
  streamCount = 6,
  streamHeight = 1.8,
  particleSpeed = 0.01,
  particleSize = 0.08,
  particleColor = '#ffffff',
  logoScale = 0.6,
  logoOpacity = 0.25,
  pulseSpeed = 1.5,
  svgPath = '/logo-white.svg',
  text,
  textSize = 0.15,
  disableHoverEffect = false,
}: HolographicLogoProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const logoSpriteRef = useRef<THREE.Sprite>(null)
  const textSpriteRef = useRef<THREE.Sprite>(null)
  const particlePositionsRef = useRef<Float32Array | null>(null)
  const currentOpacity = useRef(logoOpacity)
  const currentScale = useRef(logoScale)
  const [logoTexture, setLogoTexture] = useState<THREE.CanvasTexture | null>(null)
  const [textTexture, setTextTexture] = useState<THREE.CanvasTexture | null>(null)

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      const ctx = canvas.getContext('2d')!

      const logoSize = 600
      const centerX = 512
      const centerY = 512

      ctx.clearRect(0, 0, 1024, 1024)

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.drawImage(img, -logoSize / 2, -logoSize / 2, logoSize, logoSize)
      ctx.restore()

      const imageData = ctx.getImageData(0, 0, 1024, 1024)
      const data = imageData.data

      for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
          const idx = (y * 1024 + x) * 4

          if (y % 3 === 0) {
            data[idx + 3] = data[idx + 3] * 0.7
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)

      ctx.shadowBlur = 20
      ctx.shadowColor = particleColor
      ctx.globalCompositeOperation = 'screen'
      ctx.globalAlpha = 0.3
      ctx.drawImage(canvas, 0, 0)

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      setLogoTexture(texture)
    }

    img.onerror = () => {
      console.error('Failed to load logo image:', svgPath)
    }

    img.src = svgPath
  }, [svgPath, particleColor])

  useEffect(() => {
    if (!text) return

    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, 2048, 512)

    ctx.font = '700 200px nexa, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = particleColor

    ctx.shadowBlur = 30
    ctx.shadowColor = particleColor
    ctx.fillText(text.toUpperCase(), 1024, 256)

    for (let y = 0; y < 512; y++) {
      if (y % 3 === 0) {
        const imageData = ctx.getImageData(0, y, 2048, 1)
        const data = imageData.data
        for (let i = 3; i < data.length; i += 4) {
          data[i] = data[i] * 0.7
        }
        ctx.putImageData(imageData, 0, y)
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    setTextTexture(texture)
  }, [text, particleColor])

  const { geometry, minHeight, maxHeight } = useMemo(() => {
    const particlesPerStream = 18
    const totalParticles = streamCount * particlesPerStream

    const positions = new Float32Array(totalParticles * 3)
    const opacities = new Float32Array(totalParticles)

    const equatorRadius = planetRadius * 1.03
    const minHeight = equatorRadius
    const maxHeight = planetRadius * streamHeight

    let seed = 12345
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < streamCount; i++) {
      const angle = (i / streamCount) * Math.PI * 2
      const x = Math.cos(angle) * equatorRadius
      const z = Math.sin(angle) * equatorRadius

      for (let j = 0; j < particlesPerStream; j++) {
        const idx = i * particlesPerStream + j
        const t = j / particlesPerStream
        const randomOffset = seededRandom() * 0.3

        positions[idx * 3] = x
        positions[idx * 3 + 1] = minHeight + (maxHeight - minHeight) * (t + randomOffset)
        positions[idx * 3 + 2] = z

        opacities[idx] = 1
      }
    }

    particlePositionsRef.current = positions

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('alpha', new THREE.BufferAttribute(opacities, 1))

    return { geometry, minHeight, maxHeight }
  }, [streamCount, planetRadius, streamHeight])

  useFrame(({ clock }) => {
    if (!particlePositionsRef.current || !groupRef.current) return

    const positions = particlePositionsRef.current
    const time = clock.getElapsedTime()

    for (let i = 0; i < positions.length / 3; i++) {
      let y = positions[i * 3 + 1]
      y += particleSpeed

      if (y > maxHeight) {
        y = minHeight
      }

      positions[i * 3 + 1] = y

      const heightProgress = (y - minHeight) / (maxHeight - minHeight)
      const fadeIn = Math.min(1, heightProgress / 0.2)
      const fadeOut = heightProgress > 0.8 ? Math.max(0, 1 - (heightProgress - 0.8) / 0.2) : 1
      const opacity = fadeIn * fadeOut

      const alphaAttr = geometry.getAttribute('alpha')
      if (alphaAttr) {
        alphaAttr.setX(i, opacity)
      }
    }

    geometry.getAttribute('position').needsUpdate = true
    const alphaAttr = geometry.getAttribute('alpha')
    if (alphaAttr) {
      alphaAttr.needsUpdate = true
    }

    if (logoSpriteRef.current && logoTexture) {
      const basePulse = Math.sin(time * pulseSpeed) * 0.1 + 0.9
      let targetScale = logoScale

      let targetOpacity = logoOpacity * basePulse
      if (hovered && !disableHoverEffect) {
        targetOpacity *= 1.3
        targetScale *= 1.1
      }

      currentOpacity.current += (targetOpacity - currentOpacity.current) * 0.1
      currentScale.current += (targetScale - currentScale.current) * 0.1

      logoSpriteRef.current.material.opacity = currentOpacity.current
      logoSpriteRef.current.rotation.z = time * 0.001
    }

    if (textSpriteRef.current && textTexture) {
      const textOpacity = currentOpacity.current
      textSpriteRef.current.material.opacity = textOpacity
    }
  })

  const logoPosition: [number, number, number] = [0, planetRadius * streamHeight, 0]
  const textPosition: [number, number, number] = [0, planetRadius * streamHeight - 0.35, 0]

  return (
    <group ref={groupRef}>
      <points geometry={geometry} renderOrder={1.8}>
        <pointsMaterial
          size={particleSize}
          map={particleTexture}
          transparent
          opacity={1.0}
          color={particleColor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          vertexColors={false}
        />
      </points>

      {logoTexture && (
        <sprite ref={logoSpriteRef} position={logoPosition} scale={currentScale.current} renderOrder={1.8}>
          <spriteMaterial
            map={logoTexture}
            transparent
            opacity={currentOpacity.current}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={true}
          />
        </sprite>
      )}

      {textTexture && text && (
        <sprite ref={textSpriteRef} position={textPosition} scale={[textSize * 4, textSize, 1]} renderOrder={1.85}>
          <spriteMaterial
            map={textTexture}
            transparent
            opacity={currentOpacity.current}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={true}
          />
        </sprite>
      )}
    </group>
  )
}

export default HolographicLogo
