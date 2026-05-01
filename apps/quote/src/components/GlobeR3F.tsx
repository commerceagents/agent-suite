'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Inline world map (simplified land mask as run-length encoded rows) ────────
const LAND_MASK_72x36 = [
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

function sampleLandMask(lat: number, lon: number): boolean {
  const col = Math.floor(((lon + 180) / 360) * 72) % 72;
  const row = Math.floor(((90 - lat) / 180) * 36);
  const r = Math.max(0, Math.min(35, row));
  const c = Math.max(0, Math.min(71, col));
  return LAND_MASK_72x36[r]?.[c] === '1';
}

// ─── Custom Shader for Vertical Fade ────────────────────────────────────────
const hemisphereVertexShader = `
  varying float vY;
  varying float vZ;
  attribute float size;
  void main() {
    vY = position.y;
    vZ = position.z;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * (350.0 / -mvPosition.z);
  }
`;

const hemisphereFragmentShader = `
  varying float vY;
  varying float vZ;
  uniform vec3 color;
  uniform float opacity;
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

    // VERTICAL FADE: Anchor fade to world Y positioning
    // Local Y ranges from 0 to 4.0
    float verticalFade = smoothstep(-0.2, 3.8, vY);
    
    // EDGE FADE: Fade out points at the sides/back for depth
    float edgeFade = smoothstep(-0.5, 1.5, vZ);

    gl_FragColor = vec4(color, alpha * verticalFade * edgeFade * opacity);
  }
`;

// ─── White Continent Hemisphere ──────────────────────────────────────────────
function WhiteContinentHemisphere() {
  const meshRef = useRef<THREE.Points>(null!);

  const { positions, sizes } = useMemo(() => {
    const LAND_TARGET = 22000;
    const pos = new Float32Array(LAND_TARGET * 3);
    const sz = new Float32Array(LAND_TARGET);

    const radius = 4.0; // 20-30% increase for massive look
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    let landCount = 0;
    let i = 0;
    // We sample a high number of points and only keep those on land
    while (landCount < LAND_TARGET && i < LAND_TARGET * 8) {
      const t = i / (LAND_TARGET * 8);
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = (2 * Math.PI * i) / goldenRatio;
      
      const lat = 90 - (inclination * 180 / Math.PI);
      const lon = ((azimuth * 180 / Math.PI) % 360) - 180;

      const y = Math.cos(inclination);
      
      // HEMISPHERE ONLY: Upper half
      if (y >= 0 && sampleLandMask(lat, lon)) {
        const phi = inclination;
        const theta = azimuth;

        pos[landCount * 3]     = radius * Math.sin(phi) * Math.cos(theta);
        pos[landCount * 3 + 1] = radius * y;
        pos[landCount * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        
        sz[landCount] = 0.016 + Math.random() * 0.02;
        landCount++;
      }
      i++;
    }

    // Trim the array to the actual number of points found
    return { 
      positions: pos.slice(0, landCount * 3), 
      sizes: sz.slice(0, landCount) 
    };
  }, []);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.07;
    }
  });

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(0xffffff) },
    opacity: { value: 0.9 },
  }), []);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={hemisphereVertexShader}
        fragmentShader={hemisphereFragmentShader}
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
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      {/* 
          HORIZON ANCHOR:
          Moving group down so the base (y=0) is at the viewport bottom.
          Since radius is 4.0, position.y = -4.5 places the dome base correctly.
      */}
      <group position={[0, -4.2, 0]}>
        <WhiteContinentHemisphere />
      </group>
    </Canvas>
  );
}
