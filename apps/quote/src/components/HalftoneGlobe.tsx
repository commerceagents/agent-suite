'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Halftone Looping Hemisphere ─────────────────────────────────────────────
function HalftoneHemisphere() {
  const meshRef = useRef<THREE.Points>(null!);
  
  const { startPositions, targetPositions, sizes, delays } = useMemo(() => {
    const radius = 7.0; // "a bit big"
    const segments = 60; // structured halftone grid density
    const points: number[] = [];
    const targets: number[] = [];
    const szs: number[] = [];
    const dls: number[] = [];

    // Create a structured "halftone" grid on the hemisphere
    for (let i = 0; i <= segments / 2; i++) {
      const phi = (i / (segments / 2)) * (Math.PI / 2);
      // Adjust horizontal density based on latitude to maintain "halftone" grid look
      const ringPoints = Math.round(segments * 2 * Math.sin(phi)) || 1;
      
      for (let j = 0; j < ringPoints; j++) {
        const theta = (j / ringPoints) * (Math.PI * 2);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        targets.push(x, y, z);
        
        // Start: completely scattered in a large sphere shell
        const randR = 12 + Math.random() * 8;
        const rTheta = Math.random() * Math.PI * 2;
        const rPhi = Math.random() * Math.PI;
        points.push(
          randR * Math.sin(rPhi) * Math.cos(rTheta),
          randR * Math.cos(rPhi),
          randR * Math.sin(rPhi) * Math.sin(rTheta)
        );

        szs.push(0.015 + Math.random() * 0.02);
        dls.push(Math.random() * 0.8);
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
      const time = state.clock.elapsedTime;
      // Loop: 0->2 Assemble, 2->4 Hold, 4->6 Scatter
      const loopTime = time % 6;
      let t = 0;
      
      if (loopTime < 2) {
        t = THREE.MathUtils.smoothstep(loopTime, 0, 2);
      } else if (loopTime < 4) {
        t = 1;
      } else {
        t = 1 - THREE.MathUtils.smoothstep(loopTime, 4, 6);
      }

      meshRef.current.rotation.y += 0.002;
      meshRef.current.material.uniforms.uProgress.value = t;
      meshRef.current.material.uniforms.uTime.value = time;
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
            // Organic delay arrival
            float p = clamp(uProgress * 1.5 - delay, 0.0, 1.0);
            p = p * p * (3.0 - 2.0 * p); // ease
            
            vec3 pos = mix(position, target, p);
            
            // Subtle floaty noise
            pos += 0.03 * sin(uTime + position.x * 0.5) * (1.0 - p);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (400.0 / -mvPosition.z);
            vAlpha = p * 0.8;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          uniform vec3 color;
          void main() {
            if (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;
            gl_FragColor = vec4(color, vAlpha);
          }
        `}
      />
    </points>
  );
}

// ─── Extra Scattered Background Particles ───────────────────────────────────
function AmbientDots() {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.015} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
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
