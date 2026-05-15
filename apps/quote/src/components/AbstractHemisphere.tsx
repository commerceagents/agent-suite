'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PlasmaDome = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    color: { value: new THREE.Color('#ffffff') }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      // Very slow rotation for life
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material && material.uniforms) {
        material.uniforms.uTime.value = state.clock.elapsedTime;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Large scale hemisphere */}
      <sphereGeometry args={[20, 128, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vViewPosition;

          void main() {
            vPosition = position;
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vViewPosition;

          uniform float uTime;
          uniform vec3 color;

          void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);

            // 1. Soft Rim Glow (Standard Fresnel)
            float fresnel = dot(viewDir, normal);
            fresnel = clamp(1.0 - abs(fresnel), 0.0, 1.0);
            float rim = pow(fresnel, 3.0);

            // 2. Solid Body Lighting
            // Makes the dome look voluminous and solid
            float diffuse = max(dot(normal, vec3(0.0, 1.0, 0.0)), 0.0);
            diffuse = pow(diffuse, 1.5);

            // 3. Top-Down Brightness
            // The screenshot shows the very top is the brightest
            float topGlow = smoothstep(0.0, 20.0, vPosition.y);
            topGlow = pow(topGlow, 2.0);

            // 4. Vertical Fade
            // Fades the legs into the ground
            float vFade = smoothstep(0.0, 10.0, vPosition.y);

            // Combine
            // We want a solid white body that is brightest at the top edge
            float intensity = (diffuse * 0.5 + rim * 1.5) * topGlow;
            
            // Add a base soft glow for the body
            intensity += diffuse * 0.2;

            float finalAlpha = intensity * vFade * 0.8;

            // Pure white output with soft intensity scaling
            gl_FragColor = vec4(color, finalAlpha);
          }
        `}
      />
    </mesh>
  );
};

export default function AbstractHemisphere() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-100 mix-blend-screen">
      <Canvas camera={{ position: [0, 2, 45], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        {/* Pushed down to ground level */}
        <group position={[0, -10, 0]}>
          <PlasmaDome />
        </group>
      </Canvas>
    </div>
  );
}
