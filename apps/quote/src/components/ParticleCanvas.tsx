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

  // Simplified World Map Path (Continents Only)
  // This is a high-quality, normalized path (x: 0-1000, y: 0-500)
  const continentPaths = useMemo(() => [
    // Simplified North America
    "M100,100 L150,80 L200,90 L250,150 L220,250 L100,280 L50,180 Z", 
    // Simplified South America
    "M220,260 L300,280 L280,450 L240,480 L200,380 Z",
    // Simplified Africa
    "M450,250 L600,250 L650,350 L600,450 L480,480 L420,350 Z",
    // Simplified Eurasia
    "M450,100 L850,100 L950,250 L900,400 L700,450 L550,420 L450,250 Z",
    // Simplified Australia
    "M800,400 L950,400 L950,480 L850,480 L800,450 Z"
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
      const lineSpacing = 12;
      const sampleStep = 4;
      
      const mask = new Path2D();
      // The paths are in a rough 1000x500 box
      const mapW = 1000;
      const mapH = 500;
      const scale = Math.min(w / mapW, h / mapH) * 0.9;
      const offsetX = (w - mapW * scale) / 2;
      const offsetY = (h - mapH * scale) / 2;

      continentPaths.forEach(d => {
        const matrix = new DOMMatrix().translate(offsetX, offsetY).scale(scale, scale);
        mask.addPath(new Path2D(d), matrix);
      });

      // Generate Diagonal Lines (y = x + b)
      for (let b = -w; b < h + w; b += lineSpacing) {
        let currentSeg: { x1: number, y1: number } | null = null;

        for (let x = 0; x < w; x += sampleStep) {
          const y = x + b;
          if (y < 0 || y > h) continue;

          // Check against the mask
          if (ctx.isPointInPath(mask, x, y)) {
            if (!currentSeg) {
              currentSeg = { x1: x, y1: y };
            }
          } else {
            if (currentSeg) {
              addSeg(currentSeg.x1, currentSeg.y1, x, y);
              currentSeg = null;
            }
          }
        }
        if (currentSeg) addSeg(currentSeg.x1, currentSeg.y1, w, w + b);
      }

      function addSeg(x1: number, y1: number, x2: number, y2: number) {
        // Handshake Targets
        const isLeft = x1 < w / 2;
        const tx1 = isLeft ? w * 0.45 + Math.random() * 20 : w * 0.55 - Math.random() * 20;
        const ty1 = h * 0.5 + Math.random() * 40;
        
        segs.push({
          x1, y1, x2, y2,
          originX1: x1, originY1: y1, originX2: x2, originY2: y2,
          targetX1: tx1, targetY1: ty1,
          targetX2: tx1 + (x2-x1)*0.4, targetY2: ty1 + (y2-y1)*0.4,
          opacity: 0.7
        });
      }

      segments.current = segs;
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.02;

      ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
      ctx.lineWidth = 1.2;
      const sArray = segments.current;
      
      for (let i = 0; i < sArray.length; i++) {
        const s = sArray[i];
        const wave = isMorphed ? 0 : Math.sin(time.current + s.x1 * 0.02) * 2;
        
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
        delay: Math.random() * 0.4
      });
    });
  }, [isMorphed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
