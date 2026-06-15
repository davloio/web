import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const sigmaPlanet: ProceduralPlanetConfig = {
  id: 'sigma',
  name: 'projects-sigma',
  position: [-158.3, 19, -46.2],
  scale: 0.2,

  terrain: {
    type: 'fractal',
    radius: 20.0,
    amplitude: 1.3,
    sharpness: 2.5,
    offset: -0.016,
    period: 0.7,
    persistence: 0.5,
    lacunarity: 2.1,
    octaves: 10,
  },

  colors: {
    color1: '#4c1d95',
    color2: '#6d28d9',
    color3: '#8b5cf6',
    color4: '#a78bfa',
    color5: '#c4b5fd',
    transition2: 0.06,
    transition3: 0.16,
    transition4: 0.4,
    transition5: 0.62,
    blend12: 0.1,
    blend23: 0.14,
    blend34: 0.16,
    blend45: 0.18,
  },

  lighting: {
    ambientIntensity: 0.1,
    diffuseIntensity: 1.45,
    specularIntensity: 0.4,
    shininess: 8,
    lightColor: '#ffffff',
    bumpStrength: 1.2,
    bumpOffset: 0.001,
  },

  atmosphere: {
    enabled: true,
    particles: 2600,
    minParticleSize: 35,
    maxParticleSize: 75,
    radius: 4.25,
    thickness: 0.3,
    density: 0.0,
    opacity: 0.3,
    scale: 9,
    color: '#a78bfa',
    speed: 0.025,
  },

  rim: {
    enabled: true,
    color: '#a78bfa',
    intensity: 0.55,
    fresnelPower: 3.2,
  },

  modalBackgroundColor: '#1a0b30',
  modalTextColor: '#c4b5fd',
};
