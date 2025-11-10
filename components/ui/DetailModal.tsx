'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

/**
 * Full-screen white page view for planet detail content
 * Features:
 * - Complete white background takeover
 * - Scrollable content area
 * - Back button + ESC key support
 * - Smooth enter/exit animations
 * - Hides 3D scene completely
 */
// Global flag for IMMEDIATE synchronous blocking (before React state updates)
let globalModalOpen = false;

export default function DetailModal({
  isOpen,
  onClose,
  title = 'About davlo.io',
  children,
}: DetailModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // CRITICAL: Set global flag SYNCHRONOUSLY when isOpen changes
  // This blocks wheel events IMMEDIATELY before React state can propagate
  useEffect(() => {
    globalModalOpen = isOpen;
    if (isOpen) {
      console.log('[DetailModal] Global flag set: BLOCKING wheel');
    } else {
      console.log('[DetailModal] Global flag cleared: ALLOWING wheel');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll, only allow modal to scroll
  useEffect(() => {
    if (isOpen) {
      // Keep body fixed - don't allow it to scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      // Reset cursor to auto when modal opens
      document.body.style.cursor = 'auto';
    } else {
      // Restore when closed
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.cursor = '';
    };
  }, [isOpen]);

  // Prevent wheel events from bubbling to parent (stops zoom)
  useEffect(() => {
    if (!isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      // CRITICAL: Only handle wheel events that originate from the modal
      const target = e.target as HTMLElement;
      const modalContainer = target?.closest('[data-modal-container]');

      if (modalContainer) {
        // Event is from modal - AGGRESSIVELY stop ALL propagation
        e.stopPropagation();
        e.stopImmediatePropagation();
        // Don't prevent default - we want the modal to scroll
      }
    };

    // CRITICAL: passive: false allows stopPropagation to work properly
    // This must run in capture phase BEFORE useWheelZoom handler
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true } as any);
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: 'easeInOut'
          }}
          className="fixed inset-0 overflow-y-auto"
          style={{ zIndex: 50, backgroundColor: '#ffffff' }}
          data-modal-container
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="min-h-screen px-12 py-16">

            {/* Content container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto"
              style={{
                paddingTop: '120px',
                paddingBottom: '100px',
              }}
            >
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize: '96px',
                  fontWeight: 900,
                  letterSpacing: '-0.06em',
                  fontFamily: 'nexa, sans-serif',
                  color: '#000000',
                  marginBottom: '80px',
                  lineHeight: '1',
                }}
              >
                {title}
              </motion.h1>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: '20px',
                  lineHeight: '1.8',
                  color: '#000000',
                }}
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
