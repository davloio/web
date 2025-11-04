'use client';

import { useState, useEffect, useMemo } from 'react';

export default function DecorativePlanet() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Generate asteroids with fixed seed to avoid hydration issues
  const asteroids = useMemo(() => {
    if (!isMounted) return [];

    const result = [];
    const asteroidCount = 120;

    // Simple seeded random function for consistent results
    let seed = 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Function to calculate y position along the curved path
    const getCurveY = (x: number) => {
      if (x <= 250) {
        const t = x / 250;
        return 60 + (35 - 60) * Math.sin(t * Math.PI / 2);
      } else {
        const t = (x - 250) / 250;
        return 35 + (60 - 35) * Math.sin(t * Math.PI / 2);
      }
    };

    for (let i = 0; i < asteroidCount; i++) {
      const x = (i / asteroidCount) * 500;
      const baseY = getCurveY(x);

      // Add some vertical spread within the belt height
      const verticalSpread = (seededRandom() - 0.5) * 40;
      const y = baseY + verticalSpread;

      // Random asteroid size - larger for visibility
      const size = 3 + seededRandom() * 4;

      result.push({
        id: i,
        x,
        y,
        size,
        opacity: 0.85 + seededRandom() * 0.15,
      });
    }

    return result;
  }, [isMounted]);

  return (
    <div className="fixed top-1/2 -translate-y-1/2 pointer-events-none overflow-visible" style={{ right: '-240vh' }}>
      {/* Planet (background layer) */}
      <div
        className="w-[300vh] h-[300vh] rounded-full relative"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #ffffff, #ebebeb 50%, #d4d4d4 100%)',
          boxShadow: 'inset -20px 0 40px rgba(0, 0, 0, 0.15), 0 0 100px rgba(255, 255, 255, 0.5)',
          zIndex: 1,
        }}
      />

      {/* Asteroid Belt - individual asteroids along curved path */}
      {isMounted && (
        <div
          className="absolute"
          style={{
            left: '-20vh',
            top: '50%',
            width: '280vh',
            height: '12vh',
            transform: 'translateY(-50%)',
            zIndex: 20,
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 500 120" preserveAspectRatio="none">
            {asteroids.map((asteroid) => (
              <ellipse
                key={asteroid.id}
                cx={asteroid.x}
                cy={asteroid.y}
                rx={asteroid.size * 0.18}
                ry={asteroid.size}
                fill="#000000"
                opacity={asteroid.opacity}
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}
