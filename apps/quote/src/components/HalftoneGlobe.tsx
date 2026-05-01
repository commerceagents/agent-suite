'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Halftone Hemisphere ──────────────────────────────────────────────────
function HalftoneHemisphere() {
  const meshRef = useRef<THREE.Points>(null!);
  const startTime = useRef(Date.now());

  const { startPositions, targetPositions, sizes, delays } = useMemo(() => {
    const radius = 8.8;
    const segments = 64;
    const points: number[] = [];
    const targets: number[] = [];
    const szs: number[] = [];
    const dls: number[] = [];

    for (let i = 0; i <= segments / 2; i++) {
      const phi = (i / (segments / 2)) * (Math.PI / 2);
      const ringPoints = Math.round(segments * 2.2 * Math.sin(phi)) || 1;
      
      for (let j = 0; j < ringPoints; j++) {
        const theta = (j / ringPoints) * (Math.PI * 2);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        targets.push(x, y, z);
        
        const randR = 18 + Math.random() * 12;
        const rTheta = Math.random() * Math.PI * 2;
        const rPhi = Math.random() * Math.PI;
        points.push(
          randR * Math.sin(rPhi) * Math.cos(rTheta),
          randR * Math.cos(rPhi),
          randR * Math.sin(rPhi) * Math.sin(rTheta)
        );

        // BOLD DOTS: Increased size for better visibility
        szs.push(0.025 + Math.random() * 0.035);
        dls.push(Math.random() * 1.2);
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
      const progress = Math.min(1.0, elapsed / 3.5);
      
      meshRef.current.rotation.y += 0.0025;

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
            float p = clamp(uProgress * 1.5 - delay, 0.0, 1.0);
            p = p * p * (3.0 - 2.0 * p);
            
            vec3 pos = mix(position, target, p);
            
            if (p > 0.95) {
               pos += 0.01 * sin(uTime * 1.8 + target.x * 4.0) * normalize(target);
            }

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (400.0 / -mvPosition.z);
            
            // BOLD ALPHA: Higher visibility
            vAlpha = (0.2 + 0.8 * p);
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          uniform vec3 color;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float dist = length(uv);
            if (dist > 0.5) discard;
            
            // Stronger glow core
            float glow = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(color, vAlpha * glow);
          }
        `}
      />
    </points>
  );
}

// ─── Ambient Dots ───────────────────────────────────────────────────────────
function AmbientDots() {
  const points = useMemo(() => {
    const p = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 40;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0004;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.015} transparent opacity={0.25} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function HalftoneGlobe() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <group position={[0, -7.8, 0]}>
          <HalftoneHemisphere />
          <AmbientDots />
        </group>
      </Canvas>
    </div>
  );
}
