import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const darkPlanet: ProceduralPlanetConfig = {
  id: 'dark',
  name: 'projects-dark',
  position: [-113.5, 17, -91.3],
  scale: 0.2,

  terrain: {
    type: 'fractal',
    radius: 20.0,
    amplitude: 0.15,
    sharpness: 2.0,
    offset: -0.008,
    period: 1.0,
    persistence: 0.50,
    lacunarity: 1.7,
    octaves: 7,
  },

  colors: {
    color1: '#1a1a1a',
    color2: '#262626',
    color3: '#333333',
    color4: '#404040',
    color5: '#4d4d4d',
    transition2: 0.04,
    transition3: 0.10,
    transition4: 0.18,
    transition5: 0.28,
    blend12: 0.09,
    blend23: 0.11,
    blend34: 0.13,
    blend45: 0.16,
  },

  lighting: {
    ambientIntensity: 0.5,
    diffuseIntensity: 6.0,
    specularIntensity: 1.2,
    shininess: 6,
    lightDirection: [0.820, 0, 0.586],
    lightColor: '#ffffff',
    bumpStrength: 0.8,
    bumpOffset: 0.001,
  },

  atmosphere: {
    enabled: true,
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
