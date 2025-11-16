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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="fixed inset-0 overflow-hidden"
          style={{
            zIndex: 50,
            backgroundColor: '#ffffff',
          }}
        >
          <div className="h-screen flex items-center justify-center px-12 py-16 relative">

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '140px',
                left: '120px',
                fontSize: '56px',
                fontWeight: 900,
                letterSpacing: '-0.06em',
                fontFamily: 'nexa, sans-serif',
                color: '#000000',
                lineHeight: '1',
                margin: 0,
              }}
            >
              who we are
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '360px',
                right: '120px',
                fontSize: '36px',
                fontWeight: 500,
                letterSpacing: '-0.04em',
                fontFamily: 'var(--font-geist-sans)',
                color: '#333333',
                lineHeight: '1',
                margin: 0,
              }}
            >
              about us
            </motion.h2>

            {textBlock && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  top: '400px',
                  right: '120px',
                  width: 'calc(96px * 5)',
                  textAlign: 'justify',
                  textAlignLast: 'left',
                  fontFamily: 'var(--font-geist-sans)',
                }}
              >
                {textBlock}
              </motion.div>
            )}

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '240px',
                left: '120px',
                fontSize: '36px',
                fontWeight: 500,
                letterSpacing: '-0.04em',
                fontFamily: 'var(--font-geist-sans)',
                color: '#333333',
                lineHeight: '1',
                margin: 0,
              }}
            >
              our mission
            </motion.h2>

            {missionText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  top: '280px',
                  left: '120px',
                  width: 'calc(96px * 7)',
                  textAlign: 'justify',
                  textAlignLast: 'left',
                  fontFamily: 'var(--font-geist-sans)',
                }}
              >
                {missionText}
              </motion.div>
            )}

            {techStack && (
              <>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    top: '480px',
                    left: '120px',
                    fontSize: '36px',
                    fontWeight: 500,
                    letterSpacing: '-0.04em',
                    fontFamily: 'var(--font-geist-sans)',
                    color: '#333333',
                    lineHeight: '1',
                    margin: 0,
                  }}
                >
                  tech stack
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    top: '515px',
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    top: '140px',
                    right: '120px',
                    fontSize: '36px',
                    fontWeight: 500,
                    letterSpacing: '-0.04em',
                    fontFamily: 'var(--font-geist-sans)',
                    color: '#333333',
                    lineHeight: '1',
                    margin: 0,
                  }}
                >
                  team
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    top: '180px',
                    right: '120px',
                    fontFamily: 'var(--font-geist-sans)',
                  }}
                >
                  {team}
                </motion.div>
              </>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl"
              style={{
                fontFamily: 'var(--font-geist-sans)',
                fontSize: '28px',
                lineHeight: '1.6',
                color: '#000000',
              }}
            >
              {children}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                bottom: '175px',
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                bottom: '80px',
                right: '120px',
                fontSize: '96px',
                fontWeight: 900,
                letterSpacing: '-0.06em',
                fontFamily: 'nexa, sans-serif',
                color: '#000000',
                lineHeight: '1',
                margin: 0,
              }}
            >
              {title}
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
