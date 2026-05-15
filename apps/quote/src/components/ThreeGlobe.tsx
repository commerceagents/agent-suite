'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// ─── Inline world map (simplified land mask as run-length encoded rows) ────────
// 72x36 grid (5°×5° cells), 1=land, 0=ocean
// Rows from lat +87.5 → -87.5, columns from lon -177.5 → +177.5
const LAND_MASK_72x36 = [
  '000000000000000000000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000011000000000000000000000000000000000000000000000',
  '000000001100000000000000011100001111110000000111111111111111111000000000',
  '000000011111000000000000001110011111111001001111111111111111111100000000',
  '000000011111100000000000011111111111111111111111111111111111111000000000',
  '000001111111110000000000111111111111111111111111111111111111110000000000',
  '000001111111111000000001111111111111111111111111111111111111100000000000',
  '000001111111111000000000011111111111111111111111111111111110000000000000',
  '000001111111111100000000011111111111111111111111111111111100000000000000',
  '000001111111111100000001111111111111111111111111111111111110000000000000',
  '000001111111111110000001111111111111111111111111111111111110000000000000',
  '000000111111111110000000111111111111111111111111111111111100000000000000',
  '000000011111111111000000011111111111111111111111111111111000000000000000',
  '000000001111111111000000001111111111111111111111111110000000000000000000',
  '000000000011111100000000000111111111111111111111110000000000000000000000',
  '000000000011111000000000000011111111111111111111000000000000001100000000',
  '000000000001111000000000000001111111111111111110000000000000011100000000',
  '000000000001110000000000000001111111111111111100000000000000111110000000',
  '000000000001100000000000000001111111111111100000000000000000111100000000',
  '000000000000000000000000000001111111111110000000000000000001111100000000',
  '000000000000000000000000000000111111111100000000000000000001111000000000',
  '000000000000000000000000000001111111111110000000000000000001110000000000',
  '000000000000000000000000000001111111111110000000000000000001100000000000',
  '000000000000000000000000000001111111111100000000000000000000000000000000',
  '000000000000000000000000000001111111110000000000000000000000000000000000',
  '000000000000000000000000000001111111100000000000011100000000000000000000',
  '000000000000000000000000000001111110000000000000011110000000000000000000',
  '000000000000000000000000000001111100000000000000001110000000000000000000',
  '000000000000000000000000000001111100000000000000001100000000000000000000',
  '000000000000000000000000000001111110000000000000001100000000000000000000',
  '000000000000000000000000000000111110000000000000000000000000000000000000',
  '000000000000000000000000000000011100000000000000000000000000000000000000',
  '000000000000000000000000000000001100000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000000000000000000000',
];

function sampleLandMask(lat: number, lon: number): boolean {
  // lat: -90 to 90, lon: -180 to 180
  const col = Math.floor(((lon + 180) / 360) * 72) % 72;
  const row = Math.floor(((90 - lat) / 180) * 36);
  const r = Math.max(0, Math.min(35, row));
  const c = Math.max(0, Math.min(71, col));
  return LAND_MASK_72x36[r]?.[c] === '1';
}

