'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function DecorativePlanet() {
  const [shuttleVisible, setShuttleVisible] = useState(false);
  const [universeGlowing, setUniverseGlowing] = useState(false);
  const sloganRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (sloganRef.current) {
      gsap.fromTo(
        sloganRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          delay: 3.8,
        }
      );
    }

    const handleShowShuttle = () => setShuttleVisible(true);
    const handleActivateUniverseGlow = () => setUniverseGlowing(true);

    window.addEventListener('showShuttle', handleShowShuttle);
    window.addEventListener('activateUniverseGlow', handleActivateUniverseGlow);

    return () => {
      window.removeEventListener('showShuttle', handleShowShuttle);
      window.removeEventListener('activateUniverseGlow', handleActivateUniverseGlow);
    };
  }, []);

  return (
    <motion.div
      ref={sloganRef}
      className="fixed bottom-0 text-white text-center w-full pointer-events-none"
      style={{
        fontSize: '80px',
        fontWeight: 900,
        letterSpacing: '-0.06em',
        fontFamily: 'nexa, sans-serif',
        marginBottom: '10vh',
        mixBlendMode: 'difference',
        lineHeight: '0.9',
        opacity: 0,
        left: 0,
        right: 0,
      }}
    >
      <div style={{ position: 'relative' }}>
        software for the
      </div>
      <div
        style={{
          fontWeight: 900,
          fontFamily: 'nexa, sans-serif',
          color: 'white',
          textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
          animation: universeGlowing ? 'universeGlowActivatedBW 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
          position: 'relative',
          paddingBottom: '4px'
        }}
      >
        universe
        <span
          style={{
            position: 'absolute',
            top: '0.15em',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '1px',
            overflow: 'visible',
            pointerEvents: 'none'
          }}
        >
          <span
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3) 50%, transparent)',
              animation: shuttleVisible ? 'lineDrawIn 8s ease-in-out forwards' : 'none',
              width: '0%',
            }}
          />
          {shuttleVisible && (
            <svg
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '28px',
                height: '28px',
                animation: 'spaceshipFlyToPlanet 6s ease-in-out forwards',
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
              }}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
            <path
              d="M20 8L26 16L20 24L18 22V10L20 8Z"
              fill="white"
            />
            <path
              d="M26 16L30 16L28 14L26 16L28 18L30 16Z"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M18 12L14 10L16 16L14 22L18 20V12Z"
              fill="white"
              opacity="0.7"
            />
            <circle
              cx="20"
              cy="16"
              r="2"
              fill="#666666"
            />
            <path
              d="M14 14L10 16L14 18L12 16L14 14Z"
              fill="#CCCCCC"
              opacity="0.6"
            />
            </svg>
          )}
        </span>
      </div>
    </motion.div>
  );
}
