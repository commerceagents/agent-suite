'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
}

interface ParticleCanvasProps {
  isMorphed: boolean;
}

export default function ParticleCanvas({ isMorphed }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const time = useRef(0);

  const TOTAL_PARTICLES = 1800;

  const data = useMemo(() => {
    const p: Particle[] = [];
    
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
        const isLeft = i < TOTAL_PARTICLES / 2;
        
        // --- Split World Map Clusters (Left/Right) ---
        let ox, oy;
        if (isLeft) {
            // Western Hemisphere (Left)
            ox = 0.15 + Math.random() * 0.25;
            oy = 0.3 + Math.random() * 0.4;
        } else {
            // Eastern Hemisphere (Right)
            ox = 0.6 + Math.random() * 0.25;
            oy = 0.3 + Math.random() * 0.4;
        }

        // --- Central Handshake ---
        let tx, ty;
        if (isLeft) {
            tx = 0.4 + Math.random() * 0.08;
            ty = 0.45 + Math.random() * 0.1;
        } else {
            tx = 0.52 + Math.random() * 0.08;
            ty = 0.45 + Math.random() * 0.1;
        }

        p.push({
            x: ox, y: oy,
            originX: ox, originY: oy,
            targetX: tx, targetY: ty,
            size: 1.5, // Uniform sharp size
            opacity: 0.8 // High contrast
        });
    }
    return p;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Map normalized coordinates to screen
      if (particles.current.length === 0) {
        particles.current = data.map(p => ({
            ...p,
            x: p.originX * canvas.width,
            y: p.originY * canvas.height,
            originX: p.originX * canvas.width,
            originY: p.originY * canvas.height,
            targetX: p.targetX * canvas.width,
            targetY: p.targetY * canvas.height
        }));
      } else {
          // Re-scale existing particles on resize
          particles.current.forEach(p => {
              p.originX = (p.originX / canvas.width) * window.innerWidth;
              p.originY = (p.originY / canvas.height) * window.innerHeight;
              p.targetX = (p.targetX / canvas.width) * window.innerWidth;
              p.targetY = (p.targetY / canvas.height) * window.innerHeight;
          });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.01;

      const pArray = particles.current;
      for (let i = 0; i < pArray.length; i++) {
        const p = pArray[i];
        
        // Subtle wave motion (only in non-morphed state)
        const wave = isMorphed ? 0 : Math.sin(time.current + p.x * 0.01) * 10;
        
        ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y + wave, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [data, isMorphed]);

  // Morph Animation
  useEffect(() => {
    particles.current.forEach((p) => {
      gsap.to(p, {
        x: isMorphed ? p.targetX : p.originX,
        y: isMorphed ? p.targetY : p.originY,
        duration: 2.2,
        ease: 'expo.inOut',
        delay: Math.random() * 0.4
      });
    });
  }, [isMorphed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
