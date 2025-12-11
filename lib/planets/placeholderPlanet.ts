import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const createPlaceholderPlanet = (
  id: string,
  position: [number, number, number],
  scale: number
): ProceduralPlanetConfig => ({
  id,
  name: `placeholder-${id}`,
  position,
  scale: scale * 0.067,

  terrain: {
    type: 'fractal',
    radius: 20.0,
    amplitude: 0.6,
    sharpness: 1.3,
    offset: -0.016,
    period: 0.9,
    persistence: 0.48,
    lacunarity: 1.9,
    octaves: 7,
  },

  colors: {
    color1: '#1a1a1a',
    color2: '#2a2a2a',
    color3: '#3a3a3a',
    color4: '#4a4a4a',
    color5: '#555555',
    transition2: 0.10,
    transition3: 0.25,
    transition4: 0.45,
    transition5: 0.65,
    blend12: 0.14,
    blend23: 0.16,
    blend34: 0.18,
    blend45: 0.20,
  },

  lighting: {
    ambientIntensity: 0.3,
    diffuseIntensity: 7.0,
    specularIntensity: 0.6,
    shininess: 5,
    lightDirection: [0.820, 0, 0.586],
    lightColor: '#ffffff',
    bumpStrength: 1.0,
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
});
