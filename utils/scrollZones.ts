/**
 * Scroll zone definitions for parallax planet navigation
 * Each zone represents a different view state in the experience
 */

export const SCROLL_ZONES = {
  /** Initial hero view with title and slogan */
  HERO: { start: 0, end: 20, name: 'hero' as const },

  /** Zooming into white planet (davlo.io about section) */
  WHITE_PLANET_ZOOM: { start: 20, end: 25, name: 'white-planet' as const },

  /** Transition from white planet to solar system view */
  SOLAR_TRANSITION: { start: 25, end: 45, name: 'solar-transition' as const },

  /** Solar system overview - all 5 planets visible */
  SOLAR_OVERVIEW: { start: 45, end: 55, name: 'solar-overview' as const },

  /** Individual planet focus zones (rotation through solar system) */
  PLANET_1: { start: 55, end: 64, name: 'planet-taiko' as const },
  PLANET_2: { start: 64, end: 73, name: 'planet-2' as const },
  PLANET_3: { start: 73, end: 82, name: 'planet-3' as const },
  PLANET_4: { start: 82, end: 91, name: 'planet-4' as const },
  PLANET_5: { start: 91, end: 100, name: 'planet-5' as const },
} as const;

export type ScrollZoneName = typeof SCROLL_ZONES[keyof typeof SCROLL_ZONES]['name'];

/**
 * Get the current scroll zone based on progress percentage
 * @param progress - Scroll progress from 0-100
 * @returns The name of the current scroll zone
 */
export function getScrollZone(progress: number): ScrollZoneName {
  for (const zone of Object.values(SCROLL_ZONES)) {
    if (progress >= zone.start && progress < zone.end) {
      return zone.name;
    }
  }

  // Default to last zone if at 100%
  if (progress >= 100) {
    return SCROLL_ZONES.PLANET_5.name;
  }

  return SCROLL_ZONES.HERO.name;
}

/**
 * Get normalized progress within a specific zone (0-1)
 * @param progress - Global scroll progress (0-100)
 * @param zoneName - Name of the zone
 * @returns Progress within zone (0-1), or null if not in zone
 */
export function getZoneProgress(progress: number, zoneName: ScrollZoneName): number | null {
  const zone = Object.values(SCROLL_ZONES).find(z => z.name === zoneName);
  if (!zone) return null;

  if (progress < zone.start || progress >= zone.end) return null;

  const zoneRange = zone.end - zone.start;
  return (progress - zone.start) / zoneRange;
}
