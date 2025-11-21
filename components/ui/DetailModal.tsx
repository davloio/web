'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  textBlock?: React.ReactNode;
  missionText?: React.ReactNode;
  techStack?: React.ReactNode;
  team?: React.ReactNode;
}

const fadeSlideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const fadeOnly = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const smoothEase = [0.16, 1, 0.3, 1] as const;

const styles = {
  headingLarge: {
    fontSize: '56px',
    fontWeight: 900,
    letterSpacing: '-0.06em',
    fontFamily: 'nexa, sans-serif',
    color: '#000000',
    lineHeight: '1',
    margin: 0,
  },
  headingMedium: {
    fontSize: '36px',
    fontWeight: 500,
    letterSpacing: '-0.04em',
    fontFamily: 'var(--font-geist-sans)',
    color: '#333333',
    lineHeight: '1',
    margin: 0,
  },
  bodyText: {
    fontFamily: 'var(--font-geist-sans)',
    textAlign: 'justify' as const,
    textAlignLast: 'left' as const,
  },
} as const;

export default function DetailModal({
  isOpen,
  onClose,
  title = 'davlo.io',
  children,
  textBlock,
  missionText,
  techStack,
  team,
}: DetailModalProps) {
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
            backgroundColor: '#ffffff',
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
                  ...styles.headingLarge,
                  position: 'absolute',
                  top: 'clamp(60px, 7.5%, 100px)',
                  left: '120px',
                }}
              >
                who we are
              </motion.h1>

              <motion.h2
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.4, ease: smoothEase }}
                style={{
                  ...styles.headingMedium,
                  position: 'absolute',
                  top: 'clamp(160px, 20%, 200px)',
                  left: '120px',
                }}
              >
                our mission
              </motion.h2>

              {missionText && (
                <motion.div
                  {...fadeSlideUp}
                  transition={{ duration: 0.6, delay: 0.5, ease: smoothEase }}
                  style={{
                    ...styles.bodyText,
                    position: 'absolute',
                    top: 'clamp(200px, 25%, 240px)',
                    left: '120px',
                    width: 'calc(96px * 7)',
                  }}
                >
                  {missionText}
                </motion.div>
              )}

              {techStack && (
                <>
                  <motion.h3
                    {...fadeSlideUp}
                    transition={{ duration: 0.6, delay: 0.6, ease: smoothEase }}
                    style={{
                      ...styles.headingMedium,
                      position: 'absolute',
                      top: 'clamp(380px, 47.5%, 480px)',
                      left: '120px',
                    }}
                  >
                    tech stack
                  </motion.h3>
                  <motion.div
                    {...fadeSlideUp}
                    transition={{ duration: 0.6, delay: 0.7, ease: smoothEase }}
                    style={{
                      position: 'absolute',
                      top: 'clamp(415px, 52%, 515px)',
                      left: '60px',
                      fontFamily: 'var(--font-geist-sans)',
                    }}
                  >
                    {techStack}
                  </motion.div>
                </>
              )}

              {team && (
                <>
                  <motion.h3
                    {...fadeSlideUp}
                    transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
                    style={{
                      ...styles.headingMedium,
                      position: 'absolute',
                      top: 'clamp(60px, 7.5%, 100px)',
                      right: '120px',
                    }}
                  >
                    team
                  </motion.h3>
                  <motion.div
                    {...fadeSlideUp}
                    transition={{ duration: 0.6, delay: 0.15, ease: smoothEase }}
                    style={{
                      position: 'absolute',
                      top: 'clamp(100px, 12.5%, 140px)',
                      right: '120px',
                      fontFamily: 'var(--font-geist-sans)',
                    }}
                  >
                    {team}
                  </motion.div>
                </>
              )}

              <motion.h2
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
                style={{
                  ...styles.headingMedium,
                  position: 'absolute',
                  top: 'clamp(260px, 32.5%, 320px)',
                  right: '120px',
                }}
              >
                about us
              </motion.h2>

              {textBlock && (
                <motion.div
                  {...fadeSlideUp}
                  transition={{ duration: 0.6, delay: 0.3, ease: smoothEase }}
                  style={{
                    ...styles.bodyText,
                    position: 'absolute',
                    top: 'clamp(300px, 37.5%, 360px)',
                    right: '120px',
                    width: 'calc(96px * 5)',
                  }}
                >
                  {textBlock}
                </motion.div>
              )}

              <motion.div
                {...fadeOnly}
                transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
                className="max-w-5xl"
                style={{
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: '28px',
                  lineHeight: '1.6',
                  color: '#000000',
                  display: 'none',
                }}
              >
                {children}
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
                  color: '#000000',
                  lineHeight: '1',
                  margin: 0,
                  textShadow: '0 0 8px rgba(0, 0, 0, 0.15), 0 0 15px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05)',
                }}
              >
                software for the universe
              </motion.p>

              <motion.h1
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.9, ease: smoothEase }}
                style={{
                  ...styles.headingLarge,
                  position: 'absolute',
                  bottom: 'clamp(20px, 2.5%, 80px)',
                  right: '120px',
                  fontSize: '96px',
                }}
              >
                {title}
              </motion.h1>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
