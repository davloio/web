'use client';

import { useState, useEffect, useMemo } from 'react';

export default function DecorativePlanet() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const asteroids = useMemo(() => {
    if (!isMounted) return [];

    const result = [];
    const asteroidCount = 180;
    let seed = 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const getCurveY = (x: number) => {
      if (x <= 250) {
        const t = x / 250;
        return 60 + (35 - 60) * Math.sin(t * Math.PI / 2);
      } else {
        const t = (x - 250) / 250;
        return 35 + (60 - 35) * Math.sin(t * Math.PI / 2);
      }
    };
    const generateAsteroidShape = (size: number) => {
      const points = [];
      const numPoints = 6 + Math.floor(seededRandom() * 4);

      for (let j = 0; j < numPoints; j++) {
        const angle = (j / numPoints) * Math.PI * 2;

        const radiusVariation = 0.6 + seededRandom() * 0.5;
        const radius = size * radiusVariation;
        const px = Math.cos(angle) * radius * 0.24;
        const py = Math.sin(angle) * radius;
        points.push(`${px},${py}`);
      }

      return points.join(' ');
    };

    for (let i = 0; i < asteroidCount; i++) {
      const x = (i / asteroidCount) * 500;
      const baseY = getCurveY(x);
      const verticalSpread = (seededRandom() - 0.5) * 50;
      const y = baseY + verticalSpread;
      const size = 3 + seededRandom() * 4;

      result.push({
        id: i,
        x,
        y,
        size,
        opacity: 0.85 + seededRandom() * 0.15,
        shape: generateAsteroidShape(size),
      });
    }
    const bigAsteroidPositions = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
    bigAsteroidPositions.forEach((pos, idx) => {
      const x = pos * 500;
      const baseY = getCurveY(x);
      const verticalSpread = (seededRandom() - 0.5) * 40;
      const y = baseY + verticalSpread;
      const size = 10 + seededRandom() * 6;

      result.push({
        id: `big-${idx}`,
        x,
        y,
        size,
        opacity: 0.9 + seededRandom() * 0.1,
        shape: generateAsteroidShape(size),
      });
    });
    const tinyAsteroidCount = 700;
    for (let i = 0; i < tinyAsteroidCount; i++) {
      const x = seededRandom() * 500;
      const baseY = getCurveY(x);
      const verticalSpread = (seededRandom() - 0.5) * 55;
      const y = baseY + verticalSpread;
      const size = 0.8 + seededRandom() * 0.8;

      result.push({
        id: `tiny-${i}`,
        x,
        y,
        size,
        opacity: 0.6 + seededRandom() * 0.3,
        shape: generateAsteroidShape(size),
      });
    }

    return result;
  }, [isMounted]);

  return (
    <div className="fixed top-1/2 -translate-y-1/2 pointer-events-none overflow-visible" style={{ right: '-240vh' }}>
      <style jsx>{`
        @keyframes orbitMoonVertical {
          0% { transform: translateX(1.55vh) translateY(-5.8vh); z-index: 16; }
          6.25% { transform: translateX(2.18vh) translateY(-5.15vh); z-index: 16; }
          12.5% { transform: translateX(2.46vh) translateY(-3.99vh); z-index: 16; }
          18.75% { transform: translateX(2.39vh) translateY(-2.63vh); z-index: 16; }
          25% { transform: translateX(1.93vh) translateY(-0.52vh); z-index: 16; }
          31.25% { transform: translateX(1.19vh) translateY(1.63vh); z-index: 16; }
          37.5% { transform: translateX(0.26vh) translateY(3.54vh); z-index: 16; }
          43.75% { transform: translateX(-0.69vh) translateY(5.11vh); z-index: 16; }
          50% { transform: translateX(-1.55vh) translateY(5.8vh); z-index: 14; }
          56.25% { transform: translateX(-2.18vh) translateY(5.15vh); z-index: 14; }
          62.5% { transform: translateX(-2.46vh) translateY(3.99vh); z-index: 14; }
          68.75% { transform: translateX(-2.39vh) translateY(2.63vh); z-index: 14; }
          75% { transform: translateX(-1.93vh) translateY(0.52vh); z-index: 14; }
          81.25% { transform: translateX(-1.19vh) translateY(-1.63vh); z-index: 14; }
          87.5% { transform: translateX(-0.26vh) translateY(-3.54vh); z-index: 14; }
          93.75% { transform: translateX(0.69vh) translateY(-5.11vh); z-index: 16; }
          100% { transform: translateX(1.55vh) translateY(-5.8vh); z-index: 16; }
        }
      `}</style>

      
      <div
        className="w-[300vh] h-[300vh] rounded-full relative"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #ffffff, #ebebeb 50%, #d4d4d4 100%)',
          boxShadow: 'inset -20px 0 40px rgba(0, 0, 0, 0.15), 0 0 100px rgba(255, 255, 255, 0.5)',
          zIndex: 1,
          animation: 'planetPulse 5s ease-in-out infinite, planetGradientShift 12s ease-in-out infinite',
        }}
      />

      
      <div
        className="absolute w-[8vh] h-[8vh] rounded-full"
        style={{
          left: '40vh',
          top: '35%',
          background: 'radial-gradient(circle at 30% 40%, #2d2d2d, #000000 70%)',
          boxShadow: 'inset -0.5vh 0 1vh rgba(0, 0, 0, 0.5), 0 0 1vh rgba(0, 0, 0, 0.3)',
          zIndex: 15,
        }}
      />

      
      <div
        className="absolute"
        style={{
          left: '44vh',
          top: 'calc(35% + 4vh)',
          width: 0,
          height: 0,
        }}
      >
        <div
          style={{
            animation: 'orbitMoonVertical 8s linear infinite',
            width: 0,
            height: 0,
            position: 'relative',
          }}
        >
          <div
            className="w-[1.5vh] h-[1.5vh] rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #3a3a3a, #1a1a1a)',
              boxShadow: '0 0 0.5vh rgba(0, 0, 0, 0.5)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </div>

      
      {isMounted && (
        <div
          className="absolute"
          style={{
            left: '-20vh',
            top: '50%',
            width: '560vh',
            height: '16vh',
            zIndex: 20,
            animation: 'asteroidBeltZoom 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, asteroidMarquee 360s linear infinite',
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1000 120" preserveAspectRatio="none">
            {asteroids.map((asteroid) => (
              <polygon
                key={asteroid.id}
                points={asteroid.shape}
                fill="#000000"
                opacity={asteroid.opacity}
                transform={`translate(${asteroid.x}, ${asteroid.y})`}
              />
            ))}
            
            {asteroids.map((asteroid) => (
              <polygon
                key={`${asteroid.id}-duplicate`}
                points={asteroid.shape}
                fill="#000000"
                opacity={asteroid.opacity}
                transform={`translate(${asteroid.x + 500}, ${asteroid.y})`}
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}
