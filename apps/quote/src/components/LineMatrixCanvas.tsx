'use client';

import React, { useEffect, useRef } from 'react';
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
  const scanY = useRef(0);

  // FINAL FLATTENED PULSE PATH (From Design Spec)
  const WORLD_MAP_PATH = "M42,235 L85,210 L130,215 L170,200 L210,220 L250,210 L300,220 L340,205 L380,215 L420,210 L460,225 L500,215 L540,220 L580,210 L620,220 L660,215 L700,225 L740,210 L780,220 L820,215 L860,225 L900,215 L940,220 L980,210 L980,260 L940,255 L900,265 L860,255 L820,270 L780,260 L740,275 L700,260 L660,270 L620,260 L580,275 L540,265 L500,275 L460,265 L420,275 L380,265 L340,275 L300,260 L250,275 L210,265 L170,275 L130,260 L85,275 L42,260 Z";

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
      const lineSpacing = 8;
      const sampleStep = 8;
      
      const mask = new Path2D(WORLD_MAP_PATH);
      
      // Scaling for "130% wide" stylized look
      const scaleX = (w * 1.3) / 1000;
      const scaleY = (h * 0.8) / 500;
      const offsetX = -w * 0.15;
      const offsetY = h * 0.1;
      const matrix = new DOMMatrix().translate(offsetX, offsetY).scale(scaleX, scaleY);
      const scaledMask = new Path2D();
      scaledMask.addPath(mask, matrix);

      for (let y = 0; y < h; y += lineSpacing) {
        let currentSeg: { x1: number, y1: number } | null = null;

        for (let x = 0; x < w; x += sampleStep) {
          const isInside = ctx.isPointInPath(scaledMask, x, y);

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
        const tx1 = isLeft ? w * 0.44 + Math.random() * 25 : w * 0.56 - Math.random() * 25;
        const ty1 = h * 0.5 + (Math.random() - 0.5) * 110;
        
        segs.push({
          x1, y1, x2, y2,
          originX1: x1, originY1: y1, originX2: x2, originY2: y2,
          targetX1: tx1, targetY1: ty1,
          targetX2: tx1 + (x2 - x1) * 0.4, targetY2: ty1,
          opacity: 1.0
        });
      }

      segments.current = segs;
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.016; // 6s rhythm equivalent
      
      const scrollOffset = (time.current * 80) % 80;
      scanY.current = (time.current * 120) % (canvas.height + 400) - 200;

      const sArray = segments.current;
      
      for (let i = 0; i < sArray.length; i++) {
        const s = sArray[i];
        const wave = isMorphed ? 0 : Math.sin((s.x1 + time.current * 50) * 0.01) * 1.2;
        const scroll = isMorphed ? 0 : scrollOffset % 15;
        const py = s.y1 + wave + scroll;

        const distToScan = Math.abs(py - scanY.current);
        const scanIntensity = Math.max(0, 1 - distToScan / 150);

        const verticalPos = py / canvas.height;
        const fadeIntensity = 1 - Math.pow(Math.abs(verticalPos - 0.5) * 2, 2.5);

        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = (0.2 * fadeIntensity) + (scanIntensity * 0.8);
        
        ctx.shadowBlur = 4 + scanIntensity * 12;
        ctx.shadowColor = "#00e5ff";

        ctx.beginPath();
        ctx.moveTo(s.x1, py);
        ctx.lineTo(s.x2, py);
        ctx.stroke();
      }

      // Enhanced Scan Glow
      const gradient = ctx.createLinearGradient(0, scanY.current - 80, 0, scanY.current + 80);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, "rgba(0, 229, 255, 0.2)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY.current - 80, canvas.width, 160);

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isMorphed]);

  // Handle Morph Animation
  useEffect(() => {
    if (!segments.current.length) return;
    
    segments.current.forEach((s) => {
      gsap.to(s, {
        x1: isMorphed ? s.targetX1 : s.originX1,
        y1: isMorphed ? s.targetY1 : s.originY1,
        x2: isMorphed ? s.targetX2 : s.originX2,
        y2: isMorphed ? s.targetY2 : s.originY2,
        duration: 2.2,
        ease: 'expo.inOut',
        delay: Math.random() * 0.3
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
