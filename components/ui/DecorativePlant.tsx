'use client';

import { motion } from 'framer-motion';

export default function DecorativePlant() {
  return (
    <div className="fixed top-1/2 -translate-y-1/2 pointer-events-none z-10 overflow-visible" style={{ right: '-240vh' }}>
      <motion.div
        className="w-[300vh] h-[300vh] rounded-full bg-white"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
        style={{
          boxShadow: 'inset -20px 0 40px rgba(0, 0, 0, 0.1), 0 0 100px rgba(255, 255, 255, 0.5)',
        }}
      />
    </div>
  );
}
