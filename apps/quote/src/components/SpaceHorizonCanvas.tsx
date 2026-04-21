'use client';

import React, { useEffect, useRef } from 'react';

interface Beam {
  id: number;
  angle: number; // Radial angle from central lunar origin
  radius: number; // Current distance from lunar origin
  length: number;
  speed: number;
  baseOpacity: number;
  thickness: number;
  pulseOffset: number;
  pulseSpeed: number;
}

interface SpaceHorizonCanvasProps {
  linesOnly?: boolean;
}

export default function SpaceHorizonCanvas({ linesOnly = false }: SpaceHorizonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beams = useRef<Beam[]>([]);
  const animationFrameId = useRef<number>(0);
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initBeams();
    };

    const initBeams = () => {
      const newBeams: Beam[] = [];
      const beamCount = linesOnly ? 16 : 28;
      
      // Arc settings - origin deep below horizon to create the gentle curve
      const spread = 0.45; // Radian spread (wider = more tilt at edges)

      for (let i = 0; i < beamCount; i++) {
        // Staggered distribution with some randomness
        const normalizedPos = (i / (beamCount - 1)) - 0.5;
        const angle = (-Math.PI / 2) + (normalizedPos * spread) + (Math.random() * 0.04 - 0.02);
        
        newBeams.push({
          id: i,
          angle,
          radius: Math.random() * (canvas.height * 1.5),
          length: 80 + Math.random() * 160,
          speed: 0.8 + Math.random() * 1.2,
          baseOpacity: 0.4 + Math.random() * 0.5,
          thickness: 0.8 + Math.random() * 1.0,
          pulseOffset: Math.random() * Math.PI * 2,
          pulseSpeed: 2 + Math.random() * 3
        });
      }
      beams.current = newBeams;
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      time.current += 0.015;

      // Transparent clear for overlay usage
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Origin point for the Lunar Arc (Deep below center)
      const originX = canvas.width / 2;
      const originY = canvas.height * 1.6;
      const baseRadius = canvas.height * 0.8;

      beams.current.forEach((beam) => {
        // ENERGY FLOW: Rise Upwards (Radius decreases as it moves towards center, wait...)
        // Actually, since origin is below, moving UP means radius DECREASES.
        beam.radius -= beam.speed;
        
        // Wrap logic: when it gets too far up (off screen), reset to bottom horizon
        if (beam.radius < 0) {
          beam.radius = originY + 100;
        }

        // 'Living Flame' Animation: Pulse scale and opacity
        const pulse = Math.sin(time.current * beam.pulseSpeed + beam.pulseOffset);
        const flicker = 0.8 + pulse * 0.2;
        const currentOpacity = beam.baseOpacity * (0.6 + pulse * 0.4);
        
        // Beam points calculation
        const startR = beam.radius;
        const endR = beam.radius + (beam.length * flicker);
        
        const x1 = originX + Math.cos(beam.angle) * startR;
        const y1 = originY + Math.sin(beam.angle) * startR;
        const x2 = originX + Math.cos(beam.angle) * endR;
        const y2 = originY + Math.sin(beam.angle) * endR;

        // Skip if entirely off screen
        if (y1 < -200 || y2 > canvas.height + 200) {
          if (beam.radius < -200) beam.radius = originY;
          return;
        }

        ctx.save();
        ctx.lineCap = 'round';
        ctx.globalAlpha = currentOpacity;
        
        // PASS 1: Volumetric Outer Glow (Layered Blur)
        ctx.shadowBlur = 12 * flicker;
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = beam.thickness * 2.5 * flicker;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // PASS 2: Sharp Inner Core (Digital Precision)
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = beam.thickness;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        ctx.restore();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [linesOnly]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 z-0 pointer-events-none ${linesOnly ? '' : 'bg-transparent'}`}
    />
  );
}
