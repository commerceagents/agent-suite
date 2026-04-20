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
  const mouse = useRef({ x: 0, y: 0 });

  // Generate targets for World Map and Handshake
  const targetSets = useMemo(() => {
    // We'll simulate path sampling here
    // In a real production app, we'd load SVG path data
    // For this demo, we'll create procedural point clouds
    const worldPoints: {x: number, y: number}[] = [];
    const handPoints: {x: number, y: number}[] = [];

    const TOTAL_PARTICLES = 1200;

    // --- World Map Points (Simplified continents) ---
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
        // Pseudo-random points clustered in continent shapes
        const cluster = Math.random();
        let lx = 0, ly = 0;
        if (cluster < 0.3) { // Americas
            lx = 0.2 + Math.random() * 0.15;
            ly = 0.3 + Math.random() * 0.5;
        } else if (cluster < 0.6) { // Eurasia/Africa
            lx = 0.45 + Math.random() * 0.3;
            ly = 0.2 + Math.random() * 0.5;
        } else { // Australia/Islands
            lx = 0.8 + Math.random() * 0.1;
            ly = 0.6 + Math.random() * 0.2;
        }
        worldPoints.push({ x: lx, y: ly });

        // --- Handshake Points (Symmetrical curved shapes) ---
        // Left hand
        if (i < TOTAL_PARTICLES / 2) {
            handPoints.push({
                x: 0.3 + Math.random() * 0.2,
                y: 0.4 + Math.random() * 0.2
            });
        } else { // Right hand
            handPoints.push({
                x: 0.5 + Math.random() * 0.2,
                y: 0.4 + Math.random() * 0.2
            });
        }
    }

    return { world: worldPoints, handshake: handPoints };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const p: Particle[] = [];
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < targetSets.world.length; i++) {
        const wp = targetSets.world[i];
        const hp = targetSets.handshake[i];
        
        p.push({
          x: wp.x * w,
          y: wp.y * h,
          originX: wp.x * w,
          originY: wp.y * h,
          targetX: hp.x * w,
          targetY: hp.y * h,
          size: 1 + Math.random() * 1.5,
          opacity: 0.2 + Math.random() * 0.5,
        });
      }
      particles.current = p;
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const pArray = particles.current;
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < pArray.length; i++) {
        const p = pArray[i];
        
        // Mouse interaction (repel)
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, (100 - dist) / 100);
        
        const renderX = p.x + dx * force * 0.5;
        const renderY = p.y + dy * force * 0.5;

        // Gradient opacity based on distance from center
        const centerX = w / 2;
        const centerY = h / 2;
        const distFromCenter = Math.sqrt(Math.pow(renderX - centerX, 2) + Math.pow(renderY - centerY, 2));
        const centerAlpha = Math.max(0, 1 - distFromCenter / (w * 0.6));

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * centerAlpha})`;
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [targetSets]);

  // Morph Animation
  useEffect(() => {
    particles.current.forEach((p) => {
      gsap.to(p, {
        x: isMorphed ? p.targetX : p.originX,
        y: isMorphed ? p.targetY : p.originY,
        duration: 2,
        ease: 'power4.inOut',
        delay: Math.random() * 0.5,
      });
    });
  }, [isMorphed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ filter: 'blur(0.5px)' }} // Softens the halftone dots slightly
    />
  );
}
