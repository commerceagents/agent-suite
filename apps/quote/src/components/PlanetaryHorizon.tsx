'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Sphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.02;
    }
  });

  return (
    // Positioned so only the top hemisphere is visible — cinematic horizon effect
    <group position={[0, -6.2, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[6.5, 256, 256]} />
        <meshStandardMaterial
          color="#0a0a0f"
          roughness={0.15}
          metalness={0.95}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

export default function PlanetaryHorizon() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />

        {/* Space Stars */}
        <Stars radius={300} depth={60} count={5000} factor={4} saturation={0} fade speed={0.3} />

        {/* Cinematic Rim Light — top backlight for the "dawn" curve */}
        <directionalLight position={[0, 8, -10]} intensity={6} color="#ffffff" />

        {/* Side fill light — gives the sphere visible curvature */}
        <pointLight position={[-8, 4, 6]} intensity={3} color="#c0d8ff" />

        {/* Very faint base fill */}
        <ambientLight intensity={0.08} />

        <React.Suspense fallback={null}>
          <Sphere />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
