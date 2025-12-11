// TypeScript Type Definitions for Procedural Planet System

export type TerrainType = 'simplex' | 'fractal' | 'ridged';

export interface ProceduralTerrainParams {
  type: TerrainType; // Maps to 1=simplex, 2=fractal, 3=ridged in shader
  radius: number; // Base planet radius
  amplitude: number; // Height variation scale (0.05-0.2)
  sharpness: number; // Terrain roughness/power exponent (1.5-5.0)
  offset: number; // Height baseline adjustment (-0.05 to 0.0)
  period: number; // Noise frequency/zoom level (0.4-1.2)
  persistence: number; // Per-octave amplitude decay (0-1)
  lacunarity: number; // Per-octave frequency multiplier (1-3)
  octaves: number; // Number of noise layers (6-10)
}

export interface ProceduralColorParams {
  color1: string; // Deepest layer (e.g., deep ocean) - hex color
  color2: string; // Second layer (e.g., shallow water)
  color3: string; // Third layer (e.g., beaches/plains)
  color4: string; // Fourth layer (e.g., vegetation/lowlands)
  color5: string; // Highest layer (e.g., mountain peaks) - hex color

  // Elevation thresholds where colors transition
  transition2: number; // Where color2 starts appearing
  transition3: number; // Where color3 starts appearing
  transition4: number; // Where color4 starts appearing
  transition5: number; // Where color5 starts appearing

  // Blend ranges for smooth color transitions
  blend12: number; // Blend range between color1 and color2
  blend23: number; // Blend range between color2 and color3
  blend34: number; // Blend range between color3 and color4
  blend45: number; // Blend range between color4 and color5
}

export interface ProceduralLightingParams {
  ambientIntensity: number; // Base light level (0.01-0.1)
  diffuseIntensity: number; // Surface light response (0.8-1.2)
  specularIntensity: number; // Shiny reflection strength (0.5-3.0)
  shininess: number; // Reflection sharpness (3-15)
  lightDirection: [number, number, number]; // Direction vector (normalized)
  lightColor: string; // Light color - hex
  bumpStrength: number; // Normal detail intensity (0-1.2)
  bumpOffset: number; // Height sampling offset (0.0001-0.002)
}

export interface ProceduralAtmosphereParams {
  enabled: boolean; // Whether to render atmosphere
  particles: number; // Number of cloud particles (2000-5000)
  minParticleSize: number; // Minimum point size in pixels (30-60)
  maxParticleSize: number; // Maximum point size in pixels (60-120)
  radius: number; // Shell distance from planet center (planetRadius + offset)
  thickness: number; // Atmospheric depth (0.8-1.8)
  density: number; // Noise density influence (-0.3 to 0.3)
  opacity: number; // Base transparency (0.2-0.4)
  scale: number; // Noise scale (5-10)
  color: string; // Cloud color - hex
  speed: number; // Animation speed (0.01-0.04)
}

export interface ProceduralPlanetConfig {
  id: string; // Unique identifier
  name: string; // Display name
  position: [number, number, number]; // World position
  scale: number; // Overall scale multiplier

  // Procedural generation params
  terrain: ProceduralTerrainParams;
  colors: ProceduralColorParams;
  lighting: ProceduralLightingParams;
  atmosphere: ProceduralAtmosphereParams;

  // Interactive properties (preserve from existing system)
  onClick?: () => void; // Click handler
  onHover?: (isHovered: boolean) => void; // Hover state callback
  disableHover?: boolean; // Disable hover interactions

  // Modal system integration
  modalBackgroundColor?: string; // Background color for modal
  modalTextColor?: string; // Text color for modal

  // Solar system layout (for project/placeholder planets)
  angle?: number; // Angle in degrees for solar system positioning
}
