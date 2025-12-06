'use client';

import { useState, useEffect } from 'react';

interface SpaceshipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  textColor?: string;
}

export default function SpaceshipLink({
  href,
  children,
  className = '',
  textColor = '#000000'
}: SpaceshipLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`transition-opacity duration-300 hover:opacity-70 ${className}`}
        style={{ color: textColor }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </a>

      {isHovered && (
        <svg
          className="fixed pointer-events-none z-[60]"
          style={{
            left: `${cursorPosition.x + 8}px`,
            top: `${cursorPosition.y - 12}px`,
            width: '24px',
            height: '24px',
            filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))',
            animation: 'spaceshipJiggle 0.6s ease-in-out infinite',
          }}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 8L26 16L20 24L18 22V10L20 8Z"
            fill={textColor}
          />
          <path
            d="M26 16L30 16L28 14L26 16L28 18L30 16Z"
            fill={textColor}
            opacity="0.9"
          />
          <path
            d="M18 12L14 10L16 16L14 22L18 20V12Z"
            fill={textColor}
            opacity="0.7"
          />
          <circle
            cx="20"
            cy="16"
            r="2"
            fill="#cccccc"
          />
          <path
            d="M14 14L10 16L14 18L12 16L14 14Z"
            fill="#666666"
            opacity="0.6"
          />
          <g style={{ animation: 'flameFlicker 0.3s ease-in-out infinite' }}>
            <path
              d="M14 15L6 16L14 17L8 16L14 15Z"
              fill={textColor}
              opacity="0.9"
              filter="url(#flameGlowBlack)"
            />
            <path
              d="M12 15.5L4 16L12 16.5L6 16L12 15.5Z"
              fill={textColor}
              opacity="0.7"
            />
            <path
              d="M10 15.7L2 16L10 16.3L4 16L10 15.7Z"
              fill={textColor}
              opacity="0.5"
            />
          </g>
          <g style={{ animation: 'flameFlicker 0.3s ease-in-out infinite 0.15s' }}>
            <path
              d="M13 14.5L5 16L13 17.5L7 16L13 14.5Z"
              fill={textColor}
              opacity="0.6"
            />
          </g>
          <g style={{ animation: 'flameFlicker 0.25s ease-in-out infinite 0.1s' }}>
            <path
              d="M14 13.5L6 14L14 14.5L8 14L14 13.5Z"
              fill={textColor}
              opacity="0.8"
              filter="url(#flameGlowBlack)"
            />
            <path
              d="M12 13.7L4 14L12 14.3L6 14L12 13.7Z"
              fill={textColor}
              opacity="0.6"
            />
          </g>
          <g style={{ animation: 'flameFlicker 0.28s ease-in-out infinite 0.05s' }}>
            <path
              d="M14 17.5L6 18L14 18.5L8 18L14 17.5Z"
              fill={textColor}
              opacity="0.8"
              filter="url(#flameGlowBlack)"
            />
            <path
              d="M12 17.7L4 18L12 18.3L6 18L12 17.7Z"
              fill={textColor}
              opacity="0.6"
            />
          </g>
          <defs>
            <filter id="flameGlowBlack" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      )}
    </>
  );
}
