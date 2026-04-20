'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  baseY: number;
  size: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const time = useRef(0);

  // Simplified World Continent Paths (Silhouettes)
  // Expressed as simple polygons for North America, South America, Africa, Eurasia, Australia
  const continentPaths = useMemo(() => {
    return [
      // North America
      "M20,15 L35,15 L40,25 L35,45 L25,48 L15,35 Z",
      // South America
      "M28,50 L40,55 L38,75 L30,85 L25,65 Z",
      // Africa
      "M45,35 L60,35 L65,55 L60,75 L50,80 L42,60 Z",
      // Eurasia
      "M50,10 L85,10 L95,25 L90,55 L75,60 L55,55 L45,30 Z",
      // Australia
      "M80,65 L95,65 L95,80 L85,85 L78,75 Z"
    ];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateParticles();
    };

    const generateParticles = () => {
      const p: Particle[] = [];
      const w = canvas.width;
      const h = canvas.height;
      const spacing = 10; // Spacing between dots
      
      // Create Path2D for masking
      const mask = new Path2D();
      continentPaths.forEach(d => {
        // Scale and Center the paths
        const path = new Path2D();
        // The values in continentPaths are 0-100 relative
        const scale = Math.min(w, h) * 0.008;
        const offsetX = w * 0.1;
        const offsetY = h * 0.1;

        // We use a matrix to scale and position the SVG strings
        const matrix = new DOMMatrix();
        matrix.translateSelf(offsetX, offsetY);
        matrix.scaleSelf(scale, scale);
        
        const tempPath = new Path2D(d);
        mask.addPath(tempPath, matrix);
      });

      // Iterate through grid
      for (let x = 0; x < w; x += spacing) {
        for (let y = 0; y < h; y += spacing) {
          if (ctx.isPointInPath(mask, x, y)) {
            p.push({
              x,
              y,
              baseY: y,
              size: 1.5,
            });
          }
        }
      }
      particles.current = p;
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.02;

      ctx.fillStyle = "black";
      const pArray = particles.current;
      
      for (let i = 0; i < pArray.length; i++) {
        const p = pArray[i];
        
        // Subtle wave motion
        const wave = Math.sin(time.current + p.x * 0.01) * 3;
        
        ctx.beginPath();
        ctx.arc(p.x, p.baseY + wave, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [continentPaths]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
