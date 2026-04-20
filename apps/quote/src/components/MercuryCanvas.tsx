'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

function LiquidBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Handle mouse movement for reactivity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smoothly interpolate mesh position towards mouse
    const targetX = mouse.x * 2;
    const targetY = mouse.y * 1.5;
    
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    
    // Subtle continuous rotation
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 128, 128]} scale={1.8}>
        <MeshDistortMaterial
          color="#ffffff"
          roughness={0.05}
          metalness={1}
          distort={0.4}
          speed={4}
          bumpScale={0.05}
        />
      </Sphere>
    </Float>
  );
}

export default function MercuryCanvas() {
  return (
    <div className="absolute inset-0 z-0 opacity-80">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: true, 
          powerPreference: "high-performance",
          precision: "highp"
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <LiquidBlob />
        <Environment resolution={256}>
          {/* Abstract light shapes to create metallic reflections without recognizable images */}
          <group rotation={[-Math.PI / 4, 0, 0]}>
            <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
            <Lightformer form="rect" intensity={2} rotation-y={Math.PI / 2} position={[10, 1, 1]} scale={[10, 1]} />
          </group>
        </Environment>
      </Canvas>
    </div>
  );
}
