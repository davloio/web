'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpaceshipLink from './SpaceshipLink';

interface TaikoExplorerModalProps {
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

export default function TaikoExplorerModal({ isOpen, onClose }: TaikoExplorerModalProps) {
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
            backgroundColor: '#C55A7D',
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
                  color: '#000000',
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
                  color: '#000000',
                  textAlign: 'left',
                }}
              >
                <p style={{ margin: '0 0 24px 0' }}>
                  A next-generation blockchain explorer designed to deliver an exceptional user experience for exploring the Taiko network. Built with cutting-edge technology and a focus on speed.
                </p>
                <p style={{ margin: '0' }}>
                  Experience instant search results and real-time updates. Our advanced ingestion system processes blockchain data at unprecedented speeds, ensuring you're always viewing the latest information.
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
                  color: '#000000',
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
                  color: '#000000',
                }}
              >
                <p style={{ margin: '0 0 12px 0' }}>
                  instant search with real-time blockchain data
                </p>
                <p style={{ margin: '0 0 12px 0' }}>
                  clean interface for developers and traders
                </p>
                <p style={{ margin: '0 0 12px 0' }}>
                  complete transparency for all transactions
                </p>
                <p style={{ margin: '0' }}>
                  open source under MIT license
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
                  color: '#000000',
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
                  color: '#000000',
                  textAlign: 'right',
                }}
              >
                <p style={{ margin: '0 0 4px 0' }}>rust</p>
                <p style={{ margin: '0 0 4px 0' }}>postgresql</p>
                <p style={{ margin: '0 0 4px 0' }}>kubernetes</p>
                <p style={{ margin: '0' }}>typescript</p>
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
                  color: '#000000',
                  lineHeight: '1',
                  margin: 0,
                }}
              >
                check it out
              </motion.p>

              {/* <motion.div
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.65, ease: smoothEase }}
                style={{
                  position: 'absolute',
                  top: 'clamp(440px, 55%, 540px)',
                  right: '120px',
                  fontFamily: 'var(--font-geist-sans)',
                }}
              >
                <SpaceshipLink href="https://taiko.davlo.io/" textColor="#000000">
                  <span style={{ fontSize: '18px', fontWeight: 400 }}>taiko.davlo.io</span>
                </SpaceshipLink>
              </motion.div> */}

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
                <SpaceshipLink href="https://github.com/davloio" textColor="#000000">
                  <span style={{ fontSize: '18px', fontWeight: 400 }}>github.com/davloio</span>
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
                  color: '#000000',
                  lineHeight: '1',
                  margin: 0,
                  textShadow: '0 0 8px rgba(0, 0, 0, 0.15), 0 0 15px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05)',
                }}
              >
                built for the taiko community
              </motion.p>

              <motion.h1
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.9, ease: smoothEase }}
                style={{
                  fontSize: '108px',
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  fontFamily: 'nexa, sans-serif',
                  color: '#000000',
                  lineHeight: '1',
                  margin: 0,
                  position: 'absolute',
                  bottom: 'clamp(20px, 2.5%, 80px)',
                  right: '120px',
                }}
              >
                Taiko Explorer
              </motion.h1>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
