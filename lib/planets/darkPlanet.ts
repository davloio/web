import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const darkPlanet: ProceduralPlanetConfig = {
  id: 'dark',
  name: 'projects-dark',
  position: [-113.5, 17, -91.3],
  scale: 0.2,

  terrain: {
    type: 'ridged',
    radius: 20.0,
    amplitude: 1.1,
    sharpness: 2.4,
    offset: -0.02,
    period: 1.0,
    persistence: 0.48,
    lacunarity: 2.2,
    octaves: 8,
  },

  colors: {
    color1: '#08080d',
    color2: '#16161f',
    color3: '#2b2b3a',
    color4: '#4a4a63',
    color5: '#9aa3c2',
    transition2: 0.12,
    transition3: 0.30,
    transition4: 0.55,
    transition5: 0.80,
    blend12: 0.08,
    blend23: 0.12,
    blend34: 0.15,
    blend45: 0.18,
  },

  lighting: {
    ambientIntensity: 0.1,
    diffuseIntensity: 1.5,
    specularIntensity: 0.6,
    shininess: 14,
    lightColor: '#ffffff',
    bumpStrength: 1.3,
    bumpOffset: 0.001,
  },

  atmosphere: {
    enabled: true,
    particles: 2200,
    minParticleSize: 30,
    maxParticleSize: 70,
    radius: 4.3,
    thickness: 0.3,
    density: -0.15,
    opacity: 0.25,
    scale: 11,
    color: '#8fa6c9',
    speed: 0.02,
  },

  rim: {
    enabled: true,
    color: '#6d86b8',
    intensity: 0.45,
    fresnelPower: 3.4,
  },

  modalBackgroundColor: '#333333',
  modalTextColor: '#ffffff',
};
