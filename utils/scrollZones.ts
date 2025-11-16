export const SCROLL_ZONES = {
  HERO: { start: 0, end: 20, name: 'hero' as const },

  WHITE_PLANET_ZOOM: { start: 20, end: 25, name: 'white-planet' as const },

  SOLAR_TRANSITION: { start: 25, end: 45, name: 'solar-transition' as const },

  SOLAR_OVERVIEW: { start: 45, end: 55, name: 'solar-overview' as const },

  PLANET_1: { start: 55, end: 64, name: 'planet-taiko' as const },
  PLANET_2: { start: 64, end: 73, name: 'planet-2' as const },
  PLANET_3: { start: 73, end: 82, name: 'planet-3' as const },
  PLANET_4: { start: 82, end: 91, name: 'planet-4' as const },
  PLANET_5: { start: 91, end: 100, name: 'planet-5' as const },
} as const;

export type ScrollZoneName = typeof SCROLL_ZONES[keyof typeof SCROLL_ZONES]['name'];

export function getScrollZone(progress: number): ScrollZoneName {
  for (const zone of Object.values(SCROLL_ZONES)) {
    if (progress >= zone.start && progress < zone.end) {
      return zone.name;
    }
  }

  if (progress >= 100) {
    return SCROLL_ZONES.PLANET_5.name;
  }

  return SCROLL_ZONES.HERO.name;
}

export function getZoneProgress(progress: number, zoneName: ScrollZoneName): number | null {
  const zone = Object.values(SCROLL_ZONES).find(z => z.name === zoneName);
  if (!zone) return null;

  if (progress < zone.start || progress >= zone.end) return null;

  const zoneRange = zone.end - zone.start;
  return (progress - zone.start) / zoneRange;
}
