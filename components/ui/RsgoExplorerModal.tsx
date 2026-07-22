'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpaceshipLink from './SpaceshipLink';

interface RsgoExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fadeOnly = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const fadeSlideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const smoothEase = [0.16, 1, 0.3, 1] as const;

const textColor = '#ff8c42';

export default function RsgoExplorerModal({ isOpen, onClose }: RsgoExplorerModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...fadeOnly}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="fixed inset-0 overflow-hidden"
          style={{
            zIndex: 50,
            backgroundColor: '#0a0e1a',
          }}
        >
          <div className="h-screen flex items-center justify-center px-12 py-16 relative">
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1800px',
                height: 'clamp(700px, 80vh, 900px)',
              }}
            >
              <motion.h1
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
                style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  fontFamily: 'nexa, sans-serif',
                  color: textColor,
                  lineHeight: '1',
                  margin: 0,
                  position: 'absolute',
                  top: 'clamp(60px, 7.5%, 100px)',
                  left: '120px',
                }}
              >
                overview
              </motion.h1>

              <motion.div
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
                style={{
                  position: 'absolute',
                  top: 'clamp(120px, 15%, 160px)',
                  left: '120px',
                  width: 'calc(96px * 7)',
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: '18px',
                  lineHeight: '1.7',
                  fontWeight: 400,
                  color: textColor,
                  textAlign: 'left',
                }}
              >
                <p style={{ margin: '0 0 24px 0' }}>
                  RSGO throws out the fixed map. Two teams, ORANGE and NAVY, spend a build-phase economy on walls, cover and structures instead of weapons, then fight across a battlefield neither side has seen before.
                </p>
                <p style={{ margin: '0' }}>
                  You don&apos;t buy guns. You buy the map. Nothing to memorize, nothing to pre-aim, because the layout is built from scratch by the players who then have to fight in it.
                </p>
              </motion.div>

              <motion.h2
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
                style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  fontFamily: 'nexa, sans-serif',
                  color: textColor,
                  lineHeight: '1',
                  margin: 0,
                  position: 'absolute',
                  top: 'clamp(380px, 47.5%, 480px)',
                  left: '120px',
                }}
              >
                features
              </motion.h2>

              <motion.div
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.4, ease: smoothEase }}
                style={{
                  position: 'absolute',
                  top: 'clamp(440px, 55%, 540px)',
                  left: '120px',
                  width: 'calc(96px * 7)',
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: '18px',
                  lineHeight: '1.7',
                  fontWeight: 400,
                  color: textColor,
                }}
              >
                <p style={{ margin: '0 0 12px 0' }}>
                  build-phase economy: buy the map, not the guns
                </p>
                <p style={{ margin: '0 0 12px 0' }}>
                  battlefield built from scratch by both teams every round
                </p>
                <p style={{ margin: '0 0 12px 0' }}>
                  deterministic Rust server, zero garbage-collection stalls
                </p>
                <p style={{ margin: '0' }}>
                  ORANGE vs NAVY objective-based team play
                </p>
              </motion.div>

              <motion.h3
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
                style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  fontFamily: 'nexa, sans-serif',
                  color: textColor,
                  lineHeight: '1',
                  margin: 0,
                  position: 'absolute',
                  top: 'clamp(60px, 7.5%, 100px)',
                  right: '120px',
                }}
              >
                tech stack
              </motion.h3>

              <motion.div
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.15, ease: smoothEase }}
                style={{
                  position: 'absolute',
                  top: 'clamp(120px, 15%, 160px)',
                  right: '120px',
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: '16px',
                  lineHeight: '1.7',
                  fontWeight: 400,
                  color: textColor,
                  textAlign: 'right',
                }}
              >
                <p style={{ margin: '0 0 4px 0' }}>rust</p>
                <p style={{ margin: '0 0 4px 0' }}>three.js</p>
                <p style={{ margin: '0' }}>javascript</p>
              </motion.div>

              <motion.p
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.6, ease: smoothEase }}
                style={{
                  position: 'absolute',
                  top: 'clamp(380px, 47.5%, 480px)',
                  right: '120px',
                  fontSize: '36px',
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  fontFamily: 'nexa, sans-serif',
                  color: textColor,
                  lineHeight: '1',
                  margin: 0,
                }}
              >
                check it out
              </motion.p>

              <motion.div
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.65, ease: smoothEase }}
                style={{
                  position: 'absolute',
                  top: 'clamp(440px, 55%, 540px)',
                  right: '120px',
                  fontFamily: 'var(--font-geist-sans)',
                }}
              >
                <SpaceshipLink href="https://rsgo.io/" textColor={textColor}>
                  <span style={{ fontSize: '18px', fontWeight: 400 }}>rsgo.io</span>
                </SpaceshipLink>
              </motion.div>

              <motion.div
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.7, ease: smoothEase }}
                style={{
                  position: 'absolute',
                  top: 'clamp(470px, 58.75%, 570px)',
                  right: '120px',
                  fontFamily: 'var(--font-geist-sans)',
                }}
              >
                <SpaceshipLink href="https://github.com/JumpiiX/rsgo-frontend" textColor={textColor}>
                  <span style={{ fontSize: '18px', fontWeight: 400 }}>github.com/JumpiiX/rsgo-frontend</span>
                </SpaceshipLink>
              </motion.div>

              <motion.div
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.75, ease: smoothEase }}
                style={{
                  position: 'absolute',
                  top: 'clamp(500px, 62.5%, 600px)',
                  right: '120px',
                  fontFamily: 'var(--font-geist-sans)',
                }}
              >
                <SpaceshipLink href="https://github.com/JumpiiX/rsgo-game-client" textColor={textColor}>
                  <span style={{ fontSize: '18px', fontWeight: 400 }}>github.com/JumpiiX/rsgo-game-client</span>
                </SpaceshipLink>
              </motion.div>

              <motion.p
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.8, ease: smoothEase }}
                style={{
                  position: 'absolute',
                  bottom: 'clamp(120px, 15%, 175px)',
                  right: '120px',
                  fontSize: '16px',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  fontFamily: 'var(--font-geist-sans)',
                  color: textColor,
                  lineHeight: '1',
                  margin: 0,
                  textShadow: '0 0 8px rgba(255, 140, 66, 0.15), 0 0 15px rgba(255, 140, 66, 0.1), 0 0 20px rgba(255, 140, 66, 0.05)',
                }}
              >
                compiled to never flinch
              </motion.p>

              <motion.h1
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.9, ease: smoothEase }}
                style={{
                  fontSize: '108px',
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  fontFamily: 'nexa, sans-serif',
                  color: textColor,
                  lineHeight: '1',
                  margin: 0,
                  position: 'absolute',
                  bottom: 'clamp(20px, 2.5%, 80px)',
                  right: '120px',
                }}
              >
                RSGO
              </motion.h1>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
