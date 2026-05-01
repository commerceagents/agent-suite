'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Constants & Utils ──────────────────────────────────────────────────────
const radius = 8.8;
const segments = 64;

// ─── Halftone Component with Modes ──────────────────────────────────────────
function InteractiveHalftone({ mode }: { mode: string }) {
  const meshRef = useRef<THREE.Points>(null!);
  const lineMeshRef = useRef<THREE.LineSegments>(null!);
  const startTime = useRef(Date.now());
  const mouse = useRef(new THREE.Vector2());

  // Data Generation
  const { positions, sizes, targetPositions } = useMemo(() => {
    const pos = [];
    const szs = [];
    const targets = [];
    for (let i = 0; i <= segments / 2; i++) {
      const phi = (i / (segments / 2)) * (Math.PI / 2);
      const ringPoints = Math.round(segments * 2.2 * Math.sin(phi)) || 1;
      for (let j = 0; j < ringPoints; j++) {
        const theta = (j / ringPoints) * (Math.PI * 2);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        targets.push(x, y, z);
        pos.push(x, y, z);
        szs.push(0.02 + Math.random() * 0.03);
      }
    }
    return { 
      positions: new Float32Array(pos), 
      sizes: new Float32Array(szs),
      targetPositions: new Float32Array(targets)
    };
  }, []);

  // Mouse Listener
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const uniforms = meshRef.current.material.uniforms;

    // 1. MAJESTIC ROTATION
    let rotSpeed = 0.0025;
    if (mode === 'scroll') rotSpeed += (window.scrollY * 0.00001);
    meshRef.current.rotation.y += rotSpeed;

    // 2. MOUSE TILT (Mode: Tilt)
    if (mode === 'tilt') {
      meshRef.current.rotation.x += (mouse.current.y * 0.1 - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.z += (mouse.current.x * 0.1 - meshRef.current.rotation.z) * 0.05;
    }

    // 3. PULSE RIPPLE (Mode: Pulse)
    uniforms.uPulse.value = (mode === 'pulse') ? (time % 2) / 2 : 0;
    
    // 4. AUDIO BREATH (Mode: Audio)
    if (mode === 'audio') {
      const breath = 1 + 0.05 * Math.sin(time * 3);
      meshRef.current.scale.set(breath, breath, breath);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }

    // 5. GLITCH (Mode: Glitch)
    if (mode === 'glitch' && Math.random() > 0.99) {
      uniforms.uGlitch.value = 1.0;
      setTimeout(() => { if(uniforms) uniforms.uGlitch.value = 0; }, 50);
    }

    uniforms.uTime.value = time;
    uniforms.uMode.value = ['pulse', 'tilt', 'scroll', 'plexus', 'audio', 'dust', 'glitch'].indexOf(mode);
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uPulse: { value: 0 },
          uGlitch: { value: 0 },
          uMode: { value: 0 },
          color: { value: new THREE.Color(0xffffff) }
        }}
        vertexShader={`
          uniform float uTime;
          uniform float uPulse;
          uniform float uGlitch;
          attribute float size;
          varying float vAlpha;
          void main() {
            vec3 pos = position;
            
            // Mode: Glitch
            if (uGlitch > 0.5) {
              pos += (fract(sin(pos * 100.0)) - 0.5) * 0.5;
            }

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Mode: Pulse
            float distToCenter = length(position.xz);
            float ripple = 0.0;
            if (uPulse > 0.0) {
              ripple = smoothstep(uPulse * 10.0 - 1.0, uPulse * 10.0, distToCenter) * (1.0 - smoothstep(uPulse * 10.0, uPulse * 10.0 + 1.0, distToCenter));
            }

            gl_PointSize = size * (400.0 / -mvPosition.z) * (1.0 + ripple * 2.0);
            vAlpha = 0.6 + ripple * 0.4;
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

// ─── Mode: Dust (Atmospheric Bokeh) ─────────────────────────────────────────
function DustLayer({ active }: { active: boolean }) {
  const points = useMemo(() => {
    const p = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 40;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  }, []);
  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.position.y = active ? Math.sin(state.clock.elapsedTime * 0.5) * 0.5 : 0;
    }
  });
  return (
    <points ref={ref} visible={active}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.02} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ─── Main Demo Controller ───────────────────────────────────────────────────
export default function GlobeDemoSuite() {
  const [mode, setMode] = useState('tilt');
  const modes = ['pulse', 'tilt', 'scroll', 'plexus', 'audio', 'dust', 'glitch'];

  return (
    <div className="absolute inset-0 w-full h-full group">
      {/* DEMO SELECTOR OVERLAY */}
      <div className="absolute top-10 left-10 z-[100] flex flex-wrap gap-2 pointer-events-auto">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-all ${
              mode === m ? 'bg-white text-black border-white' : 'text-white/40 border-white/10 hover:border-white/40'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <Canvas camera={{ position: [0, 0, 15], fov: 40 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <group position={[0, -7.8, 0]}>
          <InteractiveHalftone mode={mode} />
          <DustLayer active={mode === 'dust'} />
        </group>
      </Canvas>
    </div>
  );
}
