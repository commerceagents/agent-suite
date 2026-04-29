// ========================================
// Ripple Grid — Wave-Emitting Dot Field
// ========================================

(() => {
  const CONFIG = {
    spacing: 28,
    dotRadius: 1.2,
    color: { r: 0, g: 209, b: 255 },
    centerDeadzone: 80,
    centerFade: 160,
    autoWaveSpeed: 200,
    autoWaveInterval: 2.0,
    autoWaveDecay: 0.002,
    autoWaveStrength: 18,
    mouseWaveSpeed: 200,
    mouseWaveDecay: 0.004,
    mouseWaveStrength: 18,
    maxMouseWaves: 8,
    ambientStrength: 1.5,
  };

  const autoWaves = [];
  const mouseWaves = [];
  let lastAutoWave = 0;
  let lastMousePos = { x: -1, y: -1 };
  let mouseMoveDist = 0;

  class GridDot {
    constructor(ox, oy, centerDist) {
      this.ox = ox;
      this.oy = oy;
      this.x = ox;
      this.y = oy;
      this.centerDist = centerDist;

      if (centerDist < CONFIG.centerDeadzone) {
        this.baseAlpha = 0;
      } else if (centerDist < CONFIG.centerDeadzone + CONFIG.centerFade) {
        this.baseAlpha = ((centerDist - CONFIG.centerDeadzone) / CONFIG.centerFade) * 0.07;
      } else {
        this.baseAlpha = 0.04 + Math.random() * 0.04;
      }

      this.alpha = this.baseAlpha;
      this.radius = CONFIG.dotRadius;
      this.baseRadius = CONFIG.dotRadius * (0.8 + Math.random() * 0.4);
      this.phase = Math.random() * Math.PI * 2;
    }
  }

  class RippleGrid {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.dots = [];
      this.w = 0;
      this.h = 0;
      this.cx = 0;
      this.cy = 0;
      this.mouse = { x: -1000, y: -1000, active: false };
      this.startTime = performance.now();
      this.init();
    }

    init() {
      const existing = document.getElementById('bg-canvas');
      if (existing) existing.remove();

      this.canvas = document.createElement('canvas');
      this.canvas.id = 'bg-canvas';
      Object.assign(this.canvas.style, {
        position: 'fixed',
        top: '0', left: '0',
        width: '100%', height: '100%',
        zIndex: '0',
        pointerEvents: 'none',
      });
      document.body.prepend(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      this.resize();
      this.buildGrid();

      window.addEventListener('resize', () => { this.resize(); this.buildGrid(); });
      window.addEventListener('mousemove', (e) => {
        const dx = e.clientX - this.mouse.x;
        const dy = e.clientY - this.mouse.y;
        mouseMoveDist += Math.sqrt(dx * dx + dy * dy);
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.active = true;
      });
      window.addEventListener('mouseout', () => { this.mouse.active = false; });

      this.animate();
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      this.cx = this.w / 2;
      this.cy = this.h / 2;
      this.canvas.width = this.w * dpr;
      this.canvas.height = this.h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    buildGrid() {
      this.dots = [];
      const sp = CONFIG.spacing;
      const cols = Math.ceil(this.w / sp) + 2;
      const rows = Math.ceil(this.h / sp) + 2;
      const offsetX = (this.w - (cols - 1) * sp) / 2;
      const offsetY = (this.h - (rows - 1) * sp) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = offsetX + c * sp;
          const oy = offsetY + r * sp;
          const dx = ox - this.cx;
          const dy = oy - this.cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          this.dots.push(new GridDot(ox, oy, dist));
        }
      }
    }

    spawnAutoWave(time) {
      autoWaves.push({
        cx: this.cx, cy: this.cy,
        birthTime: time,
        speed: CONFIG.autoWaveSpeed,
        decay: CONFIG.autoWaveDecay,
        strength: CONFIG.autoWaveStrength,
      });
      if (autoWaves.length > 6) autoWaves.shift();
    }

    spawnMouseWave(time) {
      mouseWaves.push({
        cx: this.mouse.x, cy: this.mouse.y,
        birthTime: time,
        speed: CONFIG.mouseWaveSpeed,
        decay: CONFIG.mouseWaveDecay,
        strength: CONFIG.mouseWaveStrength,
      });
      if (mouseWaves.length > CONFIG.maxMouseWaves) mouseWaves.shift();
    }

    computeWaveDisplacement(dot, waves, time) {
      let dispX = 0, dispY = 0, brightness = 0;

      for (const wave of waves) {
        const age = time - wave.birthTime;
        const waveFront = age * wave.speed;
        const dx = dot.ox - wave.cx;
        const dy = dot.oy - wave.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const distFromFront = Math.abs(dist - waveFront);
        const waveWidth = 60;

        if (distFromFront < waveWidth) {
          const envelope = (1 - distFromFront / waveWidth);
          const distFade = Math.exp(-dist * wave.decay);
          const ageFade = Math.exp(-age * 0.4);
          const intensity = envelope * distFade * ageFade * wave.strength;

          if (dist > 1) {
            dispX += (dx / dist) * intensity;
            dispY += (dy / dist) * intensity;
          }
          brightness += envelope * distFade * ageFade * 1.8;
        }
      }
      return { dispX, dispY, brightness };
    }

    animate() {
      const time = (performance.now() - this.startTime) / 1000;
      const { r, g, b } = CONFIG.color;

      if (time - lastAutoWave > CONFIG.autoWaveInterval) {
        this.spawnAutoWave(time);
        lastAutoWave = time;
      }

      if (this.mouse.active && mouseMoveDist > 40) {
        this.spawnMouseWave(time);
        mouseMoveDist = 0;
      }

      this.ctx.clearRect(0, 0, this.w, this.h);

      for (const dot of this.dots) {
        if (dot.baseAlpha === 0) continue;

        const ambient = Math.sin(time * 0.8 + dot.phase) * CONFIG.ambientStrength;
        const ambientX = Math.sin(dot.oy * 0.01 + time * 0.3) * ambient * 0.3;
        const ambientY = Math.cos(dot.ox * 0.01 + time * 0.3) * ambient * 0.3;

        const auto = this.computeWaveDisplacement(dot, autoWaves, time);
        const mouseD = this.computeWaveDisplacement(dot, mouseWaves, time);

        const totalDispX = auto.dispX + mouseD.dispX + ambientX;
        const totalDispY = auto.dispY + mouseD.dispY + ambientY;
        const totalBright = auto.brightness + mouseD.brightness;

        dot.x = dot.ox + totalDispX;
        dot.y = dot.oy + totalDispY;
        dot.alpha = dot.baseAlpha + totalBright * 0.5;
        dot.radius = dot.baseRadius + totalBright * 1.2;

        if (this.mouse.active) {
          const mdx = dot.ox - this.mouse.x;
          const mdy = dot.oy - this.mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 120) {
            const proximity = (120 - mDist) / 120;
            dot.alpha += proximity * 0.3;
            dot.radius += proximity * 0.8;
            dot.x -= (mdx / mDist) * proximity * 3;
            dot.y -= (mdy / mDist) * proximity * 3;
          }
        }

        dot.alpha = Math.min(dot.alpha, 0.95);

        if (dot.radius > CONFIG.dotRadius * 1.5) {
          this.ctx.beginPath();
          this.ctx.arc(dot.x, dot.y, dot.radius * 3, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dot.alpha * 0.06})`;
          this.ctx.fill();
        }

        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dot.alpha})`;
        this.ctx.fill();
      }

      const pulse = Math.sin(time * Math.PI / CONFIG.autoWaveInterval) * 0.5 + 0.5;
      const cGrad = this.ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, CONFIG.centerDeadzone + 40);
      cGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.03 + pulse * 0.03})`);
      cGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      this.ctx.fillStyle = cGrad;
      this.ctx.fillRect(this.cx - 200, this.cy - 200, 400, 400);

      requestAnimationFrame(() => this.animate());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new RippleGrid());
  } else {
    new RippleGrid();
  }
})();
