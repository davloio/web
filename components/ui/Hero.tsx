'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

type DetailViewType = 'about' | 'project-pink' | 'project-dark' | null;

export function HeroHeader() {
  const [showAsHeader, setShowAsHeader] = useState(false);
  const [headerText, setHeaderText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const [cursorFading, setCursorFading] = useState(false);
  const [inDetailView, setInDetailView] = useState<DetailViewType>(null);

  useEffect(() => {
    const handleShowHeader = () => {
      setShowAsHeader(true);
      setShowCursor(true);

      const typeHeader = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const headerFullText = 'davlo.io';
        for (let i = 0; i <= headerFullText.length; i++) {
          setHeaderText(headerFullText.substring(0, i));
          await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 140));
        }

        await new Promise(resolve => setTimeout(resolve, 6000));
        setCursorFading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowCursor(false);
      };

      typeHeader();
    };

    window.addEventListener('showHeader', handleShowHeader);
    return () => window.removeEventListener('showHeader', handleShowHeader);
  }, []);

  useEffect(() => {
    const handleDetailViewChange = (e: Event) => {
      setInDetailView((e as CustomEvent).detail.inDetailView);
    };

    window.addEventListener('detailViewChange', handleDetailViewChange);
    return () => window.removeEventListener('detailViewChange', handleDetailViewChange);
  }, []);

  if (!showAsHeader) return null;

  const textColor = inDetailView === 'project-dark' ? 'white' : inDetailView !== null ? 'black' : 'white';
  const logoSrc = inDetailView === 'project-dark' ? '/logo-white.svg' : inDetailView !== null ? '/logo-black.svg' : '/logo-white.svg';

  const handleBackClick = () => {
    window.dispatchEvent(new CustomEvent('exitDetailView'));
  };

  const handleLogoClick = () => {
    window.dispatchEvent(new CustomEvent('setZoomProgress', { detail: { progress: 0 } }));
  };

  return (
    <div className="fixed top-8 left-12 z-[100] flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div
          style={{
            animation: inDetailView !== null
              ? 'logoShimmerBlack 3s ease-in-out 1.2s infinite'
              : 'logoShimmer 3s ease-in-out 1.2s infinite',
            transition: 'filter 0.5s ease'
          }}
        >
          <img
            src={logoSrc}
            alt="davlo.io"
            onClick={handleLogoClick}
            style={{
              width: '28px',
              height: '28px',
              opacity: 0,
              transform: 'translateY(-10px) scale(0.8)',
              animation: 'logoEntrance 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              animationDelay: '0.2s',
              display: 'block',
              transition: 'opacity 0.5s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          />
        </div>

        <h2 style={{
          fontSize: '32px',
          fontWeight: 900,
          letterSpacing: '-0.06em',
          fontFamily: 'nexa, sans-serif',
          color: textColor,
          transition: 'color 0.5s ease',
          cursor: 'default'
        }}>
          {headerText}
          {showCursor && (
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '0.8em',
                backgroundColor: textColor,
                animation: cursorFading ? 'none' : 'subtleBlink 1.5s ease-in-out infinite',
                verticalAlign: 'middle',
                marginLeft: '2px',
                marginBottom: '0.1em',
                opacity: cursorFading ? 0 : 1,
                transition: 'background-color 0.5s ease, opacity 1s ease-out'
              }}
            />
          )}
        </h2>
      </div>

      {inDetailView !== null && (
        <button
          onClick={handleBackClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.03em',
            fontFamily: 'var(--font-geist-sans)',
            color: inDetailView !== null ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
            background: 'none',
            border: 'none',
            padding: '0',
            cursor: 'pointer',
            opacity: 0,
            transform: 'translateX(-10px)',
            animation: 'fadeSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = inDetailView !== null ? 'black' : 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = inDetailView !== null ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>back to space</span>
        </button>
      )}
    </div>
  );
}

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<HTMLSpanElement>(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const cursorFading = false;
  const [typingComplete, setTypingComplete] = useState(false);
  const [showIDE, setShowIDE] = useState(true);
  const [shuttleVisible, setShuttleVisible] = useState(false);
  const [universeGlowing, setUniverseGlowing] = useState(false);

  useEffect(() => {
    const typewriterSequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 2500));

      setShowCursor(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      setTypewriterText('d');
      await new Promise(resolve => setTimeout(resolve, 200));

      setTypewriterText('da');
      await new Promise(resolve => setTimeout(resolve, 800));

      setTypewriterText('da{suggestion}vlo.io');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTypewriterText('davlo.io');
      await new Promise(resolve => setTimeout(resolve, 400));

      setTypingComplete(true);

      await new Promise(resolve => setTimeout(resolve, 2500));

      const fullText = 'davlo.io';
      for (let i = fullText.length - 1; i >= 0; i--) {
        setTypewriterText(fullText.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 40 + Math.random() * 80));
      }

      setShowCursor(false);

      setShowIDE(false);

      await new Promise(resolve => setTimeout(resolve, 300));

      window.dispatchEvent(new CustomEvent('showHeader'));
    };

    typewriterSequence();

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
          delay: 2.0,
        }
      );
    }

    const shuttleTimer = setTimeout(() => {
      setShuttleVisible(true);
    }, 4100);

    const universeGlowTimer = setTimeout(() => {
      setUniverseGlowing(true);
    }, 6100);

    return () => {
      clearTimeout(shuttleTimer);
      clearTimeout(universeGlowTimer);
    };
  }, []);

  return (
    <section className="hero-section relative min-h-screen flex flex-col items-start justify-center">
      {showIDE && (
        <div className="text-left">
          {/* Minimal IDE Header */}
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {/* Window Controls + Filename */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              opacity: 0.5
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

            {/* Simple syntax-highlighted code context */}
            <div style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '13px',
              opacity: 0.4,
              marginBottom: '8px',
            }}>
              <span style={{ color: '#C586C0' }}>const</span>
              <span style={{ color: '#9CDCFE' }}> title </span>
              <span style={{ color: '#D4D4D4' }}>= </span>
              <span style={{ color: '#CE9178' }}>"</span>
            </div>
          </div>

          {/* Main typewriter content */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '14px',
              color: '#444',
              paddingTop: '8px',
              userSelect: 'none',
              fontWeight: 600,
              opacity: 0.3,
            }}>
              1
            </div>

            <div>
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
                    position: 'relative',
                  }}
                >
                  {/* Small "Tab to accept" hint */}
                  <span style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '0',
                    fontSize: '10px',
                    color: '#8B5CF6',
                    fontFamily: 'var(--font-geist-mono)',
                    opacity: 0.6,
                    whiteSpace: 'nowrap',
                  }}>
                    Tab
                  </span>
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
          opacity: 0,
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
    </section>
  );
}
