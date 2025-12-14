export function createSeededRandom(initialSeed: number = 12345) {
  let seed = initialSeed;

  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}
