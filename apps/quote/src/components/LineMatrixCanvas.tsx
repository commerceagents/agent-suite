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

    // Procedural "Map-Like" Continent Generator
    const isLand = (x: number, y: number, w: number, h: number) => {
      let nx = x / w - 0.5;
      let ny = y / h - 0.5;
      nx *= 2; // Stretch
      ny *= 1;
      
      // Mathematical continent-like clusters
      let val = Math.sin(nx * 3) + Math.cos(ny * 4) + Math.sin((nx + ny) * 2);
      return val > 1.2;
    };

    const generateSegments = () => {
      const segs: LineSegment[] = [];
      const w = canvas.width;
      const h = canvas.height;
      const lineSpacing = 8;
      const sampleStep = 8;

      for (let y = 0; y < h; y += lineSpacing) {
        let currentSeg: { x1: number, y1: number } | null = null;

        for (let x = 0; x < w; x += sampleStep) {
          const land = isLand(x, y, w, h);

          if (land && !currentSeg) {
            currentSeg = { x1: x, y1: y };
          } else if (!land && currentSeg) {
            addSeg(currentSeg.x1, currentSeg.y1, x, y);
            currentSeg = null;
          }
        }
        if (currentSeg) addSeg(currentSeg.x1, currentSeg.y1, w, y);
      }

      function addSeg(x1: number, y1: number, x2: number, y2: number) {
        const isLeft = x1 < w / 2;
        // Morph targets for Handshake
        const tx1 = isLeft ? w * 0.44 + Math.random() * 25 : w * 0.56 - Math.random() * 25;
        const ty1 = h * 0.5 + (Math.random() - 0.5) * 100;
        
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
      time.current += 0.015;
      
      // Vertical Scroll Offset (Mimicking your moveLines CSS animation)
      const scrollOffset = (time.current * 80) % 100;
      scanY.current = (time.current * 120) % (canvas.height + 200) - 100;

      const sArray = segments.current;
      
      for (let i = 0; i < sArray.length; i++) {
        const s = sArray[i];
        
        // Combine your vertical motion + subtle wave
        const wave = isMorphed ? 0 : Math.sin((s.x1 + time.current * 50) * 0.01) * 2;
        const scroll = isMorphed ? 0 : scrollOffset % 10; 
        const py = s.y1 + wave + scroll;

        const distToScan = Math.abs(py - scanY.current);
        const scanIntensity = Math.max(0, 1 - distToScan / 100);

        // SVG Reference Color: #00eaff
        ctx.strokeStyle = "#00eaff";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4 + scanIntensity * 0.6;
        
        // Premium SVG-Style Glow
        ctx.shadowBlur = scanIntensity * 12;
        ctx.shadowColor = "#00eaff";

        ctx.beginPath();
        ctx.moveTo(s.x1, py);
        ctx.lineTo(s.x2, py);
        ctx.stroke();
      }

      // Scanner Beam Overlay
      const gradient = ctx.createLinearGradient(0, scanY.current - 50, 0, scanY.current + 50);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, "rgba(0, 234, 255, 0.35)");
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

  // Sync GSAP morph animation
  useEffect(() => {
    if (!segments.current.length) return;
    
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
      className="absolute inset-0 z-0 pointer-events-none bg-black"
    />
  );
}
