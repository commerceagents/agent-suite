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

  const continentPaths = useMemo(() => [
    // North America
    "M281.07,409.41l0.09,-0.88l-1.53,0.06l-0.51,-1.05l-0.74,0.07l-1.66,-0.76l-2.19,-0.01l-0.35,0.5l-2.43,-0.47l-1.71,-0.13l-0.63,0.82l1.77,0.46l-0.02,1.13l1.28,1.28l-1.01,0.65l-2.12,-0.24l-2.58,-0.41l-0.25,0.95l1.5,0.91l1.31,-0.55l1.71,0.21l1.32,-0.2l1.86,0.5l0.14,0.84l0.72,0.46l1.12,-2.01",
    // South America
    "M302.37,434.36l-0.06,-1.12l1.61,-0.37l0.59,0.1l-0.11,2.11l-2.34,0.31l-0.5,-0.25L302.37,434.36zM309.41,631.56l-2.38,-1.12l-3.36,2.7l1.4,2.05l2.38,-2.05l1.26,1.59l3.79,-1.36l0.84,-1.58l-2.24,-2.01L309.41,631.56z",
    // Europe
    "M533.37,106.83l1.94,-3.42l-1.69,-4.34l5.81,-2.78l1.11,5.18l4.05,3.03l-6.26,5.36L533.37,106.83zM531.04,75.59l0.5,4.32l8.27,2.56l8.13,-1.81l4.16,-8.52l-5.5,-5.8l-7.09,-4.26l-2.84,5.09l-4.07,-4.08l-8.66,4.72l3.07,7.48L531.04,75.59z",
    // Africa
    "M618.63,430.43l-0.06,-0.79l-1.06,0.01l-1.33,0.97l-1.49,0.29l-1.29,0.42l-0.9,0.06l-1.6,0.1l-1,0.52l-1.39,0.19l-2.47,0.88l-3.05,0.34l-2.64,0.73l-1.39,-0.01l-1.26,-1.19l-0.55,-1.17l-0.91,-0.52l-1.2,-0.78l1.6,-0.68l0.09,-1.18l-0.66,-0.88",
    // Asia
    "M835.21,465.56l-1.16,-1.47l0.43,-1.69l1.45,0.27l0.15,-2.43l-0.26,-1.14l-1.66,-0.24l-0.2,-1.52l-0.93,1.01l-0.56,2.23l0.83,3.56l1.13,1.76L835.21,465.56zM829.05,473.44l1.94,0.51l1.05,-0.93l-0.7,-0.92l-2.84,0.13L829.05,473.44z",
    // Australia
    "M944.1,508.23l1.76,1.67l-0.92,0.38l-0.94,-1.27L944.1,508.23zM942.92,507.59l0.58,-0.16l0.75,0.36l-0.46,-2.33"
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
      // amCharts coordinates are roughly in a 1000x600 range
      // Let's use a scale that fits 80% of the screen width
      const baseMapWidth = 1000;
      const baseMapHeight = 600;
      
      const scale = Math.min(w / baseMapWidth, h / baseMapHeight) * 0.8;
      
      // Center the map
      const offsetX = (w - baseMapWidth * scale) / 2;
      const offsetY = (h - baseMapHeight * scale) / 2;

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
