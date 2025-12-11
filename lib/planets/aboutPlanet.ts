// Configuration for the About Planet (Earth-like)
// This serves as the template for other procedural planets

import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const aboutPlanet: ProceduralPlanetConfig = {
  id: 'about',
  name: 'davlo.io',
  position: [-15, 0, 0],
  scale: 0.2, // Scale down from radius=20 to final size ~4 units (20 * 0.2 = 4)

  // EXACT parameters from threejs-procedural-planets demo
  terrain: {
    type: 'fractal', // type: 2 in original
    radius: 20.0, // Original uses 20.0
    amplitude: 1.19, // Original amplitude
    sharpness: 2.6,
    offset: -0.016,
    period: 0.6,
    persistence: 0.484,
    lacunarity: 1.8,
    octaves: 10,
  },

  // EXACT color values from demo (converted from RGB 0-1 range to hex)
  // Original uses THREE.Color(r, g, b) with values in 0-1 range
  colors: {
    color1: '#041e47', // Deep ocean blue - THREE.Color(0.014, 0.117, 0.279) = rgb(4, 30, 71)
    color2: '#148759', // Teal - THREE.Color(0.080, 0.527, 0.351) = rgb(20, 134, 90)
    color3: '#9e835f', // Sandy - THREE.Color(0.620, 0.516, 0.372) = rgb(158, 132, 95)
    color4: '#264115', // Forest green - THREE.Color(0.149, 0.254, 0.084) = rgb(38, 65, 21)
    color5: '#262626', // Gray peaks - THREE.Color(0.150, 0.150, 0.150) = rgb(38, 38, 38)

    // EXACT transition values from demo
    transition2: 0.071,
    transition3: 0.215,
    transition4: 0.372,
    transition5: 1.2,

    // EXACT blend values from demo
    blend12: 0.152,
    blend23: 0.152,
    blend34: 0.104,
    blend45: 0.168,
  },

  lighting: {
    ambientIntensity: 0.02,
    diffuseIntensity: 1.0,
    specularIntensity: 2.0,
    shininess: 10,
    lightDirection: [0.577, 0.577, 0.577],
    lightColor: '#ffffff',
    bumpStrength: 1.0,
    bumpOffset: 0.001,
  },

  // EXACT atmosphere from demo
  atmosphere: {
    enabled: true,
    particles: 4000,
    minParticleSize: 50,
    maxParticleSize: 100,
    radius: 4.2,
    thickness: 0.3,
    density: 0.0,
    opacity: 0.35,
    scale: 8,
    color: '#ffffff',
    speed: 0.03,
  },

  // Modal integration
  modalBackgroundColor: '#ffffff',
  modalTextColor: '#000000',
};
