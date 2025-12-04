'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import LoadingSolarSystem from './LoadingSolarSystem';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 600;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    let seed = 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const stars: Array<{ x: number; y: number; size: number; opacity: number }> = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: seededRandom() * width,
        y: seededRandom() * height,
        size: seededRandom() * 0.8 + 0.2,
        opacity: seededRandom() * 0.3 + 0.2,
      });
    }

    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#000000');
    bgGradient.addColorStop(0.5, '#000308');
    bgGradient.addColorStop(1, '#000000');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    const nebulas = [
      { x: 0.3, y: 0.4, radius: 0.4, color1: 'rgba(100, 40, 180, 0.06)', color2: 'rgba(50, 20, 90, 0.02)' },
      { x: 0.7, y: 0.6, radius: 0.35, color1: 'rgba(40, 80, 160, 0.05)', color2: 'rgba(20, 40, 80, 0.015)' },
    ];

    nebulas.forEach((nebula) => {
      const gradient = ctx.createRadialGradient(
        width * nebula.x, height * nebula.y, 0,
        width * nebula.x, height * nebula.y, width * nebula.radius
      );
      gradient.addColorStop(0, nebula.color1);
      gradient.addColorStop(0.4, nebula.color2);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });

    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: 'blur(20px)'
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000000',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.2,
              y: -30
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              width: '300px',
              height: '300px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Canvas
              camera={{
                position: [0, 3, 5],
                fov: 50,
              }}
              shadows
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <LoadingSolarSystem />
            </Canvas>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
