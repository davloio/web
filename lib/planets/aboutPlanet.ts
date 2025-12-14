import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const aboutPlanet: ProceduralPlanetConfig = {
  id: 'about',
  name: 'davlo.io',
  position: [-15, 0, 0],
  scale: 0.2,

  terrain: {
    type: 'fractal',
    radius: 20.0,
    amplitude: 1.19,
    sharpness: 2.6,
    offset: -0.016,
    period: 0.6,
    persistence: 0.484,
    lacunarity: 1.8,
    octaves: 10,
  },

  colors: {
    color1: '#041e47',
    color2: '#148759',
    color3: '#9e835f',
    color4: '#264115',
    color5: '#262626',

    transition2: 0.071,
    transition3: 0.215,
    transition4: 0.372,
    transition5: 1.2,

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

  modalBackgroundColor: '#ffffff',
  modalTextColor: '#000000',
};
