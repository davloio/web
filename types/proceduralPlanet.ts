export type TerrainType = 'simplex' | 'fractal' | 'ridged';

export interface ProceduralTerrainParams {
  type: TerrainType;
  radius: number;
  amplitude: number;
  sharpness: number;
  offset: number;
  period: number;
  persistence: number;
  lacunarity: number;
  octaves: number;
}

export interface ProceduralColorParams {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;

  transition2: number;
  transition3: number;
  transition4: number;
  transition5: number;

  blend12: number;
  blend23: number;
  blend34: number;
  blend45: number;
}

export interface ProceduralLightingParams {
  ambientIntensity: number;
  diffuseIntensity: number;
  specularIntensity: number;
  shininess: number;
  lightDirection: [number, number, number];
  lightColor: string;
  bumpStrength: number;
  bumpOffset: number;
}

export interface ProceduralAtmosphereParams {
  enabled: boolean;
  particles: number;
  minParticleSize: number;
  maxParticleSize: number;
  radius: number;
  thickness: number;
  density: number;
  opacity: number;
  scale: number;
  color: string;
  speed: number;
}

export interface ProceduralPlanetConfig {
  id: string;
  name: string;
  position: [number, number, number];
  scale: number;

  terrain: ProceduralTerrainParams;
  colors: ProceduralColorParams;
  lighting: ProceduralLightingParams;
  atmosphere: ProceduralAtmosphereParams;

  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
  disableHover?: boolean;

  modalBackgroundColor?: string;
  modalTextColor?: string;

  angle?: number;
}
