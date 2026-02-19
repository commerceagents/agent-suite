"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * RippleGrid — canvas-based dot grid that fires radial wave pulses.
 * Inspired by Budget/src/particles.js ferrofluid ripple effect.
 * Silver dots on dark background, waves expand from center.
 */
export default function RippleGrid({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dotsRef = useRef<
    { x: number; y: number; baseR: number; r: number; brightness: number }[]
  >([]);
  const wavesRef = useRef<{ cx: number; cy: number; radius: number; maxRadius: number; speed: number; strength: number }[]>([]);
  const triggeredRef = useRef(false);

  const initDots = useCallback((w: number, h: number) => {
    const spacing = 30;
    const dots: typeof dotsRef.current = [];
    const cx = w / 2;
    const cy = h / 2;
    const deadZone = 80; // empty area around logo center

    for (let x = spacing / 2; x < w; x += spacing) {
      for (let y = spacing / 2; y < h; y += spacing) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Skip dots inside the dead zone (empty center around logo)
        if (dist < deadZone) continue;

        // Dots near the dead zone edge are slightly smaller/dimmer
        const edgeFade = Math.min(1, (dist - deadZone) / 60);

        dots.push({
          x,
          y,
          baseR: 1.2 * edgeFade,
          r: 1.2 * edgeFade,
          brightness: 0.08 * edgeFade,
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  const fireWave = useCallback((cx: number, cy: number) => {
    // Primary wave
    wavesRef.current.push({
      cx, cy,
      radius: 0,
      maxRadius: 2000,
      speed: 8,
      strength: 1.0,
    });
    // Secondary wave (slightly delayed, slower)
    setTimeout(() => {
      wavesRef.current.push({
        cx, cy,
        radius: 0,
        maxRadius: 2000,
        speed: 5,
        strength: 0.6,
      });
    }, 200);
    // Third ripple
    setTimeout(() => {
      wavesRef.current.push({
        cx, cy,
        radius: 0,
        maxRadius: 2000,
        speed: 3.5,
        strength: 0.35,
      });
    }, 500);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dots = dotsRef.current;
      const waves = wavesRef.current;

      // Update waves
      for (let i = waves.length - 1; i >= 0; i--) {
        waves[i].radius += waves[i].speed;
        if (waves[i].radius > waves[i].maxRadius) {
          waves.splice(i, 1);
        }
      }

      // Draw dots
      for (const dot of dots) {
        // Reset
        dot.r = dot.baseR;
        dot.brightness = 0.08;

        // Apply wave influence
        for (const wave of waves) {
          const dx = dot.x - wave.cx;
          const dy = dot.y - wave.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const waveFront = wave.radius;
          const waveWidth = 120;
          const diff = Math.abs(dist - waveFront);

          if (diff < waveWidth) {
            const intensity = (1 - diff / waveWidth) * wave.strength;
            // Fade wave as it expands
            const distanceFade = 1 - wave.radius / wave.maxRadius;
            const finalIntensity = intensity * distanceFade;

            dot.r = dot.baseR + finalIntensity * 3;
            dot.brightness = Math.max(dot.brightness, finalIntensity * 0.7);
          }
        }

        // Draw
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 192, 200, ${dot.brightness})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initDots]);

  // Fire wave when trigger changes to true
  useEffect(() => {
    if (trigger && !triggeredRef.current) {
      triggeredRef.current = true;
      const canvas = canvasRef.current;
      if (canvas) {
        fireWave(canvas.width / 2, canvas.height / 2);
      }
    }
  }, [trigger, fireWave]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
