'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  opacity: number;
}

export default function ParticleMatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>(0);

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
      const pCount = Math.floor((canvas.width * canvas.height) / 8000);
      const newParticles: Particle[] = [];

      for (let i = 0; i < pCount; i++) {
        const z = Math.random(); // 0 = background, 1 = foreground
        newParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z,
          r: 1 + z * 3, // Foreground dots are larger
          vx: (Math.random() - 0.5) * 0.2, // Drifting
          vy: -0.2 - z * 0.5, // Floating upward
          opacity: 0.1 + z * 0.6 // Foreground dots are more opaque
        });
      }
      particles.current = newParticles;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        // Anti-gravity movement
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Mouse Interaction (Repel)
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          p.x -= Math.cos(angle) * force * 2;
          p.y -= Math.sin(angle) * force * 2;
        }

        // Parallax depth color / glow
        // Electric Blue / Violet accents based on depth
        const hue = p.z > 0.5 ? 220 : 260; // Blue for foreground, Violet for background
        ctx.fillStyle = `hsla(0, 0%, 100%, ${p.opacity})`;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        // Glow effect
        if (p.z > 0.7) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = `hsla(0, 0%, 100%, 0.5)`;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
