'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sloganRef = useRef<HTMLParagraphElement>(null);
  const typewriterRef = useRef<HTMLSpanElement>(null);
  const [typewriterText, setTypewriterText] = useState('');

  useEffect(() => {
    // Animate title on mount
    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll('.letter');
      gsap.fromTo(
        letters,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.05,
          ease: 'power3.out',
          delay: 0.3,
        }
      );
    }

    // Typewriter effect for ".io" (IntelliJ-style autocomplete)
    const typewriterSequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for davlo to animate

      const type = async () => {
        // Random pause before starting
        setTypewriterText('');
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

        // Type "." - this triggers autocomplete (random timing)
        setTypewriterText('.');
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

        // Show autocomplete suggestion "io" - hold with random duration
        setTypewriterText('.{suggestion}io');
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

        // Accept autocomplete - full text appears (random pause)
        setTypewriterText('.io');
        await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1000));

        // Delete with backspace (random timing between deletions)
        setTypewriterText('.i');
        await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 80));
        setTypewriterText('.');
        await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 80));
        setTypewriterText('');
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 600));

        // Repeat
        type();
      };

      type();
    };

    typewriterSequence();

    // Animate slogan
    if (sloganRef.current) {
      gsap.fromTo(
        sloganRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          delay: 1.2,
        }
      );
    }
  }, []);

  const titleText = 'davlo';
  const letters = titleText.split('');

  return (
    <section className="relative min-h-screen flex flex-col items-start justify-center px-12">
      <div className="text-left" style={{ marginTop: '10vh' }}>
        <div style={{ width: '575px' }}>
        {/* Animated title */}
        <h1
          ref={titleRef}
          className="mb-1 overflow-hidden"
          style={{
            fontSize: '160px',
            lineHeight: 1.1,
            fontWeight: 900,
            letterSpacing: '-0.06em',
            fontFamily: 'nexa, sans-serif',
            fontStyle: 'normal'
          }}
        >
          {letters.map((letter, i) => (
            <span
              key={i}
              className="letter inline-block"
            >
              {letter}
            </span>
          ))}
          <span ref={typewriterRef} className="inline-block relative" style={{ minWidth: '120px', display: 'inline-block' }}>
            {typewriterText.includes('{suggestion}') ? (
              <>
                <span>{typewriterText.split('{suggestion}')[0]}</span>
                <span
                  style={{
                    color: '#8B5CF6',
                    opacity: 0.65,
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  {typewriterText.split('{suggestion}')[1]}
                </span>
              </>
            ) : (
              <span>{typewriterText}</span>
            )}
            {typewriterText && (
              <span
                className="ml-1"
                style={{
                  display: 'inline-block',
                  width: '3px',
                  height: '0.8em',
                  backgroundColor: 'white',
                  animation: 'subtleBlink 1.5s ease-in-out infinite',
                  verticalAlign: 'middle',
                  marginBottom: '0.1em'
                }}
              />
            )}
          </span>
        </h1>

        {/* Slogan */}
        <motion.p
          ref={sloganRef}
          className="text-white/80 tracking-wide text-right"
          style={{
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            position: 'relative',
            paddingBottom: '4px'
          }}
        >
          software for the <span
            style={{
              fontWeight: 600,
              fontStyle: 'italic',
              fontFamily: 'nexa, sans-serif',
              background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
              animation: 'universeGlow 3s ease-in-out infinite'
            }}
          >universe</span>
          <span
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '100%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3) 50%, transparent)',
              animation: 'subtleLineGlow 4s ease-in-out infinite'
            }}
          />
        </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-white/60 rounded-full"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
