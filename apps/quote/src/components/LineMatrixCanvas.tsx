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

  // REAL WORLD MAP PATH STRING (Simplified High-Quality Silhouettes)
  const WORLD_MAP_PATH = "M130,140 L210,105 L260,130 L250,205 L170,225 L120,205 Z M220,265 L265,305 L245,385 L195,425 L175,355 Z M420,125 L500,125 L540,185 L505,265 L465,325 L425,265 L445,185 Z M545,125 L725,145 L765,225 L705,265 L625,245 L585,205 Z M725,325 L785,345 L765,385 L705,365 Z";

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
      const sampleStep = 8;
      
      const mask = new Path2D(WORLD_MAP_PATH);
      
      // Scale and Center the Real Map
      const scale = Math.min(w, h) * 0.0016;
      const offsetX = w * 0.1;
      const offsetY = h * 0.12;
      const matrix = new DOMMatrix().translate(offsetX, offsetY).scale(scale, scale);
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
        // Symmetric Handshake Targets
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
      time.current += 0.012;

      const scrollOffset = (time.current * 70) % 80;
      scanY.current = (time.current * 140) % (canvas.height + 250) - 120;

      const sArray = segments.current;
      
      for (let i = 0; i < sArray.length; i++) {
        const s = sArray[i];
        const wave = isMorphed ? 0 : Math.sin((s.x1 + time.current * 60) * 0.01) * 2;
        const scroll = isMorphed ? 0 : scrollOffset % 10;
        const py = s.y1 + wave + scroll;

        const distToScan = Math.abs(py - scanY.current);
        const scanIntensity = Math.max(0, 1 - distToScan / 120);

        // SVG Teal Accent: #00eaff
        ctx.strokeStyle = "#00eaff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.35 + scanIntensity * 0.65;
        
        ctx.shadowBlur = scanIntensity * 14;
        ctx.shadowColor = "#00eaff";

        ctx.beginPath();
        ctx.moveTo(s.x1, py);
        ctx.lineTo(s.x2, py);
        ctx.stroke();
      }

      // Scanner Overlay
      const gradient = ctx.createLinearGradient(0, scanY.current - 50, 0, scanY.current + 50);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, "rgba(0, 234, 255, 0.3)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.shadowBlur = 0;
      ctx.fillRect(0, scanY.current - 50, canvas.width, 100);

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