export default function ThreeGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ─── Scene Setup ──────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020304);

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0.15, 2.6);
    camera.lookAt(0, 0, 0);

    // ─── WebGL availability check ─────────────────────────────────────────────
    const testCanvas = document.createElement('canvas');
    const webglSupported = !!(
      testCanvas.getContext('webgl2') ||
      testCanvas.getContext('webgl') ||
      testCanvas.getContext('experimental-webgl')
    );
    if (!webglSupported) {
      console.warn('ThreeGlobe: WebGL not available, skipping renderer.');
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // ─── Particle Generation ──────────────────────────────────────────────────
    const RADIUS = 1.0;
    const LAND_PARTICLES = 18000;
    const OCEAN_PARTICLES = 1200;

    const positions: number[] = [];
    const alphas: number[] = [];
    const sizes: number[] = [];

    // Fibonacci sphere sampling for even distribution
    const addPoint = (lat: number, lon: number, isLand: boolean) => {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lon + 180) * Math.PI / 180;
      const x = RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = RADIUS * Math.cos(phi);
      const z = RADIUS * Math.sin(phi) * Math.sin(theta);

      // Only render front-facing hemisphere with soft fade
      const frontness = z; // -1 to 1, positive = front
      if (frontness < -0.05) return; // skip back
      const edgeFade = Math.max(0, Math.min(1, (frontness + 0.12) / 0.25));

      // Tiny micro-jitter (does not break shape, just prevents perfect row look)
      const jitter = 0.002;
      positions.push(
        x + (Math.random() - 0.5) * jitter,
        y + (Math.random() - 0.5) * jitter,
        z + (Math.random() - 0.5) * jitter,
      );

      // Depth-based opacity: front bright, edges fade
      const depthAlpha = 0.4 + frontness * 0.5;
      alphas.push(depthAlpha * edgeFade * (isLand ? 1.0 : 0.18));
      sizes.push(isLand ? (1.8 + frontness * 1.4) : 0.7);
    };

    // Land particles — Fibonacci hemisphere
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const totalFib = LAND_PARTICLES * 4; // oversample to get enough land
    let landCount = 0;
    for (let i = 0; i < totalFib && landCount < LAND_PARTICLES; i++) {
      const t = i / (totalFib - 1);
      const inclination = Math.acos(1 - 2 * t); // 0 to PI
      const azimuth = (2 * Math.PI * i) / goldenRatio;
      const lat = 90 - (inclination * 180 / Math.PI);
      const lon = ((azimuth * 180 / Math.PI) % 360) - 180;
      if (sampleLandMask(lat, lon)) {
        addPoint(lat, lon, true);
        landCount++;
      }
    }

    // Ocean particles — sparse, random
    for (let i = 0; i < OCEAN_PARTICLES * 20; ) {
      const lat = Math.asin(Math.random() * 2 - 1) * 180 / Math.PI;
      const lon = Math.random() * 360 - 180;
      if (!sampleLandMask(lat, lon)) {
        addPoint(lat, lon, false);
        if (++i >= OCEAN_PARTICLES * 20) break;
      }
    }

    // ─── BufferGeometry ───────────────────────────────────────────────────────
    const geometry = new THREE.BufferGeometry();
    const posArr = new Float32Array(positions);
    const alphaArr = new Float32Array(alphas);
    const sizeArr = new Float32Array(sizes);
    geometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphaArr, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizeArr, 1));

    // ─── Custom Shader Material (glow dots) ───────────────────────────────────
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute float alpha;
        attribute float aSize;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;
        varying float vFront;

        void main() {
          vAlpha = alpha;
          // Shimmer: very subtle brightness pulse per particle
          float shimmer = 0.96 + 0.04 * sin(uTime * 1.2 + position.x * 8.0 + position.y * 6.0);
          vAlpha *= shimmer;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aSize * uPixelRatio * (280.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying float vAlpha;

        void main() {
          // Circular soft dot with glow falloff
          vec2 uv = gl_PointCoord - 0.5;
          float dist = length(uv);
          if (dist > 0.5) discard;

          // Soft glow falloff — core bright, edges soft
          float core = 1.0 - smoothstep(0.0, 0.22, dist);
          float glow = 1.0 - smoothstep(0.10, 0.50, dist);
          float brightness = core * 1.0 + glow * 0.5;

          gl_FragColor = vec4(vec3(brightness), vAlpha * brightness);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ─── Bloom glow overlay (wide soft pass using a second point cloud) ───────
    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute('position', new THREE.BufferAttribute(posArr.slice(0, landCount * 3), 3));
    const glowAlphas = new Float32Array(landCount);
    for (let i = 0; i < landCount; i++) glowAlphas[i] = alphas[i] * 0.08;
    glowGeo.setAttribute('alpha', new THREE.BufferAttribute(glowAlphas, 1));
    const glowSizes = new Float32Array(landCount).fill(12);
    glowGeo.setAttribute('aSize', new THREE.BufferAttribute(glowSizes, 1));

    const glowMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() } },
      vertexShader: `
        attribute float alpha;
        attribute float aSize;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPos;
          gl_PointSize = aSize * uPixelRatio * (280.0 / -mvPos.z);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float glow = 1.0 - smoothstep(0.0, 0.5, d);
          gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * glow * glow);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glowPoints = new THREE.Points(glowGeo, glowMat);
    scene.add(glowPoints);

    // ─── Animation ────────────────────────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow Y-axis rotation
      points.rotation.y = elapsed * 0.06;
      glowPoints.rotation.y = elapsed * 0.06;

      // Subtle camera drift
      camera.position.x = Math.sin(elapsed * 0.07) * 0.04;
      camera.position.y = 0.15 + Math.cos(elapsed * 0.05) * 0.02;
      camera.lookAt(0, 0, 0);

      material.uniforms.uTime.value = elapsed;
      glowMat.uniforms.uTime.value = elapsed;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#020304' }}
    />
  );
}
