'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── High-Contrast World Map Mask (72x36) ───────────────────────────────────
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
  '000000000000000000000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000000000000000000000',
];

function isLand(lat: number, lon: number): boolean {
  const col = Math.floor(((lon + 180) / 360) * 72) % 72;
  const row = Math.floor(((90 - lat) / 180) * 36);
  const r = Math.max(0, Math.min(35, row));
  const c = Math.max(0, Math.min(71, col));
  return LAND_MASK[r]?.[c] === '1';
}

// ─── Custom Shader for White Horizon ───────────────────────────────────────
const vertexShader = `
  varying float vY;
  varying float vZ;
  attribute float size;
  void main() {
    vY = position.y;
    vZ = position.z;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * (380.0 / -mvPosition.z);
  }
`;

const fragmentShader = `
  varying float vY;
  varying float vZ;
  uniform vec3 color;
  uniform float opacity;
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

    // VERTICAL FADE: Anchor to local dome Y (0 to radius)
    float verticalFade = smoothstep(0.0, 5.0, vY);
    
    // DEPTH FADE: Fade out the back for horizon clarity
    float depthFade = smoothstep(-0.8, 2.0, vZ);

    gl_FragColor = vec4(color, alpha * verticalFade * depthFade * opacity);
  }
`;

// ─── Massive Continent Hemisphere ───────────────────────────────────────────
function CinematicHorizon() {
  const meshRef = useRef<THREE.Points>(null!);

  const { positions, sizes } = useMemo(() => {
    const TARGET_COUNT = 25000;
    const pos = new Float32Array(TARGET_COUNT * 3);
    const sz = new Float32Array(TARGET_COUNT);

    const radius = 5.5; // Massive Earth-like curve
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    let count = 0;
    let i = 0;
    // Fibonacci sphere sampling + Rejection for continents
    while (count < TARGET_COUNT && i < TARGET_COUNT * 10) {
      const t = i / (TARGET_COUNT * 10);
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = (2 * Math.PI * i) / goldenRatio;
      
      const lat = 90 - (inclination * 180 / Math.PI);
      const lon = ((azimuth * 180 / Math.PI) % 360) - 180;

      const y = Math.cos(inclination);
      
      // PERFECT HEMISPHERE (y >= 0) + Land check
      if (y >= 0 && isLand(lat, lon)) {
        const phi = inclination;
        const theta = azimuth;

        pos[count * 3]     = radius * Math.sin(phi) * Math.cos(theta);
        pos[count * 3 + 1] = radius * y;
        pos[count * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        
        sz[count] = 0.015 + Math.random() * 0.025;
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
      meshRef.current.rotation.y += delta * 0.05; // Majestic slow rotation
    }
  });

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(0xffffff) },
    opacity: { value: 0.95 },
  }), []);

  return (
    <points ref={meshRef} scale={[1, 1, 1]}>
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

export default function GlobeR3F() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
      onCreated={({ camera }) => {
        camera.updateProjectionMatrix();
      }}
    >
      {/* 
          POSITIONING:
          Radius is 5.5. Moving it down by 5.8 units anchors the base 
          at the very bottom, creating a wide rising horizon.
      */}
      <group position={[0, -5.8, 0]}>
        <CinematicHorizon />
      </group>
    </Canvas>
  );
}
