'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

interface Particle {
  x: number;
  y: number;
  z: number;
  
  // Globe positions
  gx: number;
  gy: number;
  gz: number;
  
  // Handshake positions
  hx: number;
  hy: number;
  hz: number;
  
  // Appearance
  size: number;
  opacity: number;
  group: 'left' | 'right';
}

interface ParticleCanvasProps {
  isMorphed: boolean;
}

export default function ParticleCanvas({ isMorphed }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rotationAngle = useRef(0);
  const animationFrameId = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0 });

  const FOCAL_LENGTH = 400;
  const TOTAL_PARTICLES = 2500; // Optimal for performance + detail

  const data = useMemo(() => {
    const p: Particle[] = [];
    const RADIUS = 240;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const isLeft = i < TOTAL_PARTICLES / 2;
      
      // --- Globe Data (3D Sphere) ---
      const lat = Math.random() * Math.PI;
      const lon = Math.random() * 2 * Math.PI;
      const gx = RADIUS * Math.sin(lat) * Math.cos(lon);
      const gy = RADIUS * Math.sin(lat) * Math.sin(lon);
      const gz = RADIUS * Math.cos(lat);

      // --- Handshake Data (Stylized Hands) ---
      let hx, hy, hz = 0;
      if (isLeft) {
        // Left hand "Block"
        hx = -180 + Math.random() * 120 + (i % 50); // Cluster into rows
        hy = -40 + Math.random() * 80 + Math.sin(i * 0.1) * 20;
      } else {
        // Right hand "Block"
        hx = 60 + Math.random() * 120 - (i % 50);
        hy = -40 + Math.random() * 80 + Math.sin(i * 0.1) * 20;
      }

      p.push({
        x: gx, y: gy, z: gz,
        gx, gy, gz,
        hx, hy, hz,
        size: 0.8 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.7,
        group: isLeft ? 'left' : 'right'
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
      particles.current = [...data];
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;

      if (!isMorphed) rotationAngle.current += 0.003;

      const cosA = Math.cos(rotationAngle.current);
      const sinA = Math.sin(rotationAngle.current);

      // --- Draw Cycle ---
      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        
        let rx = p.x;
        let rz = p.z;
        
        // Rotation for Globe
        if (!isMorphed) {
          rx = p.x * cosA - p.z * sinA;
          rz = p.x * sinA + p.z * cosA;
        }

        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + rz);
        const renderX = centerX + rx * scale;
        const renderY = centerY + p.y * scale;
        
        // Cinematic Edge Fading
        const depthAlpha = (FOCAL_LENGTH + rz) / (FOCAL_LENGTH * 2);
        const distFromCenter = Math.sqrt(Math.pow(renderX - centerX, 2) + Math.pow(renderY - centerY, 2));
        const vignetteAlpha = 1 - Math.min(1, distFromCenter / (w * 0.7));
        
        const finalAlpha = p.opacity * (1 - depthAlpha) * vignetteAlpha;

        if (finalAlpha < 0.05) continue;

        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
        
        // Particle Glow (Subtle bloom)
        if (isMorphed && finalAlpha > 0.4) {
           ctx.shadowBlur = 4;
           ctx.shadowColor = 'white';
        }

        ctx.beginPath();
        ctx.arc(renderX, renderY, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow for performance
        ctx.shadowBlur = 0;
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isMorphed, data]);

  // Cinematic Morph Logic
  useEffect(() => {
    particles.current.forEach((p, i) => {
      const delay = Math.random() * 0.8;
      
      if (isMorphed) {
        // Step 1: Disperse temporarily to edges for "Streaming" effect
        const edgeX = p.group === 'left' ? -1000 : 1000;
        
        const timeline = gsap.timeline();
        timeline.to(p, {
          x: edgeX,
          duration: 0.8,
          ease: 'power2.in',
          delay: delay * 0.2
        }).to(p, {
          x: p.hx,
          y: p.hy,
          z: p.hz,
          duration: 1.5,
          ease: 'expo.out'
        });
      } else {
        // Back to Globe
        gsap.to(p, {
          x: p.gx,
          y: p.gy,
          z: p.gz,
          duration: 2,
          ease: 'power3.inOut',
          delay: delay * 0.5
        });
      }
    });

    // Rotation snap/slowdown
    if (isMorphed) {
      gsap.to(rotationAngle, {
        current: Math.round(rotationAngle.current / (Math.PI * 2)) * (Math.PI * 2),
        duration: 1.5,
        ease: 'power3.out'
      });
    }
  }, [isMorphed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ filter: 'contrast(1.1) brightness(1.1)' }} 
    />
  );
}
