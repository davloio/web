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
}
