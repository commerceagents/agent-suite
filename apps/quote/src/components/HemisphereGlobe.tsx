'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function HemisphereGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ─── Scene Setup ──────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // ─── Geometry Generation ──────────────────────────────────────────────────
    const radius = 6;
    const segments = 24; // density
    const points: THREE.Vector3[] = [];

    // Spherical coordinates: phi (0 to PI/2), theta (0 to 2*PI)
    for (let i = 0; i <= segments; i++) {
      const phi = (i / segments) * (Math.PI / 2);
      for (let j = 0; j <= segments * 2; j++) {
        const theta = (j / (segments * 2)) * (Math.PI * 2);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi); // Rising from top down in local coords
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        // Add tiny random offset for "network" feel
        const offset = 0.05;
        points.push(new THREE.Vector3(
          x + (Math.random() - 0.5) * offset, 
          y + (Math.random() - 0.5) * offset, 
          z + (Math.random() - 0.5) * offset
        ));
      }
    }

    // ─── Lines (LineSegments) ────────────────────────────────────────────────
    const lineIndices: number[] = [];
    const maxDist = 1.4;

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < maxDist) {
          lineIndices.push(i, j);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    lineGeo.setIndex(lineIndices);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });

    const lines = new THREE.LineSegments(lineGeo, lineMat);
    
    // ─── Nodes (Points) ──────────────────────────────────────────────────────
    const dotGeo = new THREE.BufferGeometry().setFromPoints(points);
    const dotMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const nodes = new THREE.Points(dotGeo, dotMat);

    const globeGroup = new THREE.Group();
    globeGroup.add(lines);
    globeGroup.add(nodes);
    
    // Position it so the base is at the horizon (rising from bottom)
    // Local Y=radius is the top of the dome. 
    // We rotate it so y=0 is the base and it points UP.
    globeGroup.rotation.x = -Math.PI; // flip to point UP
    globeGroup.position.y = -radius + 0.5; // anchor base at bottom
    
    scene.add(globeGroup);

    // ─── Mouse Interaction ────────────────────────────────────────────────────
    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      targetRotation.y = mouse.x * 0.15;
      targetRotation.x = -Math.PI + (mouse.y * 0.1);
    };
    window.addEventListener('mousemove', onMouseMove);

    // ─── Animation Loop ───────────────────────────────────────────────────────
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      
      // Slow majestic rotation
      globeGroup.rotation.y += 0.0015;
      
      // Subtle mouse follow
      globeGroup.rotation.x += (targetRotation.x - globeGroup.rotation.x) * 0.05;
      globeGroup.rotation.z += (targetRotation.y - globeGroup.rotation.z) * 0.05;

      // Subtle pulse animation for lines
      lineMat.opacity = 0.12 + Math.sin(Date.now() * 0.001) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // ─── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      style={{ overflow: 'hidden' }}
    />
  );
}
