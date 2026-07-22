import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const rsgoPlanet: ProceduralPlanetConfig = {
  id: 'rsgo',
  name: 'projects-rsgo',
  position: [-97.8, 13, -43.0],
  scale: 0.2,

  terrain: {
    type: 'fractal',
    radius: 20.0,
    amplitude: 1.28,
    sharpness: 2.6,
    offset: -0.016,
    period: 0.68,
    persistence: 0.5,
    lacunarity: 2.05,
    octaves: 10,
  },

  colors: {
    color1: '#5c2c08',
    color2: '#9a4f12',
    color3: '#d17a1a',
    color4: '#f59e2e',
    color5: '#ffdba3',
    transition2: 0.05,
    transition3: 0.15,
    transition4: 0.32,
    transition5: 0.5,
    blend12: 0.10,
    blend23: 0.14,
    blend34: 0.16,
    blend45: 0.18,
  },

  lighting: {
    ambientIntensity: 0.16,
    diffuseIntensity: 1.55,
    specularIntensity: 0.3,
    shininess: 6,
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
    color: '#ffb877',
    speed: 0.025,
  },

  rim: {
    enabled: true,
    color: '#ff9640',
    intensity: 0.5,
    fresnelPower: 3.3,
  },

  modalBackgroundColor: '#0a0e1a',
  modalTextColor: '#ff8c42',
};
