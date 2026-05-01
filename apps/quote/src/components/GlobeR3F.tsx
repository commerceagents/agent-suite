'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── High-Contrast World Map Mask (72x36) ───────────────────────────────────
const LAND_MASK = [
  '000000000000000000000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000011000000000000000000000000000000000000000000000',
  '000000001100000000000000011100001111110000000111111111111111111000000000',
  '000000011111000000000000001110011111111001001111111111111111111100000000',
  '000000011111100000000000011111111111111111111111111111111111111000000000',
  '000001111111110000000000111111111111111111111111111111111111110000000000',
  '000001111111111000000001111111111111111111111111111111111111100000000000',
  '000001111111111000000000011111111111111111111111111111111110000000000000',
  '000001111111111100000000011111111111111111111111111111111100000000000000',
  '000001111111111100000001111111111111111111111111111111111110000000000000',
  '000001111111111110000001111111111111111111111111111111111110000000000000',
  '000000111111111110000000111111111111111111111111111111111100000000000000',
  '000000011111111111000000011111111111111111111111111111111000000000000000',
  '000000001111111111000000001111111111111111111111111110000000000000000000',
  '000000000011111100000000000111111111111111111111110000000000000000000000',
  '000000000011111000000000000011111111111111111111000000000000001100000000',
  '000000000001111000000000000001111111111111111110000000000000011100000000',
  '000000000001110000000000000001111111111111111100000000000000111110000000',
  '000000000001100000000000000001111111111111100000000000000000111100000000',
  '000000000000000000000000000001111111111110000000000000000001111100000000',
  '000000000000000000000000000000111111111100000000000000000001111000000000',
  '000000000000000000000000000001111111111110000000000000000001110000000000',
  '000000000000000000000000000001111111111110000000000000000001100000000000',
  '000000000000000000000000000001111111111100000000000000000000000000000000',
  '000000000000000000000000000001111111110000000000000000000000000000000000',
  '000000000000000000000000000001111111100000000000011100000000000000000000',
  '000000000000000000000000000001111110000000000000011110000000000000000000',
  '000000000000000000000000000001111100000000000000001110000000000000000000',
  '000000000000000000000000000001111100000000000000001100000000000000000000',
  '000000000000000000000000000001111110000000000000001100000000000000000000',
  '000000000000000000000000000000111110000000000000000000000000000000000000',
  '000000000000000000000000000000011100000000000000000000000000000000000000',
  '000000000000000000000000000000001100000000000000000000000000000000000000',
];

function isLand(lat: number, lon: number): boolean {
  const col = Math.floor(((lon + 180) / 360) * 72) % 72;
  const row = Math.floor(((90 - lat) / 180) * 36);
  const r = Math.max(0, Math.min(32, row));
  const c = Math.max(0, Math.min(71, col));
  return LAND_MASK[r]?.[c] === '1';
}

// ─── WebGL Renderer Version ──────────────────────────────────────────────────
function WebGLGlobe() {
  const meshRef = useRef<THREE.Points>(null!);
  const [progress, setProgress] = useState(0);

  const { startPositions, targetPositions, sizes, delays } = useMemo(() => {
    const COUNT = 25000;
    const startPos = new Float32Array(COUNT * 3);
    const targetPos = new Float32Array(COUNT * 3);
    const sz = new Float32Array(COUNT);
    const dl = new Float32Array(COUNT);

    const radius = 5.2;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    let count = 0;
    for (let i = 0; i < COUNT * 15 && count < COUNT; i++) {
      const t = i / (COUNT * 12);
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = (2 * Math.PI * i) / goldenRatio;
      const lat = 90 - (inclination * 180 / Math.PI);
      const lon = ((azimuth * 180 / Math.PI) % 360) - 180;
      const y = Math.cos(inclination);
      
      if (y >= -0.05 && isLand(lat, lon)) {
        targetPos[count * 3]     = radius * Math.sin(inclination) * Math.cos(azimuth);
        targetPos[count * 3 + 1] = radius * y;
        targetPos[count * 3 + 2] = radius * Math.sin(inclination) * Math.sin(azimuth);
        
        startPos[count * 3]     = (Math.random() - 0.5) * 20;
        startPos[count * 3 + 1] = (Math.random() - 0.5) * 20;
        startPos[count * 3 + 2] = (Math.random() - 0.5) * 20;

        sz[count] = 0.012 + Math.random() * 0.02;
        dl[count] = Math.random() * 0.5;
        count++;
      }
    }
    return { 
      startPositions: startPos.slice(0, count * 3),
      targetPositions: targetPos.slice(0, count * 3),
      sizes: sz.slice(0, count),
      delays: dl.slice(0, count)
    };
  }, []);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06;
      setProgress(p => Math.min(1.5, p + delta * 0.5));
    }
  });

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(0xffffff) },
    uProgress: { value: 0 },
  }), []);

  useEffect(() => { uniforms.uProgress.value = progress; }, [progress, uniforms]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[startPositions, 3]} />
        <bufferAttribute attach="attributes-target" args={[targetPositions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-delay" args={[delays, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          uniform float uProgress;
          attribute float size;
          attribute vec3 target;
          attribute float delay;
          varying float vAlpha;
          void main() {
            float t = clamp(uProgress - delay, 0.0, 1.0);
            t = t * t * (3.0 - 2.0 * t);
            vec3 pos = mix(position, target, t);
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (350.0 / -mvPosition.z);
            vAlpha = t * (1.0 - smoothstep(0.0, 4.0, target.y));
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          uniform vec3 color;
          void main() {
            if (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;
            gl_FragColor = vec4(color, vAlpha * 0.8);
          }
        `}
        transparent blending={THREE.AdditiveBlending} depthWrite={false}
      />
    </points>
  );
}

// ─── Canvas 2D Fallback Version (for environments without WebGL) ──────────────
function Canvas2DFallback() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * window.devicePixelRatio; canvas.height = h * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const dots: any[] = [];
    const radius = 300;
    for (let i = 0; i < 4000; i++) {
      const lat = Math.asin(Math.random() * 2 - 1) * 180 / Math.PI;
      const lon = Math.random() * 360 - 180;
      if (lat > -10 && isLand(lat, lon)) {
        dots.push({ lat, lon, sz: 1 + Math.random() * 1.5 });
      }
    }

    let rot = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      rot += 0.002;
      dots.forEach(d => {
        const phi = (90 - d.lat) * Math.PI / 180;
        const theta = (d.lon + 180) * Math.PI / 180 + rot;
        const z = Math.sin(phi) * Math.sin(theta);
        if (z < -0.1) return;
        const x = w/2 + radius * Math.sin(phi) * Math.cos(theta);
        const y = h/1.3 + radius * Math.cos(phi);
        ctx.globalAlpha = (z + 0.5) * 0.6;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(x, y, d.sz, 0, Math.PI * 2); ctx.fill();
      });
      requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    const anim = requestAnimationFrame(render);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(anim); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
}

// ─── Root Component with Fallback ─────────────────────────────────────────────
export default function GlobeR3F() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setWebglSupported(!!gl);
  }, []);

  if (webglSupported === null) return null;

  if (!webglSupported) {
    return <Canvas2DFallback />;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <group position={[0, -3.5, 0]}>
        <WebGLGlobe />
      </group>
    </Canvas>
  );
}
