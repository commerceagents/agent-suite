'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── High-Resolution World Map Mask (72x36) ─────────────────────────────────
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

// ─── Custom Shader for Looping Assembly ──────────────────────────────────────
const vertexShader = `
  uniform float uTime;
  attribute float size;
  attribute vec3 target;
  attribute float delay;
  
  varying float vAlpha;
  varying float vY;

  void main() {
    vY = target.y;
    
    // LOOPING PROGRESS (0 → 1 formation, 1 → 2 stay, 2 → 3 scatter)
    float loopTime = mod(uProgress, 5.0);
    float t;
    
    if (loopTime < 2.0) {
      // Assemble
      t = clamp(loopTime - delay, 0.0, 1.0);
      t = t * t * (3.0 - 2.0 * t);
    } else if (loopTime < 3.5) {
      // Stay
      t = 1.0;
    } else {
      // Scatter
      t = 1.0 - clamp(loopTime - 3.5 - delay, 0.0, 1.0);
      t = t * t * (3.0 - 2.0 * t);
    }
    
    vec3 pos = mix(position, target, t);
    
    // Add subtle breathing/noise when assembled
    if (t > 0.95) {
       pos += 0.02 * sin(uTime * 1.5 + target.x * 10.0) * normalize(target);
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * (360.0 / -mvPosition.z);
    
    vAlpha = t;
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying float vY;
  uniform vec3 color;

  void main() {
    if (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;
    
    // Brighter at the top rim
    float rim = smoothstep(0.0, 5.0, vY);
    gl_FragColor = vec4(color, vAlpha * (0.4 + 0.6 * rim));
  }
`;

// ─── Looping Cinematic Hemisphere ───────────────────────────────────────────
function LoopingGlobe() {
  const meshRef = useRef<THREE.Points>(null!);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    color: { value: new THREE.Color(0xffffff) },
  }), []);

  const { startPositions, targetPositions, sizes, delays } = useMemo(() => {
    const COUNT = 32000; // Even higher density for the "plexus" look
    const startPos = new Float32Array(COUNT * 3);
    const targetPos = new Float32Array(COUNT * 3);
    const sz = new Float32Array(COUNT);
    const dl = new Float32Array(COUNT);

    const radius = 5.0;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    let count = 0;
    for (let i = 0; i < COUNT * 18 && count < COUNT; i++) {
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
        
        // Start: random sphere shell or box
        const randR = 10 + Math.random() * 5;
        const rTheta = Math.random() * Math.PI * 2;
        const rPhi = Math.acos(2 * Math.random() - 1);
        startPos[count * 3]     = randR * Math.sin(rPhi) * Math.cos(rTheta);
        startPos[count * 3 + 1] = randR * Math.cos(rPhi);
        startPos[count * 3 + 2] = randR * Math.sin(rPhi) * Math.sin(rTheta);

        sz[count] = 0.01 + Math.random() * 0.025;
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

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      uniforms.uTime.value = state.clock.elapsedTime;
      uniforms.uProgress.value = state.clock.elapsedTime * 0.8;
    }
  });

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
        vertexShader={vertexShader.replace('uProgress', 'uniform float uProgress;')}
        fragmentShader={fragmentShader}
        transparent blending={THREE.AdditiveBlending} depthWrite={false}
      />
    </points>
  );
}

// ─── Glowing Horizon Rim ────────────────────────────────────────────────────
function AtmosphereRim() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      // Pulsing glow
      const s = 1 + 0.02 * Math.sin(state.clock.elapsedTime * 2);
      ref.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -0.5]}>
      <torusGeometry args={[5.05, 0.04, 16, 100]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
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
      <group position={[0, -3.2, 0]}>
        <LoopingGlobe />
        <AtmosphereRim />
      </group>
    </Canvas>
  );
}
