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
  const typewriterRef = useRef<HTMLSpanElement>(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const cursorFading = false;
  const [typingComplete, setTypingComplete] = useState(false);
  const [showIDE, setShowIDE] = useState(true);

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

    const shuttleTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('showShuttle'));
    }, 4100);

    const universeGlowTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('activateUniverseGlow'));
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
    </section>
  );
}
