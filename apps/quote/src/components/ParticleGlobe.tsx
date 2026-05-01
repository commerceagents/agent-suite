'use client';

import React, { useRef, useEffect } from 'react';

interface ParticleGlobeProps {
  /** Delay in ms before scatter-to-globe assembly begins */
  startDelay?: number;
  /** Radius of the globe in pixels */
  radius?: number;
  /** Number of particles */
  particleCount?: number;
}

export default function ParticleGlobe({
  startDelay = 10200,
  radius = 280,
  particleCount = 2200,
}: ParticleGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, cx = 0, cy = 0;
    let animId: number;
    let mouseX = -9999, mouseY = -9999;
    const startTime = performance.now();
    let assembled = false; // tracks whether assembly has started

    // ─── Resize ─────────────────────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      cx = w / 2;
      cy = h / 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ─── Particle definition ─────────────────────────────────────────────────
    type Particle = {
      // Scatter origin (random screen position)
      sx: number; sy: number; sz: number;
      // Target position on sphere surface (spherical coordinates baked to XYZ)
      tx: number; ty: number; tz: number;
      // Current world position
      wx: number; wy: number; wz: number;
      // For sphere rotation
      theta: number; phi: number;
      // Visual
      alpha: number;
      size: number;
      // Individual assembly progress (0 → 1)
      progress: number;
      speed: number; // assembly lerp speed
    };

    const particles: Particle[] = [];

    const buildParticles = () => {
      particles.length = 0;
      const r = radius;

      for (let i = 0; i < particleCount; i++) {
        // Fibonacci sphere distribution — perfectly even coverage
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const y = 1 - (i / (particleCount - 1)) * 2; // -1 to 1
        const rad = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;

        const tx = Math.cos(theta) * rad * r;
        const ty = y * r;
        const tz = Math.sin(theta) * rad * r;

        // Random scatter origin — exploded outward from center
        const scatterDist = 200 + Math.random() * 600;
        const sa = Math.random() * Math.PI * 2;
        const sb = Math.random() * Math.PI;
        const sx = Math.cos(sa) * Math.sin(sb) * scatterDist;
        const sy2 = Math.cos(sb) * scatterDist;
        const sz = Math.sin(sa) * Math.sin(sb) * scatterDist;

        particles.push({
          sx, sy: sy2, sz,
          tx, ty, tz,
          wx: sx, wy: sy2, wz: sz,
          theta: Math.atan2(tz, tx),
          phi: Math.asin(Math.max(-1, Math.min(1, ty / r))),
          alpha: 0,
          size: 0.8 + Math.random() * 1.2,
          progress: 0,
          speed: 0.008 + Math.random() * 0.012,
        });
      }
    };

    // ─── Main render loop ─────────────────────────────────────────────────────
    let rotationY = 0; // current Y-axis rotation angle (radians)
    const ROTATE_SPEED = 0.0015; // radians per frame

    const render = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const shouldAssemble = elapsed >= startDelay;

      rotationY += ROTATE_SPEED;

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (!shouldAssemble) {
          // Pre-assembly: particles float as scattered glowing dots
          p.alpha = Math.min(p.alpha + 0.005, 0.25);

          // Gentle ambient drift
          const drift = elapsed * 0.0001;
          const dx = p.sx * Math.cos(drift) - p.sz * Math.sin(drift) - p.sx;
          const dy = p.sy * 0.1 * Math.sin(drift * 0.7) - p.sy;
          const dz = p.sx * Math.sin(drift) + p.sz * Math.cos(drift) - p.sz;
          const screenX = cx + (p.sx + dx * 0.02);
          const screenY = cy + (p.sy + dy * 0.02);

          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
          ctx.fill();
          continue;
        }

        // ── Assembly phase: lerp toward target sphere position ──
        if (!assembled) {
          p.progress = Math.min(p.progress + p.speed, 1);
        }

        const eased = p.progress < 1
          ? 1 - Math.pow(1 - p.progress, 3) // ease-out cubic
          : 1;

        // World coords: interpolate scatter → sphere surface
        p.wx = p.sx + (p.tx - p.sx) * eased;
        p.wy = p.sy + (p.ty - p.sy) * eased;
        p.wz = p.sz + (p.tz - p.sz) * eased;

        // Apply Y-axis rotation to the sphere
        const cosR = Math.cos(rotationY);
        const sinR = Math.sin(rotationY);
        const rx = p.wx * cosR - p.wz * sinR;
        const rz = p.wx * sinR + p.wz * cosR;
        const ry = p.wy;

        // Perspective projection
        const fov = 900;
        const perspective = fov / (fov + rz);
        const screenX = cx + rx * perspective;
        const screenY = cy + ry * perspective;

        // Mouse repulsion (gentle disturbance)
        const mdx = screenX - mouseX;
        const mdy = screenY - mouseY;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        let perturbX = 0, perturbY = 0;
        if (mDist < 100) {
          const force = (100 - mDist) / 100;
          perturbX = (mdx / mDist) * force * 18;
          perturbY = (mdy / mDist) * force * 18;
        }

        // Depth-based brightness: front = bright, back = dim
        const depthAlpha = (rz / radius + 1) / 2; // 0 (back) to 1 (front)
        const baseAlpha = 0.25 + depthAlpha * 0.65;
        const finalAlpha = Math.min(baseAlpha * (0.5 + eased * 0.5), 0.95);
        const finalSize = p.size * perspective;

        // Draw glow halo
        const grad = ctx.createRadialGradient(
          screenX + perturbX, screenY + perturbY, 0,
          screenX + perturbX, screenY + perturbY, finalSize * 4
        );
        grad.addColorStop(0, `rgba(255,255,255,${finalAlpha * 0.5})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.beginPath();
        ctx.arc(screenX + perturbX, screenY + perturbY, finalSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Draw core dot
        ctx.beginPath();
        ctx.arc(screenX + perturbX, screenY + perturbY, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${finalAlpha})`;
        ctx.fill();
      }

      // Check if all particles are fully assembled
      if (!assembled && shouldAssemble) {
        assembled = particles.every(p => p.progress >= 1);
      }

      animId = requestAnimationFrame(render);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    resize();
    buildParticles();
    render();

    window.addEventListener('resize', () => { resize(); buildParticles(); });
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [startDelay, radius, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ display: 'block' }}
    />
  );
}
