'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

interface Particle {
  x: number;
  y: number;
  z: number;
  originX: number;
  originY: number;
  originZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  size: number;
  opacity: number;
}

interface ParticleCanvasProps {
  isMorphed: boolean;
}

export default function ParticleCanvas({ isMorphed }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rotationAngle = useRef(0);
  const animationFrameId = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0 });

  // Focal length for perspective projection
  const FOCAL_LENGTH = 400;

  // Generate targets for 3D Globe and 2D Handshake
  const targetSets = useMemo(() => {
    const worldPoints: {x: number, y: number, z: number}[] = [];
    const handPoints: {x: number, y: number, z: number}[] = [];

    const TOTAL_PARTICLES = 1600; // Increased for better globe definition
    const RADIUS = 220;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
        // --- 3D Globe Points (Spherical distribution) ---
        // We cluster them slightly to suggest continents
        const lat = Math.random() * Math.PI;
        const lon = Math.random() * 2 * Math.PI;
        
        // Basic spherical mapping
        const x = RADIUS * Math.sin(lat) * Math.cos(lon);
        const y = RADIUS * Math.sin(lat) * Math.sin(lon);
        const z = RADIUS * Math.cos(lat);

        worldPoints.push({ x, y, z });

        // --- 2D Handshake Points (Projected to z=0) ---
        // Left hand
        if (i < TOTAL_PARTICLES / 2) {
            handPoints.push({
                x: -150 + Math.random() * 100,
                y: -50 + Math.random() * 150,
                z: 0
            });
        } else { // Right hand
            handPoints.push({
                x: 50 + Math.random() * 100,
                y: -50 + Math.random() * 150,
                z: 0
            });
        }
    }

    return { world: worldPoints, handshake: handPoints };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const p: Particle[] = [];
      for (let i = 0; i < targetSets.world.length; i++) {
        const wp = targetSets.world[i];
        const hp = targetSets.handshake[i];
        
        p.push({
          x: wp.x, y: wp.y, z: wp.z,
          originX: wp.x, originY: wp.y, originZ: wp.z,
          targetX: hp.x, targetY: hp.y, targetZ: hp.z,
          size: 1 + Math.random() * 2,
          opacity: 0.1 + Math.random() * 0.6,
        });
      }
      particles.current = p;
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const pArray = particles.current;
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;

      // Update rotation if not morphed
      if (!isMorphed) {
        rotationAngle.current += 0.005;
      }

      const cosA = Math.cos(rotationAngle.current);
      const sinA = Math.sin(rotationAngle.current);

      for (let i = 0; i < pArray.length; i++) {
        const p = pArray[i];

        // Apply 3D Rotation (Y-axis)
        let rx = p.x;
        let rz = p.z;
        
        if (!isMorphed) {
            const tx = p.x * cosA - p.z * sinA;
            const tz = p.x * sinA + p.z * cosA;
            rx = tx;
            rz = tz;
        }

        // Perspective Projection
        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + rz);
        const renderX = centerX + rx * scale;
        const renderY = centerY + p.y * scale;

        // Depth-based styles
        const depthAlpha = (FOCAL_LENGTH + rz) / (FOCAL_LENGTH * 2);
        const finalAlpha = p.opacity * Math.max(0.1, 1 - depthAlpha);

        // Mouse interaction (repel) - simplified for 3D
        const mdx = renderX - mouse.current.x;
        const mdy = renderY - mouse.current.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        const mForce = Math.max(0, (80 - mDist) / 80);

        ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
        ctx.beginPath();
        ctx.arc(renderX + mdx * mForce * 0.5, renderY + mdy * mForce * 0.5, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [targetSets, isMorphed]);

  // Morph Animation
  useEffect(() => {
    particles.current.forEach((p) => {
      gsap.to(p, {
        x: isMorphed ? p.targetX : p.originX,
        y: isMorphed ? p.targetY : p.originY,
        z: isMorphed ? p.targetZ : p.originZ,
        duration: 2.5,
        ease: 'expo.inOut',
        delay: Math.random() * 0.4,
      });
    });
    
    // Slow down rotation during morph
    if (isMorphed) {
        gsap.to(rotationAngle, {
            current: Math.round(rotationAngle.current / (Math.PI * 2)) * (Math.PI * 2), // Snap to nearest full rotation
            duration: 2,
            ease: 'expo.out'
        });
    }
  }, [isMorphed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ filter: 'blur(0.3px)' }} 
    />
  );
}
