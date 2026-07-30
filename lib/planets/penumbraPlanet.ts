import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const penumbraPlanet: ProceduralPlanetConfig = {
  id: 'penumbra',
  name: 'projects-penumbra',
  position: [-83, 18, -70],
  scale: 0.2,

  terrain: {
    type: 'fractal',
    radius: 20.0,
    amplitude: 1.3,
    sharpness: 2.5,
    offset: -0.016,
    period: 0.7,
    persistence: 0.5,
    lacunarity: 2.05,
    octaves: 10,
  },

  colors: {
    color1: '#0a0806',
    color2: '#1c140f',
    color3: '#33221a',
    color4: '#4d3324',
    color5: '#6b4a33',
    transition2: 0.06,
    transition3: 0.16,
    transition4: 0.3,
    transition5: 0.48,
    blend12: 0.08,
    blend23: 0.12,
    blend34: 0.14,
    blend45: 0.16,
  },

  lighting: {
    ambientIntensity: 0.08,
    diffuseIntensity: 1.35,
    specularIntensity: 0.18,
    shininess: 5,
    lightColor: '#ffffff',
    bumpStrength: 1.25,
    bumpOffset: 0.001,
  },

  atmosphere: {
    enabled: true,
    particles: 2200,
    minParticleSize: 30,
    maxParticleSize: 65,
    radius: 4.25,
    thickness: 0.28,
    density: 0.0,
    opacity: 0.22,
    scale: 9,
    color: '#8a6a4a',
    speed: 0.02,
  },

  rim: {
    enabled: true,
    color: '#a67c52',
    intensity: 0.4,
    fresnelPower: 3.2,
  },

  modalBackgroundColor: '#14100c',
  modalTextColor: '#c9a072',
};
