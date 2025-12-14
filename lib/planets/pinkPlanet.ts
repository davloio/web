import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const pinkPlanet: ProceduralPlanetConfig = {
  id: 'pink',
  name: 'projects-pink',
  position: [-154.5, 12, -90.6],
  scale: 0.2,

  terrain: {
    type: 'fractal',
    radius: 20.0,
    amplitude: 1.0,
    sharpness: 2.2,
    offset: -0.016,
    period: 0.8,
    persistence: 0.5,
    lacunarity: 2.0,
    octaves: 8,
  },

  colors: {
    color1: '#5A2E3A',
    color2: '#6B3A45',
    color3: '#7D4652',
    color4: '#8E525E',
    color5: '#9F5E6A',
    transition2: 0.08,
    transition3: 0.18,
    transition4: 0.35,
    transition5: 0.55,
    blend12: 0.12,
    blend23: 0.15,
    blend34: 0.18,
    blend45: 0.20,
  },

  lighting: {
    ambientIntensity: 0.3,
    diffuseIntensity: 7.0,
    specularIntensity: 0.8,
    shininess: 6,
    lightDirection: [0.820, 0, 0.586],
    lightColor: '#ffffff',
    bumpStrength: 1.2,
    bumpOffset: 0.001,
  },

  atmosphere: {
    enabled: false,
    particles: 3000,
    minParticleSize: 40,
    maxParticleSize: 80,
    radius: 4.2,
    thickness: 0.25,
    density: 0.0,
    opacity: 0.2,
    scale: 10,
    color: '#ff8db4',
    speed: 0.025,
  },

  modalBackgroundColor: '#C55A7D',
  modalTextColor: '#000000',
};
