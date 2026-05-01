'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── White Hemisphere Particle Dome ─────────────────────────────────────────
function WhiteHemisphere() {
  const meshRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const count = 12000;
    const pos = new Float32Array(count * 3);

    let i = 0;
    while (i < count) {
      // Random point on unit sphere
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const y     = Math.cos(phi);

      // HEMISPHERE ONLY: discard lower half (y < 0)
      if (y < 0) continue;

      const r = 2.6; // radius — large dome fills frame
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * y;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      i++;
    }
    return pos;
  }, []);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.10; // slow ambient Y rotation
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.015}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Soft inner core glow (white only) ───────────────────────────────────────
function InnerGlow() {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    let i = 0;
    while (i < count) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const y     = Math.cos(phi);
      if (y < 0) continue;
      const r = 2.58 + Math.random() * 0.06;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * y;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      i++;
    }
    return pos;
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.045}
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────
export default function GlobeR3F() {
  return (
    <Canvas
      camera={{ position: [0, -0.5, 5], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      {/* NO lights, NO purple, NO rings — pure white additive particles only */}
      <WhiteHemisphere />
      <InnerGlow />
    </Canvas>
  );
}
