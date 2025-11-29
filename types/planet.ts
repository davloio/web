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
    position: [-156.8, 12, -92.5],
    angle: 220,
    scale: 4,
    color: '#DB7093',
    emissive: '#DB7093',
    emissiveIntensity: 0.5,
    name: 'projects-pink',
    glowColor: '#DB7093',
    modalBackgroundColor: '#DB7093',
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
  { position: [-156.8, 19, -47.5], angle: 140, scale: 3.5, color: '#999999' },
  { position: [-103.2, 13, -47.5], angle: 40, scale: 3, color: '#999999' },
  { position: [-95, 18, -70], angle: 0, scale: 3.5, color: '#999999' },
];

export const SOLAR_SYSTEM_CENTER = [-130, 15, -70] as const;
export const SOLAR_SYSTEM_RADIUS = 35;
export const OVERVIEW_DISTANCE = 25;
export const DETAIL_ZOOM_DISTANCE = 4.2;
