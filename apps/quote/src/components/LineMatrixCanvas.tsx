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
}

export default function LineMatrixCanvas({ isMorphed }: { isMorphed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const segments = useRef<LineSegment[]>([]);
  const animationFrameId = useRef<number>(0);
  const time = useRef(0);

  // Grouped Paths for Dual Hemisphere (Wait, I'll use simple continent polygons for stability)
  const westPaths = useMemo(() => [
    "M20,15 L35,15 L40,25 L35,45 L25,48 L15,35 Z", // NA
    "M28,50 L40,55 L38,75 L30,85 L25,65 Z",       // SA
  ], []);

  const eastPaths = useMemo(() => [
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
      const lineSpacing = 12;
      const sampleStep = 4;
      
      const westMask = new Path2D();
      const eastMask = new Path2D();
      const scale = Math.min(w, h) * 0.0075;
      
      // Position West on the left wing, East on the right wing
      const oxWest = w * 0.05;
      const oxEast = w * 0.55;
      const oy = h * 0.15;

      westPaths.forEach(d => {
        const matrix = new DOMMatrix().translate(oxWest, oy).scale(scale, scale);
        westMask.addPath(new Path2D(d), matrix);
      });
      eastPaths.forEach(d => {
        const matrix = new DOMMatrix().translate(oxEast, oy).scale(scale, scale);
        eastMask.addPath(new Path2D(d), matrix);
      });

      // Generate Horizontal Lines (y = constant)
      for (let y = 0; y < h; y += lineSpacing) {
        let currentSeg: { x1: number, y1: number } | null = null;

        for (let x = 0; x < w; x += sampleStep) {
          const isInside = ctx.isPointInPath(westMask, x, y) || ctx.isPointInPath(eastMask, x, y);

          if (isInside && !currentSeg) {
            currentSeg = { x1: x, y1: y };
          } else if (!isInside && currentSeg) {
            addSeg(currentSeg.x1, currentSeg.y1, x, y);
            currentSeg = null;
          }
        }
        if (currentSeg) addSeg(currentSeg.x1, currentSeg.y1, w, y);
      }

      function addSeg(x1: number, y1: number, x2: number, y2: number) {
        // Handshake Targets (Move to center)
        const isLeft = x1 < w / 2;
        const tx1 = isLeft ? w * 0.45 + Math.random() * 20 : w * 0.55 - Math.random() * 20;
        const ty1 = h * 0.5 + (Math.random() - 0.5) * 80;
        
        segs.push({
          x1, y1, x2, y2,
          originX1: x1, originY1: y1, originX2: x2, originY2: y2,
          targetX1: tx1, targetY1: ty1,
          targetX2: tx1 + (x2-x1)*0.4, targetY2: ty1, // Stay horizontal
        });
      }

      segments.current = segs;
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.02;

      ctx.strokeStyle = "rgba(0,0,0,0.8)";
      ctx.lineWidth = 1;
      const sArray = segments.current;
      
      for (let i = 0; i < sArray.length; i++) {
        const s = sArray[i];
        
        // Horizontal Wave pulse
        const wave = isMorphed ? 0 : Math.sin(time.current + s.x1 * 0.01) * 3;
        
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
  }, [westPaths, eastPaths, isMorphed]);

  // Morph Animation
  useEffect(() => {
    segments.current.forEach((s) => {
      gsap.to(s, {
        x1: isMorphed ? s.targetX1 : s.originX1,
        y1: isMorphed ? s.targetY1 : s.originY1,
        x2: isMorphed ? s.targetX2 : s.originX2,
        y2: isMorphed ? s.targetY2 : s.originY2,
        duration: 1.8,
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
