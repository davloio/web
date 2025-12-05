'use client';

import { useEffect, useRef, useState } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);
  const [telescopeZoom, setTelescopeZoom] = useState(0);
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsFirefox(navigator.userAgent.toLowerCase().includes('firefox'));

    const startDelay = setTimeout(() => {
      const duration = 1800;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setTelescopeZoom(easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }, 2000);

    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isFirefox) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      let seed = 54321;
      const seededRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#000000');
      bgGradient.addColorStop(0.3, '#000308');
      bgGradient.addColorStop(0.7, '#00040a');
      bgGradient.addColorStop(1, '#000000');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const nebulas = [
        { x: 0.4, y: 0.5, radius: 0.6, color1: 'rgba(120, 40, 200, 0.12)', color2: 'rgba(60, 20, 100, 0.045)' },
        { x: 0.6, y: 0.3, radius: 0.5, color1: 'rgba(80, 60, 180, 0.10)', color2: 'rgba(40, 30, 90, 0.035)' },
        { x: 0.2, y: 0.3, radius: 0.4, color1: 'rgba(160, 50, 220, 0.13)', color2: 'rgba(80, 25, 110, 0.05)' },
        { x: 0.7, y: 0.6, radius: 0.5, color1: 'rgba(70, 80, 200, 0.11)', color2: 'rgba(35, 40, 100, 0.04)' },
        { x: 0.5, y: 0.8, radius: 0.35, color1: 'rgba(200, 70, 230, 0.11)', color2: 'rgba(100, 35, 115, 0.038)' },
        { x: 0.85, y: 0.2, radius: 0.25, color1: 'rgba(220, 50, 210, 0.14)', color2: 'rgba(110, 25, 105, 0.055)' },
        { x: 0.15, y: 0.75, radius: 0.2, color1: 'rgba(100, 100, 230, 0.12)', color2: 'rgba(50, 50, 115, 0.045)' },
      ];

      nebulas.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(
          width * nebula.x, height * nebula.y, 0,
          width * nebula.x, height * nebula.y, width * nebula.radius
        );
        gradient.addColorStop(0, nebula.color1);
        gradient.addColorStop(0.3, nebula.color2);
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.02)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      for (let layer = 0; layer < 4; layer++) {
        const starCount = [800, 400, 100, 20][layer];

        for (let i = 0; i < starCount; i++) {
          const x = seededRandom() * width;
          const y = seededRandom() * height;
          const size = seededRandom() * [0.3, 0.5, 1.0, 1.5][layer] + [0.2, 0.4, 0.6, 1.2][layer];
          const opacity = seededRandom() * [0.15, 0.25, 0.35, 0.4][layer] + [0.1, 0.2, 0.4, 0.6][layer];

          const colorChoice = seededRandom();
          let r, g, b;
          if (colorChoice < 0.7) {
            r = 255; g = 255; b = 255;
          } else if (colorChoice < 0.85) {
            r = 200; g = 220; b = 255;
          } else if (colorChoice < 0.95) {
            r = 255; g = 240; b = 220;
          } else {
            r = 255; g = 200; b = 255;
          }

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fill();
        }
      }

      return;
    }

    let width = window.innerWidth * 1.4;
    let height = window.innerHeight * 1.4;

    const resize = () => {
      width = window.innerWidth * 1.4;
      height = window.innerHeight * 1.4;
      canvas.width = width;
      canvas.height = height;
    };

    let seed = 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    interface Star {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      opacity: number;
      baseOpacity: number;
      color: string;
      layer: number;
      twinkleSpeed: number;
      twinklePhase: number;
    }

    const stars: Star[] = [];

    const initStars = () => {
      stars.length = 0;
      seed = 54321;

      for (let layer = 0; layer < 4; layer++) {
        const starCount = [1200, 600, 150, 30][layer];

        for (let i = 0; i < starCount; i++) {
          const baseX = seededRandom() * width;
          const baseY = seededRandom() * height;
          const size = seededRandom() * [0.3, 0.5, 1.0, 1.5][layer] + [0.2, 0.4, 0.6, 1.2][layer];
          const baseOpacity = seededRandom() * [0.15, 0.25, 0.35, 0.4][layer] + [0.1, 0.2, 0.4, 0.6][layer];

          const colorChoice = seededRandom();
          let color;
          if (colorChoice < 0.7) {
            color = 'rgb(255, 255, 255)';
          } else if (colorChoice < 0.85) {
            color = 'rgb(200, 220, 255)';
          } else if (colorChoice < 0.95) {
            color = 'rgb(255, 240, 220)';
          } else {
            color = 'rgb(255, 200, 255)';
          }

          stars.push({
            x: baseX,
            y: baseY,
            baseX,
            baseY,
            size,
            opacity: baseOpacity,
            baseOpacity,
            color,
            layer,
            twinkleSpeed: seededRandom() * 0.5 + 0.5,
            twinklePhase: seededRandom() * Math.PI * 2,
          });
        }
      }
    };

    const drawNebula = (time: number) => {
      const nebulas = [
        { x: 0.4, y: 0.5, radius: 0.6, color1: 'rgba(100, 40, 180, 0.08)', color2: 'rgba(50, 20, 90, 0.03)', rotation: 0.1 },
        { x: 0.6, y: 0.3, radius: 0.5, color1: 'rgba(40, 80, 160, 0.07)', color2: 'rgba(20, 40, 80, 0.025)', rotation: -0.15 },
        { x: 0.2, y: 0.3, radius: 0.4, color1: 'rgba(140, 60, 200, 0.09)', color2: 'rgba(70, 30, 100, 0.035)', rotation: 0.08 },
        { x: 0.7, y: 0.6, radius: 0.5, color1: 'rgba(40, 120, 180, 0.08)', color2: 'rgba(20, 60, 90, 0.03)', rotation: -0.12 },
        { x: 0.5, y: 0.8, radius: 0.35, color1: 'rgba(180, 80, 220, 0.075)', color2: 'rgba(90, 40, 110, 0.025)', rotation: 0.2 },
        { x: 0.85, y: 0.2, radius: 0.25, color1: 'rgba(200, 60, 200, 0.1)', color2: 'rgba(100, 30, 100, 0.04)', rotation: -0.18 },
        { x: 0.15, y: 0.75, radius: 0.2, color1: 'rgba(60, 150, 220, 0.09)', color2: 'rgba(30, 75, 110, 0.035)', rotation: 0.25 },
      ];

      nebulas.forEach((nebula) => {
        const centerX = width * nebula.x;
        const centerY = height * nebula.y;
        const radius = width * nebula.radius;
        const rotation = time * nebula.rotation * 0.0001;

        const offsetX = Math.cos(rotation) * radius * 0.1;
        const offsetY = Math.sin(rotation) * radius * 0.1;

        const gradient = ctx.createRadialGradient(
          centerX + offsetX, centerY + offsetY, 0,
          centerX, centerY, radius
        );
        gradient.addColorStop(0, nebula.color1);
        gradient.addColorStop(0.3, nebula.color2);
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.02)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });
    };

    const drawStars = (time: number, mouseX: number, mouseY: number) => {
      stars.forEach((star) => {
        const parallaxAmount = (1 - star.layer / 3) * 0.05;
        const offsetX = (mouseX - width / 2) * parallaxAmount;
        const offsetY = (mouseY - height / 2) * parallaxAmount;

        star.x = star.baseX + offsetX;
        star.y = star.baseY + offsetY;

        if (star.layer >= 2) {
          const twinkle = Math.sin(time * 0.001 * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
          star.opacity = star.baseOpacity * twinkle;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace('rgb', 'rgba').replace(')', `, ${star.opacity})`);
        ctx.fill();

        if (star.layer === 3 && star.baseOpacity > 0.7) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = star.color;
          ctx.fill();
          ctx.shadowBlur = 0;

          if (seededRandom() > 0.7) {
            ctx.strokeStyle = star.color.replace('rgb', 'rgba').replace(')', `, ${star.opacity * 0.3})`);
            ctx.lineWidth = 0.4;

            ctx.beginPath();
            ctx.moveTo(star.x - star.size * 2.5, star.y);
            ctx.lineTo(star.x + star.size * 2.5, star.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(star.x, star.y - star.size * 2.5);
            ctx.lineTo(star.x, star.y + star.size * 2.5);
            ctx.stroke();
          }
        }
      });
    };

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      timeRef.current += 16;

      ctx.clearRect(0, 0, width, height);

      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#000000');
      bgGradient.addColorStop(0.3, '#000308');
      bgGradient.addColorStop(0.7, '#00040a');
      bgGradient.addColorStop(1, '#000000');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      drawNebula(timeRef.current);
      drawStars(timeRef.current, mouseX, mouseY);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    initStars();
    window.addEventListener('resize', () => {
      resize();
      initStars();
    });
    window.addEventListener('mousemove', handleMouseMove);

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMounted, isFirefox]);

  if (!isMounted) return null;

  const startScale = 0.6;
  const endScale = 1;
  const currentScale = startScale + (endScale - startScale) * telescopeZoom;

  const canvasStyles = isFirefox ? {
    zIndex: 0,
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    transform: `scale(${currentScale})`,
    transformOrigin: '50% center',
    transition: telescopeZoom === 0 ? 'none' : 'transform 0.05s linear',
  } : {
    zIndex: 0,
    left: '-20%',
    top: '-20%',
    width: '140%',
    height: '140%',
    transform: `scale(${currentScale})`,
    transformOrigin: '60% center',
    transition: telescopeZoom === 0 ? 'none' : 'transform 0.05s linear',
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed pointer-events-none"
      style={canvasStyles}
    />
  );
}
