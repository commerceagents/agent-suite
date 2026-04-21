'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  originX1: number;
  originY1: number;
  originX2: number;
  originY2: number;
  targetX1: number;
  targetY1: number;
  targetX2: number;
  targetY2: number;
  opacity: number;
}

export default function ParticleCanvas({ isMorphed }: { isMorphed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const segments = useRef<LineSegment[]>([]);
  const animationFrameId = useRef<number>(0);
  const time = useRef(0);

  // Simplified World Continent Paths (Silhouettes)
  const continentPaths = useMemo(() => [
    "M20,15 L35,15 L40,25 L35,45 L25,48 L15,35 Z", // NA
    "M28,50 L40,55 L38,75 L30,85 L25,65 Z",       // SA
    "M45,35 L60,35 L65,55 L60,75 L50,80 L42,60 Z", // Africa
    "M50,10 L85,10 L95,25 L90,55 L75,60 L55,55 L45,30 Z", // Eurasia
    "M80,65 L95,65 L95,80 L85,85 L78,75 Z"       // Australia
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateSegments();
    };

    const generateSegments = () => {
      const segs: LineSegment[] = [];
      const w = canvas.width;
      const h = canvas.height;
      const lineSpacing = 10;
      const sampleStep = 4;
      
      const mask = new Path2D();
      const scale = Math.min(w, h) * 0.008;
      const offsetX = w * 0.1;
      const offsetY = h * 0.1;

      continentPaths.forEach(d => {
        const matrix = new DOMMatrix().translate(offsetX, offsetY).scale(scale, scale);
        mask.addPath(new Path2D(d), matrix);
      });

      // Generate Diagonal Lines (y = x + b)
      // Range of b: from -w to h
      for (let b = -w; b < h + w; b += lineSpacing) {
        let currentSeg: { x1: number, y1: number } | null = null;

        for (let x = 0; x < w; x += sampleStep) {
          const y = x + b;
          if (y < 0 || y > h) continue;

          const isInside = ctx.isPointInPath(mask, x, y);

          if (isInside && !currentSeg) {
            currentSeg = { x1: x, y1: y };
          } else if (!isInside && currentSeg) {
            // End of segment
            addSeg(currentSeg.x1, currentSeg.y1, x, y);
            currentSeg = null;
          }
        }
        if (currentSeg) addSeg(currentSeg.x1, currentSeg.y1, w, w + b);
      }

      function addSeg(x1: number, y1: number, x2: number, y2: number) {
        // Handshake Targets (Split Left/Right)
        const isLeft = x1 < w / 2;
        const tx1 = isLeft ? w * 0.4 + Math.random() * 50 : w * 0.55 - Math.random() * 50;
        const ty1 = h * 0.45 + Math.random() * 80;
        
        segs.push({
          x1, y1, x2, y2,
          originX1: x1, originY1: y1, originX2: x2, originY2: y2,
          targetX1: tx1, targetY1: ty1,
          targetX2: tx1 + (x2-x1)*0.5, targetY2: ty1 + (y2-y1)*0.5,
          opacity: 0.6
        });
      }

      segments.current = segs;
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.02;

      ctx.strokeStyle = "black";
      ctx.lineWidth = 1.2;
      const sArray = segments.current;
      
      for (let i = 0; i < sArray.length; i++) {
        const s = sArray[i];
        
        // Subtle wave motion (vertical shift)
        const wave = isMorphed ? 0 : Math.sin(time.current + s.x1 * 0.02) * 2.5;
        
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1 + wave);
        ctx.lineTo(s.x2, s.y2 + wave);
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [continentPaths, isMorphed]);

  // Morph Animation
  useEffect(() => {
    segments.current.forEach((s) => {
      gsap.to(s, {
        x1: isMorphed ? s.targetX1 : s.originX1,
        y1: isMorphed ? s.targetY1 : s.originY1,
        x2: isMorphed ? s.targetX2 : s.originX2,
        y2: isMorphed ? s.targetY2 : s.originY2,
        duration: 2,
        ease: 'expo.inOut',
        delay: Math.random() * 0.3
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
