'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ParticleGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene setup ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.2, 2.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x05070a, 1);
    mount.appendChild(renderer.domElement);

    let points: THREE.Points | null = null;
    let glow: THREE.Points  | null = null;
    let animId = 0;

    // ── Load Earth texture & build particles ─────────────────────────────
    const loader = new THREE.TextureLoader();
    loader.load(
      'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg',
      (texture) => {
        // Sample texture to find land pixels
        const img = texture.image as HTMLImageElement;
        const offscreen = document.createElement('canvas');
        offscreen.width  = img.width;
        offscreen.height = img.height;
        const ctx = offscreen.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;

        // Build sphere geometry to sample UV positions
        const sphere = new THREE.SphereGeometry(1, 256, 128);
        const posAttr = sphere.attributes.position as THREE.BufferAttribute;
        const uvAttr  = sphere.attributes.uv       as THREE.BufferAttribute;

        const positions: number[] = [];
        const opacities: number[] = [];

        for (let i = 0; i < posAttr.count; i++) {
          const u = uvAttr.getX(i);
          const v = uvAttr.getY(i);

          const px = Math.floor(u * (img.width  - 1));
          const py = Math.floor((1 - v) * (img.height - 1)); // flip V
          const idx = (py * img.width + px) * 4;
          const brightness = data[idx]; // R channel as brightness

          // Only land areas (threshold > 100)
          if (brightness < 100) continue;

          const x = posAttr.getX(i);
          const y = posAttr.getY(i);
          const z = posAttr.getZ(i);

          // Front hemisphere only (z > 0 after slight tilt offset)
          if (z < -0.05) continue;

          // Depth-based opacity: front=1 back=0 with smooth edge fade
          const depthAlpha = Math.max(0, z);

          positions.push(x, y, z);
          opacities.push(depthAlpha);
        }

        // Core particles
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.008,
          transparent: true,
          opacity: 0.88,
          depthWrite: false,
          sizeAttenuation: true,
        });

        points = new THREE.Points(geo, mat);
        scene.add(points);

        // Glow layer (larger, semi-transparent blue-white)
        const glowMat = new THREE.PointsMaterial({
          color: 0xaad4ff,
          size: 0.018,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
          sizeAttenuation: true,
        });
        glow = new THREE.Points(geo, glowMat);
        scene.add(glow);

        sphere.dispose();
        texture.dispose();
      },
      undefined,
      (err) => console.error('Texture load error', err)
    );

    // ── Soft fog to darken edges ─────────────────────────────────────────
    scene.fog = new THREE.FogExp2(0x05070a, 0.18);

    // ── Animation loop ───────────────────────────────────────────────────
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (points) {
        points.rotation.y += 0.0015;
      }
      if (glow) {
        glow.rotation.y += 0.0015;
      }
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ background: '#05070a' }}
    />
  );
}
