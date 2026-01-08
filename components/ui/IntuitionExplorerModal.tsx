'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpaceshipLink from './SpaceshipLink';

interface IntuitionExplorerModalProps {
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

export default function IntuitionExplorerModal({ isOpen, onClose }: IntuitionExplorerModalProps) {
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
            backgroundColor: '#0a0a0a',
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
                  color: '#cccccc',
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
                  color: '#cccccc',
                  textAlign: 'left',
                }}
              >
                <p style={{ margin: '0 0 24px 0' }}>
                  Blockchain explorer for Intuition, a new Layer 3 network built for the future of decentralized systems. First-class tooling from day one, providing real-time insights as the network grows.
                </p>
                <p style={{ margin: '0' }}>
                  Track every transaction, block, and address on this emerging blockchain. Built to scale alongside the network, delivering accurate data from genesis to the present moment.
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
                  color: '#cccccc',
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
                  color: '#cccccc',
                }}
              >
                <p style={{ margin: '0 0 12px 0' }}>
                  live tracking from genesis block onwards
                </p>
                <p style={{ margin: '0 0 12px 0' }}>
                  built for a new generation blockchain
                </p>
                <p style={{ margin: '0 0 12px 0' }}>
                  comprehensive data as the network evolves
                </p>
                <p style={{ margin: '0' }}>
                  open source infrastructure for developers
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
                  color: '#cccccc',
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
                  color: '#cccccc',
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
                  color: '#cccccc',
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
                <SpaceshipLink href="https://intuition.davlo.io/" textColor="#cccccc">
                  <span style={{ fontSize: '18px', fontWeight: 400 }}>intuition.davlo.io</span>
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
                <SpaceshipLink href="https://github.com/davloio" textColor="#cccccc">
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
                  color: '#cccccc',
                  lineHeight: '1',
                  margin: 0,
                  textShadow: '0 0 8px rgba(204, 204, 204, 0.15), 0 0 15px rgba(204, 204, 204, 0.1), 0 0 20px rgba(204, 204, 204, 0.05)',
                }}
              >
                exploring a new blockchain from day one
              </motion.p>

              <motion.h1
                {...fadeSlideUp}
                transition={{ duration: 0.6, delay: 0.9, ease: smoothEase }}
                style={{
                  fontSize: '108px',
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  fontFamily: 'nexa, sans-serif',
                  color: '#cccccc',
                  lineHeight: '1',
                  margin: 0,
                  position: 'absolute',
                  bottom: 'clamp(20px, 2.5%, 80px)',
                  right: '120px',
                }}
              >
                Intuition Explorer
              </motion.h1>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
