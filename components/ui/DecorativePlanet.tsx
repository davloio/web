'use client';

import { motion } from 'framer-motion';

export default function DecorativePlanet() {
  return (
    <div className="fixed top-1/2 -translate-y-1/2 pointer-events-none overflow-visible" style={{ right: '-240vh' }}>
      {/* Planet (background layer) */}
      <motion.div
        className="w-[300vh] h-[300vh] rounded-full relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
        style={{
          background: 'radial-gradient(circle at 40% 40%, #ffffff, #ebebeb 50%, #d4d4d4 100%)',
          boxShadow: 'inset -20px 0 40px rgba(0, 0, 0, 0.15), 0 0 100px rgba(255, 255, 255, 0.5)',
          zIndex: 1,
        }}
      />

      {/* Belt - horizontal band with curved edges for 3D illusion */}
      <motion.div
        className="absolute"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.7 }}
        style={{
          left: '-100vh',
          top: '50%',
          width: '500vh',
          height: '12vh',
          transform: 'translateY(-50%)',
          zIndex: 20,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 500 120" preserveAspectRatio="none">
          {/* Belt with curved top and bottom edges to show wrapping around sphere */}
          <path
            d="M 0,60 Q 100,40 250,35 Q 400,40 500,60 L 500,60 Q 400,80 250,85 Q 100,80 0,60 Z"
            fill="#000000"
          />
        </svg>
      </motion.div>
    </div>
  );
}
