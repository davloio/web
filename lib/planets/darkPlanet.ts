import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const darkPlanet: ProceduralPlanetConfig = {
  id: 'dark',
  name: 'projects-dark',
  position: [-113.5, 17, -91.3],
  scale: 0.2,

  terrain: {
    type: 'fractal',
    radius: 20.0,
    amplitude: 1.35,
    sharpness: 2.2,
    offset: -0.020,
    period: 1.2,
    persistence: 0.45,
    lacunarity: 2.3,
    octaves: 5,
  },

  colors: {
    color1: '#0a0a12',
    color2: '#151520',
    color3: '#2a2a35',
    color4: '#404050',
    color5: '#5a5a68',
    transition2: 0.15,
    transition3: 0.35,
    transition4: 0.58,
    transition5: 0.75,
    blend12: 0.08,
    blend23: 0.12,
    blend34: 0.15,
    blend45: 0.18,
  },

  lighting: {
    ambientIntensity: 0.25,
    diffuseIntensity: 7.5,
    specularIntensity: 0.8,
    shininess: 8,
    lightDirection: [0.820, 0, 0.586],
    lightColor: '#ffffff',
    bumpStrength: 1.3,
    bumpOffset: 0.001,
  },

  atmosphere: {
    enabled: false,
    particles: 2500,
    minParticleSize: 35,
    maxParticleSize: 70,
    radius: 4.2,
    thickness: 0.22,
    density: 0.0,
    opacity: 0.15,
    scale: 12,
    color: '#6b8fb8',
    speed: 0.02,
  },

  modalBackgroundColor: '#333333',
  modalTextColor: '#ffffff',
};
