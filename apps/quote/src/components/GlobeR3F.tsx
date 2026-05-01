'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Custom Shader for Vertical Fade ────────────────────────────────────────
const hemisphereVertexShader = `
  varying float vY;
  varying float vDepth;
  attribute float size;
  void main() {
    vY = position.y;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * (300.0 / -mvPosition.z);
  }
`;

const hemisphereFragmentShader = `
  varying float vY;
  varying float vDepth;
  uniform vec3 color;
  uniform float opacity;
  void main() {
    // Circular dot
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;

    // Soft edge for the dot
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

    // VERTICAL FADE: Brighter at top, dimmer at bottom
    // Local Y goes from 0 to ~3.0
    float verticalFade = smoothstep(0.0, 2.8, vY);
    
    // Depth fade to enhance 3D feel
    float depthFade = smoothstep(0.0, 8.0, vDepth);

    gl_FragColor = vec4(color, alpha * verticalFade * opacity);
  }
`;

// ─── White Hemisphere Particle Dome ─────────────────────────────────────────
function WhiteHemisphere() {
  const meshRef = useRef<THREE.Points>(null!);

  const { positions, sizes } = useMemo(() => {
    const count = 15000;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    let i = 0;
    while (i < count) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const y     = Math.cos(phi);

      if (y < 0) continue;

      const r = 3.0; // Increased radius for massive feel
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * y;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      
      sz[i] = 0.015 + Math.random() * 0.015;
      i++;
    }
    return { positions: pos, sizes: sz };
  }, []);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(0xffffff) },
    opacity: { value: 0.8 },
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

// ─── Soft inner core glow (white only) ───────────────────────────────────────
function InnerGlow() {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    let i = 0;
    while (i < count) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const y     = Math.cos(phi);
      if (y < 0) continue;
      const r = 2.95 + Math.random() * 0.1;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * y;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      i++;
    }
    return pos;
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.05}
        transparent
        opacity={0.08}
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
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      {/* 
          MESH POSITIONING: 
          Shift group down so the base (y=0) is at the bottom.
          Radius is 3.0, so moving down by 3.5-4.0 units anchors it.
      */}
      <group position={[0, -3.2, 0]}>
        <WhiteHemisphere />
        <InnerGlow />
      </group>
    </Canvas>
  );
}
