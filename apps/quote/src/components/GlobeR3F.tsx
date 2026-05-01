'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// ─── Particle Globe Mesh ─────────────────────────────────────────────────────
function ParticleSphere() {
  const meshRef = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Uniform distribution on sphere surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + (Math.random() - 0.5) * 0.015; // tiny radius variation

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Slight color variation: core purple → pink edge
      const intensity = 0.7 + Math.random() * 0.3;
      colors[i * 3]     = intensity * 0.69; // R
      colors[i * 3 + 1] = intensity * 0.15; // G
      colors[i * 3 + 2] = intensity * 1.00; // B
    }
    return { positions, colors };
  }, []);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.12;
      meshRef.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Glow ring around the equator ────────────────────────────────────────────
function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((_state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0.3, 0]}>
      <torusGeometry args={[1.72, 0.008, 2, 200]} />
      <meshBasicMaterial
        color="#9d4edd"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Inner dense core glow ────────────────────────────────────────────────────
function CoreGlow() {
  const { positions } = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.48 + Math.random() * 0.04;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return { positions };
  }, []);

  const glowRef = useRef<THREE.Points>(null!);
  useFrame((_state, delta) => {
    if (glowRef.current) glowRef.current.rotation.y -= delta * 0.05;
  });

  return (
    <points ref={glowRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#c77dff"
        transparent
        opacity={0.20}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function GlobeR3F() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      {/* Starfield */}
      <Stars radius={80} depth={50} count={4000} factor={3} fade speed={0.6} />

      {/* Ambient purple point light for atmosphere */}
      <pointLight position={[3, 3, 3]} color="#b026ff" intensity={2} />
      <pointLight position={[-3, -2, -3]} color="#5e17eb" intensity={1.2} />

      {/* Globe particles */}
      <ParticleSphere />
      <CoreGlow />
      <GlowRing />
    </Canvas>
  );
}
