import { ProceduralPlanetConfig } from '@/types/proceduralPlanet';

export const createPlaceholderPlanet = (
  id: string,
  position: [number, number, number],
  scale: number
): ProceduralPlanetConfig => {
  const worldRadius = 20.0 * scale * 0.067;

  return {
    id,
    name: `placeholder-${id}`,
    position,
    scale: scale * 0.067,

    terrain: {
      type: 'fractal',
      radius: 20.0,
      amplitude: 0.55,
      sharpness: 1.6,
      offset: -0.016,
      period: 0.8,
      persistence: 0.5,
      lacunarity: 2.1,
      octaves: 9,
    },

    colors: {
      color1: '#1f1f24',
      color2: '#36363c',
      color3: '#4d4d52',
      color4: '#646468',
      color5: '#7d7d82',
      transition2: 0.06,
      transition3: 0.14,
      transition4: 0.24,
      transition5: 0.36,
      blend12: 0.06,
      blend23: 0.08,
      blend34: 0.10,
      blend45: 0.12,
    },

    lighting: {
      ambientIntensity: 0.1,
      diffuseIntensity: 1.3,
      specularIntensity: 0.08,
      shininess: 3,
      lightColor: '#ffffff',
      bumpStrength: 1.1,
      bumpOffset: 0.001,
    },

    atmosphere: {
      enabled: true,
      particles: 1200,
      minParticleSize: 25,
      maxParticleSize: 55,
      radius: worldRadius * 1.06,
      thickness: worldRadius * 0.08,
      density: -0.2,
      opacity: 0.15,
      scale: 10,
      color: '#9a9aa0',
      speed: 0.015,
    },

    rim: {
      enabled: false,
      color: '#9a9aa0',
      intensity: 0.0,
      fresnelPower: 3.0,
    },

    modalBackgroundColor: '#333333',
    modalTextColor: '#ffffff',
  };
};
