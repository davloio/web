'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [typewriterText, setTypewriterText] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typewriter effect for hover text
  useEffect(() => {
    if (!hoveredLink) {
      setTypewriterText('');
      return;
    }

    const link = links.find(l => l.name === hoveredLink);
    if (!link?.hoverText) {
      setTypewriterText('');
      return;
    }

    const text = link.hoverText;
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setTypewriterText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30); // Fast typing speed (30ms per character)

    return () => clearInterval(typeInterval);
  }, [hoveredLink]);

  if (!isMounted) return null;

  const links = [
    { name: 'projects', href: '#projects', hoverText: 'ready for time travel?' },
    { name: 'about', href: '#about', hoverText: 'well, thats a shorter trip' },
    { name: 'contact', href: 'mailto:hello@davlo.io', hoverIcon: 'spaceship' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 z-50 p-8 flex flex-col gap-6">
      {/* Links */}
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <div key={link.name} className="relative">
            <a
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-white/60 hover:text-white transition-colors duration-300 text-base font-normal tracking-wide"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
              onMouseEnter={() => (link.hoverText || link.hoverIcon) && setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link.name}
            </a>

            {/* Hover tooltip with typewriter effect */}
            {link.hoverText && hoveredLink === link.name && (
              <div
                className="fixed whitespace-nowrap pointer-events-none z-[60]"
                style={{
                  fontFamily: 'var(--font-geist-sans)',
                  left: `${cursorPosition.x + 12}px`,
                  top: `${cursorPosition.y - 32}px`,
                }}
              >
                <span className="text-white/40 text-xs font-light tracking-wider">
                  {typewriterText}
                </span>
              </div>
            )}

            {/* Hover spaceship icon */}
            {link.hoverIcon === 'spaceship' && hoveredLink === link.name && (
              <svg
                className="fixed pointer-events-none z-[60]"
                style={{
                  left: `${cursorPosition.x + 8}px`,
                  top: `${cursorPosition.y - 12}px`,
                  width: '24px',
                  height: '24px',
                  filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))',
                  animation: 'spaceshipJiggle 0.6s ease-in-out infinite',
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
                {/* Thruster flame - original (static) */}
                <path
                  d="M14 14L10 16L14 18L12 16L14 14Z"
                  fill="#CCCCCC"
                  opacity="0.6"
                />

                {/* Animated flame trails */}
                <g style={{ animation: 'flameFlicker 0.3s ease-in-out infinite' }}>
                  {/* Main flame */}
                  <path
                    d="M14 15L6 16L14 17L8 16L14 15Z"
                    fill="white"
                    opacity="0.9"
                    filter="url(#flameGlow)"
                  />
                  {/* Secondary flame */}
                  <path
                    d="M12 15.5L4 16L12 16.5L6 16L12 15.5Z"
                    fill="white"
                    opacity="0.7"
                  />
                  {/* Tertiary flame (longest trail) */}
                  <path
                    d="M10 15.7L2 16L10 16.3L4 16L10 15.7Z"
                    fill="white"
                    opacity="0.5"
                  />
                </g>

                {/* Additional flickering flame (out of phase) */}
                <g style={{ animation: 'flameFlicker 0.3s ease-in-out infinite 0.15s' }}>
                  <path
                    d="M13 14.5L5 16L13 17.5L7 16L13 14.5Z"
                    fill="white"
                    opacity="0.6"
                  />
                </g>

                {/* Second distinct flame stream (top) */}
                <g style={{ animation: 'flameFlicker 0.25s ease-in-out infinite 0.1s' }}>
                  <path
                    d="M14 13.5L6 14L14 14.5L8 14L14 13.5Z"
                    fill="white"
                    opacity="0.8"
                    filter="url(#flameGlow)"
                  />
                  <path
                    d="M12 13.7L4 14L12 14.3L6 14L12 13.7Z"
                    fill="white"
                    opacity="0.6"
                  />
                </g>

                {/* Third distinct flame stream (bottom) */}
                <g style={{ animation: 'flameFlicker 0.28s ease-in-out infinite 0.05s' }}>
                  <path
                    d="M14 17.5L6 18L14 18.5L8 18L14 17.5Z"
                    fill="white"
                    opacity="0.8"
                    filter="url(#flameGlow)"
                  />
                  <path
                    d="M12 17.7L4 18L12 18.3L6 18L12 17.7Z"
                    fill="white"
                    opacity="0.6"
                  />
                </g>

                {/* Glow filter for flames */}
                <defs>
                  <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            )}
          </div>
        ))}

        {/* GitHub Logo */}
        <a
          href="https://github.com/davloio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white transition-colors duration-300 mt-2"
          aria-label="GitHub"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </nav>

      {/* Watermark */}
      <div className="text-white/30 text-xs font-light tracking-wider flex flex-col gap-1">
        <span>© 2025</span>
        <span>not an ordinary software team</span>
      </div>
    </footer>
  );
}
