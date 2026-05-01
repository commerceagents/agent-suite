'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── High-Resolution World Map Mask ─────────────────────────────────────────
const LAND_MASK = [
  '000000000000000000000000000000000000000000000000000000000000000000000000',
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
  const r = Math.max(0, Math.min(33, row));
  const c = Math.max(0, Math.min(71, col));
  return LAND_MASK[r]?.[c] === '1';
}

// ─── Custom Shader Material ──────────────────────────────────────────────────
const vertexShader = `
  varying float vY;
  varying float vZ;
  attribute float size;
  void main() {
    vY = position.y;
    vZ = position.z;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * (400.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying float vY;
  varying float vZ;
  uniform vec3 color;
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // RIM LIGHTING: Brighten the edges (front and top)
    float rim = smoothstep(-1.0, 5.0, vY) * smoothstep(-1.0, 3.0, vZ);
    float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * (0.3 + 0.7 * rim);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─── Majestic Rotating Hemisphere ───────────────────────────────────────────
function RotatingGlobe() {
  const meshRef = useRef<THREE.Points>(null!);

  const { positions, sizes } = useMemo(() => {
    const TARGET = 45000; // Ultra-high density for that "exact" look
    const pos = new Float32Array(TARGET * 3);
    const sz = new Float32Array(TARGET);

    const radius = 5.2;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    let count = 0;
    let i = 0;
    while (count < TARGET && i < TARGET * 15) {
      const t = i / (TARGET * 12);
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = (2 * Math.PI * i) / goldenRatio;
      
      const lat = 90 - (inclination * 180 / Math.PI);
      const lon = ((azimuth * 180 / Math.PI) % 360) - 180;
      const y = Math.cos(inclination);
      
      // Strict hemisphere clipping + Land mask
      if (y >= -0.02 && isLand(lat, lon)) {
        pos[count * 3]     = radius * Math.sin(inclination) * Math.cos(azimuth);
        pos[count * 3 + 1] = radius * y;
        pos[count * 3 + 2] = radius * Math.sin(inclination) * Math.sin(azimuth);
        
        sz[count] = 0.012 + Math.random() * 0.018;
        count++;
      }
      i++;
    }

    return { 
      positions: pos.slice(0, count * 3), 
      sizes: sz.slice(0, count) 
    };
  }, []);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08; // slow majestic rotation
    }
  });

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(0xffffff) },
  }), []);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Bright Rim Atmosphere ──────────────────────────────────────────────────
function GlowRim() {
  return (
    <mesh position={[0, 0, -0.2]}>
      <torusGeometry args={[5.25, 0.03, 16, 100]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

export default function GlobeR3F() {
  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <group position={[0, -3.5, 0]}>
        <RotatingGlobe />
        <GlowRim />
      </group>
    </Canvas>
  );
}
