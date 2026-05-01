'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
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

// ─── Custom Shader for Assembly ───────────────────────────────────────────
const vertexShader = `
  uniform float uProgress;
  attribute float size;
  attribute vec3 target;
  attribute float delay;
  
  varying float vAlpha;
  varying float vY;

  void main() {
    vY = target.y;
    
    // Smooth assembly transition
    float t = clamp(uProgress - delay, 0.0, 1.0);
    // Cubic easing for smooth arrival
    t = t * t * (3.0 - 2.0 * t);
    
    // Interpolate from scattered to target
    vec3 pos = mix(position, target, t);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * (350.0 / -mvPosition.z);
    
    // Alpha fade in
    vAlpha = t;
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying float vY;
  uniform vec3 color;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Vertical fade based on target Y
    float verticalFade = smoothstep(-1.0, 4.0, vY);
    
    gl_FragColor = vec4(color, vAlpha * verticalFade * (1.0 - smoothstep(0.0, 0.5, dist)));
  }
`;

// ─── Assembling Continent Hemisphere ───────────────────────────────────────
function AssemblingGlobe() {
  const meshRef = useRef<THREE.Points>(null!);
  const [progress, setProgress] = useState(0);

  const { startPositions, targetPositions, sizes, delays } = useMemo(() => {
    const COUNT = 25000;
    const startPos = new Float32Array(COUNT * 3);
    const targetPos = new Float32Array(COUNT * 3);
    const sz = new Float32Array(COUNT);
    const dl = new Float32Array(COUNT);

    const radius = 4.8;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    let count = 0;
    let i = 0;
    while (count < COUNT && i < COUNT * 15) {
      const t = i / (COUNT * 10);
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = (2 * Math.PI * i) / goldenRatio;
      
      const lat = 90 - (inclination * 180 / Math.PI);
      const lon = ((azimuth * 180 / Math.PI) % 360) - 180;
      const y = Math.cos(inclination);
      
      // Hemisphere (y >= 0) + Land check
      if (y >= -0.1 && isLand(lat, lon)) {
        const phi = inclination;
        const theta = azimuth;

        // Target: on the sphere
        targetPos[count * 3]     = radius * Math.sin(phi) * Math.cos(theta);
        targetPos[count * 3 + 1] = radius * y;
        targetPos[count * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        
        // Start: scattered in a wider box
        startPos[count * 3]     = (Math.random() - 0.5) * 20;
        startPos[count * 3 + 1] = (Math.random() - 0.5) * 20;
        startPos[count * 3 + 2] = (Math.random() - 0.5) * 20;

        sz[count] = 0.012 + Math.random() * 0.02;
        dl[count] = Math.random() * 0.4; // random delay for organic feel
        count++;
      }
      i++;
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
      // Animate progress from 0 to 1.5 over time
      setProgress(p => Math.min(1.5, p + delta * 0.45));
    }
  });

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(0xffffff) },
    uProgress: { value: 0 },
  }), []);

  useEffect(() => {
    uniforms.uProgress.value = progress;
  }, [progress, uniforms]);

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
      camera={{ position: [0, 0, 9], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      {/* Positioned slightly higher so the WHOLE hemisphere is visible */}
      <group position={[0, -2.8, 0]}>
        <AssemblingGlobe />
      </group>
    </Canvas>
  );
}
