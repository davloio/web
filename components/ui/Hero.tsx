'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

// Separate Header component that can be rendered outside the zoom wrapper
export function HeroHeader() {
  const [showAsHeader, setShowAsHeader] = useState(false);
  const [headerText, setHeaderText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [cursorFading, setCursorFading] = useState(false);

  useEffect(() => {
    // Listen for header show event
    const handleShowHeader = (e: CustomEvent) => {
      setShowAsHeader(true);
      setShowCursor(true);

      // Type out header text
      const typeHeader = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const headerFullText = 'davlo.io';
        for (let i = 0; i <= headerFullText.length; i++) {
          setHeaderText(headerFullText.substring(0, i));
          await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 140));
        }

        // Hide cursor after header is complete
        await new Promise(resolve => setTimeout(resolve, 6000));
        setCursorFading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowCursor(false);
      };

      typeHeader();
    };

    window.addEventListener('showHeader' as any, handleShowHeader);
    return () => window.removeEventListener('showHeader' as any, handleShowHeader);
  }, []);

  if (!showAsHeader) return null;

  return (
    <div className="fixed top-8 left-12 z-[100] flex items-center gap-4">
      {/* Logo with shimmer wrapper */}
      <div
        style={{
          animation: 'logoShimmer 3s ease-in-out 1.2s infinite'
        }}
      >
        <img
          src="/logo.svg"
          alt="davlo.io"
          style={{
            width: '28px',
            height: '28px',
            opacity: 0,
            transform: 'translateY(-10px) scale(0.8)',
            animation: 'logoEntrance 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            animationDelay: '0.2s',
            display: 'block'
          }}
        />
      </div>

      {/* Text */}
      <h2 style={{
        fontSize: '32px',
        fontWeight: 900,
        letterSpacing: '-0.06em',
        fontFamily: 'nexa, sans-serif',
        color: 'white'
      }}>
        {headerText}
        {showCursor && (
          <span
            style={{
              display: 'inline-block',
              width: '2px',
              height: '0.8em',
              backgroundColor: 'white',
              animation: cursorFading ? 'none' : 'subtleBlink 1.5s ease-in-out infinite',
              verticalAlign: 'middle',
              marginLeft: '2px',
              marginBottom: '0.1em',
              opacity: cursorFading ? 0 : 1,
              transition: 'opacity 1s ease-out'
            }}
          />
        )}
      </h2>
    </div>
  );
}

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<HTMLSpanElement>(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [cursorFading, setCursorFading] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showIDE, setShowIDE] = useState(true);
  const [shuttleVisible, setShuttleVisible] = useState(false);
  const [universeGlowing, setUniverseGlowing] = useState(false);
  const [shuttleOrbiting, setShuttleOrbiting] = useState(false);

  useEffect(() => {
    // Typewriter effect for complete title "davlo.io" (IntelliJ-style autocomplete)
    const typewriterSequence = async () => {
      // Initial delay - wait for slogan to appear first
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Show cursor
      setShowCursor(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Type "d"
      setTypewriterText('d');
      await new Promise(resolve => setTimeout(resolve, 200));

      // Type "a"
      setTypewriterText('da');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Show autocomplete suggestion "vlo.io"
      setTypewriterText('da{suggestion}vlo.io');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Accept autocomplete - full text appears
      setTypewriterText('davlo.io');
      await new Promise(resolve => setTimeout(resolve, 400));

      // Mark typing as complete (cursor keeps blinking)
      setTypingComplete(true);

      // Wait 2.5 seconds before deleting
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Start deleting
      setIsDeleting(true);
      const fullText = 'davlo.io';
      for (let i = fullText.length - 1; i >= 0; i--) {
        setTypewriterText(fullText.substring(0, i));
        // Random delay between 40-120ms for each deletion
        await new Promise(resolve => setTimeout(resolve, 40 + Math.random() * 80));
      }

      // Hide main title elements
      setShowCursor(false);
      setIsDeleting(false);

      // Hide IDE animation
      setShowIDE(false);

      // Small delay before triggering header
      await new Promise(resolve => setTimeout(resolve, 300));

      // Dispatch event to show header (outside zoom wrapper)
      window.dispatchEvent(new CustomEvent('showHeader'));
    };

    typewriterSequence();

    // Animate slogan (appears after zoom-out completes)
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
          delay: 2.0, // Appears 2 seconds after page load
        }
      );
    }

    // Trigger shuttle animation once after delay (starts during/after IDE animation)
    const shuttleTimer = setTimeout(() => {
      setShuttleVisible(true);
    }, 4100);

    // Trigger universe glow when shuttle passes by (about 75% through the line drawing)
    const universeGlowTimer = setTimeout(() => {
      setUniverseGlowing(true);
    }, 6100);

    // Start orbiting animation after the initial flight completes
    const orbitTimer = setTimeout(() => {
      setShuttleOrbiting(true);
    }, 8100);

    return () => {
      clearTimeout(shuttleTimer);
      clearTimeout(universeGlowTimer);
      clearTimeout(orbitTimer);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-start justify-center px-12">
      {/* Title with IDE context (initial animation) - will zoom out with page */}
      {showIDE && (
        <div className="text-left">
          {/* IDE window header */}
          <div style={{
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.6
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F56' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFBD2E' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27C93F' }}></div>
            </div>
            <span style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '13px',
              color: '#888',
              fontWeight: 500
            }}>
              index.tsx
            </span>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            {/* Line number */}
            <div style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '14px',
              color: '#444',
              paddingTop: '8px',
              userSelect: 'none',
              fontWeight: 600
            }}>
              1
            </div>

            <div>
              {/* Animated title with typewriter */}
              <h1
                ref={titleRef}
                className="mb-1 overflow-hidden"
                style={{
                  fontSize: '140px',
                  lineHeight: 1.1,
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  fontFamily: 'nexa, sans-serif',
                  fontStyle: 'normal'
                }}
              >
          <span ref={typewriterRef} className="inline-block relative">
            {typewriterText.includes('{suggestion}') ? (
              <>
                <span>{typewriterText.split('{suggestion}')[0]}</span>
                <span
                  style={{
                    color: '#8B5CF6',
                    opacity: 0.65,
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  {typewriterText.split('{suggestion}')[1]}
                </span>
              </>
            ) : (
              <span>{typewriterText}</span>
            )}
            {showCursor && (
              <span
                className="ml-1"
                style={{
                  display: 'inline-block',
                  width: '3px',
                  height: '0.8em',
                  backgroundColor: 'white',
                  animation: typingComplete && !cursorFading ? 'subtleBlink 1.5s ease-in-out infinite' : 'none',
                  verticalAlign: 'middle',
                  marginBottom: '0.1em',
                  opacity: cursorFading ? 0 : 1,
                  transition: 'opacity 1s ease-out'
                }}
              />
            )}
          </span>
        </h1>
            </div>
          </div>
        </div>
      )}

      {/* Slogan at the bottom */}
      <motion.div
        ref={sloganRef}
        className="absolute bottom-0 text-white text-center w-full"
        style={{
          fontSize: '80px',
          fontWeight: 900,
          letterSpacing: '-0.06em',
          fontFamily: 'nexa, sans-serif',
          marginBottom: '10vh',
          mixBlendMode: 'difference',
          lineHeight: '0.9',
          opacity: 0, // Start hidden, GSAP will animate it in
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
          {/* Spaceship line at the bottom of universe */}
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
            {/* Animated line that gets drawn */}
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
              {/* Main body */}
              <path
                d="M20 8L26 16L20 24L18 22V10L20 8Z"
                fill="white"
              />
              {/* Nose cone */}
              <path
                d="M26 16L30 16L28 14L26 16L28 18L30 16Z"
                fill="white"
                opacity="0.9"
              />
              {/* Wings */}
              <path
                d="M18 12L14 10L16 16L14 22L18 20V12Z"
                fill="white"
                opacity="0.7"
              />
              {/* Window */}
              <circle
                cx="20"
                cy="16"
                r="2"
                fill="#666666"
              />
              {/* Thruster flame */}
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
    </section>
  );
}
