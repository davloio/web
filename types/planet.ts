export interface PlanetMetadata {
  title: string;
  description: string;
  tech: string[];
  link: string;
  features: string[];
  status: 'Live' | 'In Development' | 'Planned';
  image?: string;
}

export interface PlanetConfig {
  id: string;
  name: string;
  position: [number, number, number];
  scale: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  project?: PlanetMetadata;
}

export interface CloudConfig {
  cloudCount?: number;
  rotationSpeed?: number;
  cloudOpacity?: number;
  layerHeight?: number;
  cloudColor?: string;
}

export interface NetworkConfig {
  particleCount?: number;
  layerHeight?: number;
  connectionDistance?: number;
  rotationSpeed?: number;
  particleSize?: number;
  opacity?: number;
}

export interface LogoConfig {
  scale?: number;
  svgPath?: string;
  glowColor?: string;
  glowIntensity?: number;
  position?: [number, number, number];
}

export interface HolographicLogoConfig {
  streamCount?: number;
  streamHeight?: number;
  particleSpeed?: number;
  particleSize?: number;
  particleColor?: string;
  logoScale?: number;
  logoOpacity?: number;
  pulseSpeed?: number;
  distortionAmount?: number;
  svgPath?: string;
  text?: string;
  textSize?: number;
  disableHoverEffect?: boolean;
}

export interface Planet3DProps {
  position: [number, number, number];
  scale?: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  name: string;
  roughness?: number;
  metalness?: number;
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
  disableHover?: boolean;
  showLabel?: boolean;
  labelText?: string;
  zoomProgress?: number;
  textFadeStart?: number;
  textFadeRange?: number;
  glowColor?: string;
  showClouds?: boolean;
  show3DLogo?: boolean;
  cloudConfig?: CloudConfig;
  logoConfig?: LogoConfig;
  textureType?: 'rocky-dark' | 'rocky-gray';
  showParticleNetwork?: boolean;
  networkConfig?: NetworkConfig;
  showScanner?: boolean;
  showComingSoonOnHover?: boolean;
  showHolographicLogo?: boolean;
  holographicConfig?: HolographicLogoConfig;
}

export interface ProjectPlanetConfig {
  id: 'pink' | 'dark';
  position: [number, number, number];
  angle: number;
  scale: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
  name: string;
  glowColor: string;
  modalBackgroundColor: string;
  modalTextColor: string;
}

export interface PlaceholderPlanetConfig {
  position: [number, number, number];
  angle: number;
  scale: number;
  color: string;
}

export const PROJECT_PLANETS: ProjectPlanetConfig[] = [
  {
    id: 'pink',
    position: [-154.5, 12, -90.6],
    angle: 220,
    scale: 4,
    color: '#C55A7D',
    emissive: '#C55A7D',
    emissiveIntensity: 0.5,
    name: 'projects-pink',
    glowColor: '#C55A7D',
    modalBackgroundColor: '#C55A7D',
    modalTextColor: '#000000',
  },
  {
    id: 'dark',
    position: [-113.5, 17, -91.3],
    angle: 300,
    scale: 4,
    color: '#333333',
    emissive: '#333333',
    emissiveIntensity: 0.5,
    name: 'projects-dark',
    glowColor: '#333333',
    modalBackgroundColor: '#333333',
    modalTextColor: '#ffffff',
  },
];

export const PLACEHOLDER_PLANETS: PlaceholderPlanetConfig[] = [
  { position: [-158.3, 19, -46.2], angle: 140, scale: 3.5, color: '#999999' },
  { position: [-97.8, 13, -43.0], angle: 40, scale: 3, color: '#999999' },
  { position: [-83, 18, -70], angle: 0, scale: 3.5, color: '#999999' },
];

export const SOLAR_SYSTEM_CENTER = [-130, 15, -70] as const;
export const SOLAR_SYSTEM_RADIUS = 35;
export const OVERVIEW_DISTANCE = 25;
export const DETAIL_ZOOM_DISTANCE = 4.2;
