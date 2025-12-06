import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const pinkPlanet: ProceduralPlanetConfig = {
  id: 'pink',
  name: 'projects-pink',
  position: [-154.5, 12, -90.6],
  scale: 0.2,

  terrain: {
    type: 'fractal',
    radius: 20.0,
    amplitude: 0.12,
    sharpness: 1.8,
    offset: -0.005,
    period: 1.2,
    persistence: 0.55,
    lacunarity: 1.6,
    octaves: 6,
  },

  colors: {
    color1: '#9B3D5A',
    color2: '#B44A6D',
    color3: '#C55A7D',
    color4: '#D16A8D',
    color5: '#DD7A9D',
    transition2: 0.03,
    transition3: 0.08,
    transition4: 0.15,
    transition5: 0.25,
    blend12: 0.08,
    blend23: 0.10,
    blend34: 0.12,
    blend45: 0.15,
  },

  lighting: {
    ambientIntensity: 0.5,
    diffuseIntensity: 6.0,
    specularIntensity: 1.5,
    shininess: 8,
    lightDirection: [0.820, 0, 0.586],
    lightColor: '#ffffff',
    bumpStrength: 0.6,
    bumpOffset: 0.001,
  },

  atmosphere: {
    enabled: true,
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
