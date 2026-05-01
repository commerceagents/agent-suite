'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Halftone Looping Hemisphere ─────────────────────────────────────────────
function HalftoneHemisphere() {
  const meshRef = useRef<THREE.Points>(null!);
  const [hasAssembled, setHasAssembled] = useState(false);
  const startTime = useRef(Date.now());

  const { startPositions, targetPositions, sizes, delays } = useMemo(() => {
    const radius = 7.0;
    const segments = 60;
    const points: number[] = [];
    const targets: number[] = [];
    const szs: number[] = [];
    const dls: number[] = [];

    for (let i = 0; i <= segments / 2; i++) {
      const phi = (i / (segments / 2)) * (Math.PI / 2);
      const ringPoints = Math.round(segments * 2.1 * Math.sin(phi)) || 1;
      
      for (let j = 0; j < ringPoints; j++) {
        const theta = (j / ringPoints) * (Math.PI * 2);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        targets.push(x, y, z);
        
        // Start: completely scattered far away
        const randR = 15 + Math.random() * 10;
        const rTheta = Math.random() * Math.PI * 2;
        const rPhi = Math.random() * Math.PI;
        points.push(
          randR * Math.sin(rPhi) * Math.cos(rTheta),
          randR * Math.cos(rPhi),
          randR * Math.sin(rPhi) * Math.sin(rTheta)
        );

        // Brighter dots = slightly larger and more dense szs
        szs.push(0.02 + Math.random() * 0.03);
        dls.push(Math.random() * 1.0);
      }
    }

    return { 
      startPositions: new Float32Array(points), 
      targetPositions: new Float32Array(targets),
      sizes: new Float32Array(szs),
      delays: new Float32Array(dls)
    };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const elapsed = (Date.now() - startTime.current) / 1000;
      
      // FORMATION: Happens only once on mount
      // Progress goes 0 -> 1 over 3 seconds
      const progress = Math.min(1.0, elapsed / 3.0);
      
      // Majestic rotation loop (always on)
      meshRef.current.rotation.y += 0.0035;

      meshRef.current.material.uniforms.uProgress.value = progress;
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    color: { value: new THREE.Color(0xffffff) },
  }), []);

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
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexShader={`
          uniform float uProgress;
          uniform float uTime;
          attribute vec3 target;
          attribute float size;
          attribute float delay;
          varying float vAlpha;
          void main() {
            // Smooth one-time assembly
            float p = clamp(uProgress * 1.6 - delay, 0.0, 1.0);
            p = p * p * (3.0 - 2.0 * p);
            
            vec3 pos = mix(position, target, p);
            
            // Subtle shimmer/noise
            if (p > 0.95) {
               pos += 0.015 * sin(uTime * 2.0 + target.x * 5.0) * normalize(target);
            }

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (450.0 / -mvPosition.z);
            vAlpha = (0.2 + 0.8 * p); // fade in as it forms
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          uniform vec3 color;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float dist = length(uv);
            if (dist > 0.5) discard;
            
            // Brighter core dots
            float glow = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(color, vAlpha * glow);
          }
        `}
      />
    </points>
  );
}

// ─── Extra Scattered Background Particles ───────────────────────────────────
function AmbientDots() {
  const points = useMemo(() => {
    const p = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0006;
      ref.current.rotation.x += 0.0003;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.02} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function HalftoneGlobe() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <group position={[0, -4.5, 0]}>
          <HalftoneHemisphere />
          <AmbientDots />
        </group>
      </Canvas>
    </div>
  );
}
