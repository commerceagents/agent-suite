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

export default function LineMatrixCanvas({ isMorphed }: { isMorphed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const segments = useRef<LineSegment[]>([]);
  const animationFrameId = useRef<number>(0);
  const time = useRef(0);

  // Simplified but Robust Continental Silhouettes (for 100% visibility)
  const continentPaths = useMemo(() => [
    // North America
    { side: 'left', d: "M100,50 L250,50 L300,150 L250,250 L100,250 Z" },
    // South America
    { side: 'left', d: "M200,300 L300,300 L320,450 L200,450 Z" },
    // Eurasia / Africa
    { side: 'right', d: "M450,50 L850,50 L900,150 L850,300 L450,350 Z" },
    // Australia
    { side: 'right', d: "M800,400 L950,400 L950,500 L800,500 Z" }
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
      const sampleStep = 5;
      
      const leftMask = new Path2D();
      const rightMask = new Path2D();
      
      // Scaling and Centering Logic
      const scale = Math.min(w, h) * 0.0014;
      const offsetX = w * 0.1;
      const offsetY = h * 0.15;

      continentPaths.forEach(p => {
        const ox = p.side === 'left' ? -w * 0.12 : w * 0.12;
        const matrix = new DOMMatrix().translate(offsetX + ox, offsetY).scale(scale, scale);
        const m = p.side === 'left' ? leftMask : rightMask;
        m.addPath(new Path2D(p.d), matrix);
      });

      for (let y = 0; y < h; y += lineSpacing) {
        let currentSeg: { x1: number, y1: number } | null = null;

        for (let x = 0; x < w; x += sampleStep) {
          const isInside = ctx.isPointInPath(leftMask, x, y) || ctx.isPointInPath(rightMask, x, y);

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
        const isLeft = x1 < w / 2;
        // Handshake Morph Targets - Improved Symmetry
        const tx1 = isLeft ? w * 0.45 + Math.random() * 20 : w * 0.55 - Math.random() * 20;
        const ty1 = h * 0.5 + (Math.random() - 0.5) * 80;
        
        segs.push({
          x1, y1, x2, y2,
          originX1: x1, originY1: y1, originX2: x2, originY2: y2,
          targetX1: tx1, targetY1: ty1,
          targetX2: tx1 + (x2-x1)*0.3, targetY2: ty1,
          opacity: 1.0
        });
      }

      segments.current = segs;
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.03;

      // Digital Radiance Style
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00FFFF";
      
      const sArray = segments.current;
      
      for (let i = 0; i < sArray.length; i++) {
        const s = sArray[i];
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
  }, [continentPaths, isMorphed]);

  // Handle Morph Animation with GSAP
  useEffect(() => {
    if (!segments.current.length) return;

    segments.current.forEach((s) => {
      gsap.to(s, {
        x1: isMorphed ? s.targetX1 : s.originX1,
        y1: isMorphed ? s.targetY1 : s.originY1,
        x2: isMorphed ? s.targetX2 : s.originX2,
        y2: isMorphed ? s.targetY2 : s.originY2,
        duration: 1.5,
        ease: 'power3.inOut',
        delay: Math.random() * 0.2
      });
    });
  }, [isMorphed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none bg-black"
    />
  );
}
