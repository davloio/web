'use client';

import { useEffect, useRef, useState } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawSpace();
    };

    let seed = 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const drawSpace = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#000000');
      bgGradient.addColorStop(0.3, '#000205');
      bgGradient.addColorStop(0.7, '#000308');
      bgGradient.addColorStop(1, '#000000');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const addNebula = (x: number, y: number, radius: number, color1: string, color2: string, depth: number = 0) => {
        const nebula = ctx.createRadialGradient(x, y, 0, x, y, radius);
        nebula.addColorStop(0, color1);
        nebula.addColorStop(0.3, color2);
        nebula.addColorStop(0.6, `rgba(0, 0, 0, ${0.05 - depth * 0.01})`);
        nebula.addColorStop(1, 'transparent');
        ctx.fillStyle = nebula;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      addNebula(canvas.width * 0.4, canvas.height * 0.5, canvas.width * 0.6, 'rgba(20, 10, 40, 0.03)', 'rgba(10, 5, 20, 0.01)', 3);
      addNebula(canvas.width * 0.6, canvas.height * 0.3, canvas.width * 0.5, 'rgba(15, 15, 30, 0.025)', 'rgba(8, 8, 15, 0.01)', 3);

      addNebula(canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.4, 'rgba(40, 15, 70, 0.04)', 'rgba(20, 8, 35, 0.015)', 2);
      addNebula(canvas.width * 0.7, canvas.height * 0.6, canvas.width * 0.5, 'rgba(15, 30, 80, 0.035)', 'rgba(8, 15, 40, 0.01)', 2);
      addNebula(canvas.width * 0.5, canvas.height * 0.8, canvas.width * 0.35, 'rgba(50, 30, 100, 0.03)', 'rgba(25, 15, 50, 0.008)', 2);

      addNebula(canvas.width * 0.85, canvas.height * 0.2, canvas.width * 0.25, 'rgba(60, 20, 100, 0.045)', 'rgba(30, 10, 50, 0.015)', 1);
      addNebula(canvas.width * 0.15, canvas.height * 0.75, canvas.width * 0.2, 'rgba(25, 45, 110, 0.04)', 'rgba(12, 22, 55, 0.012)', 1);

      seed = 54321;

      for (let i = 0; i < 1200; i++) {
        const x = seededRandom() * canvas.width;
        const y = seededRandom() * canvas.height;
        const size = seededRandom() * 0.3 + 0.2;
        const opacity = seededRandom() * 0.15 + 0.1;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < 600; i++) {
        const x = seededRandom() * canvas.width;
        const y = seededRandom() * canvas.height;
        const size = seededRandom() * 0.4 + 0.4;
        const opacity = seededRandom() * 0.2 + 0.2;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < 150; i++) {
        const x = seededRandom() * canvas.width;
        const y = seededRandom() * canvas.height;
        const size = seededRandom() * 0.8 + 0.6;
        const opacity = seededRandom() * 0.3 + 0.4;

        const colorChoice = seededRandom();
        let color;
        if (colorChoice < 0.75) {
          color = `rgba(255, 255, 255, ${opacity})`;
        } else if (colorChoice < 0.9) {
          color = `rgba(200, 220, 255, ${opacity})`;
        } else {
          color = `rgba(255, 240, 220, ${opacity})`;
        }

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (opacity > 0.6) {
          ctx.shadowBlur = 1.5;
          ctx.shadowColor = color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      for (let i = 0; i < 20; i++) {
        const x = seededRandom() * canvas.width;
        const y = seededRandom() * canvas.height;
        const size = seededRandom() * 1.2 + 1.2;
        const opacity = seededRandom() * 0.2 + 0.7;

        const colorChoice = seededRandom();
        let color;
        if (colorChoice < 0.6) {
          color = `rgba(255, 255, 255, ${opacity})`;
        } else if (colorChoice < 0.8) {
          color = `rgba(180, 210, 255, ${opacity})`;
        } else if (colorChoice < 0.93) {
          color = `rgba(255, 245, 220, ${opacity})`;
        } else {
          color = `rgba(255, 200, 180, ${opacity})`;
        }

        ctx.shadowBlur = 6;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (seededRandom() > 0.7) {
          ctx.strokeStyle = color.replace(/[\d.]+\)$/g, `${opacity * 0.3})`);
          ctx.lineWidth = 0.4;

          ctx.beginPath();
          ctx.moveTo(x - size * 2.5, y);
          ctx.lineTo(x + size * 2.5, y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x, y - size * 2.5);
          ctx.lineTo(x, y + size * 2.5);
          ctx.stroke();
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
      }}
    />
  );
}
