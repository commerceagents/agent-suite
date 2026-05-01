'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
 
 
function TetrisSimulation() {
  const [gridDim, setGridDim] = React.useState({ cols: 20, rows: 20 });
  const cellSize = 40; // Perfect match for GridBackground
  const [stackedBlocks, setStackedBlocks] = React.useState<{x: number, y: number, color: string, isClearing?: boolean}[]>([]);
  
  // Minimalist White Glass Palette (Unified Style)
  const TETRIMINOS = React.useMemo(() => [
    { name: 'I', cells: [[0,1], [1,1], [2,1], [3,1]], color: 'rgba(255, 255, 255, 0.3)' },
    { name: 'O', cells: [[0,0], [1,0], [0,1], [1,1]], color: 'rgba(255, 255, 255, 0.3)' },
    { name: 'T', cells: [[1,0], [0,1], [1,1], [2,1]], color: 'rgba(255, 255, 255, 0.3)' },
    { name: 'S', cells: [[1,0], [2,0], [0,1], [1,1]], color: 'rgba(255, 255, 255, 0.3)' },
    { name: 'Z', cells: [[0,0], [1,0], [1,1], [2,1]], color: 'rgba(255, 255, 255, 0.3)' },
    { name: 'J', cells: [[0,0], [0,1], [1,1], [2,1]], color: 'rgba(255, 255, 255, 0.3)' },
    { name: 'L', cells: [[2,0], [0,1], [1,1], [2,1]], color: 'rgba(255, 255, 255, 0.3)' },
  ], []);

  const [activeShapes, setActiveShapes] = React.useState<{
    id: number;
    cells: [number, number][];
    x: number;
    y: number;
    color: string;
  }[]>([]);

  const spawnShape = React.useCallback((id: number, cols: number) => {
    const type = TETRIMINOS[Math.floor(Math.random() * TETRIMINOS.length)];
    let cells = [...type.cells] as [number, number][];
    const rotations = Math.floor(Math.random() * 4);
    for (let i = 0; i < rotations; i++) {
      cells = cells.map(([cx, cy]) => [-cy, cx]) as [number, number][];
    }
    
    return {
      id,
      cells,
      x: Math.floor(Math.random() * (cols - 4)) + 2,
      y: -4 - Math.floor(Math.random() * 10),
      color: type.color
    };
  }, [TETRIMINOS]);

  // Initial calculation and spawn
  React.useEffect(() => {
    const updateGrid = () => {
      const cols = Math.floor(window.innerWidth / cellSize);
      const rows = Math.floor((window.innerHeight * 0.8) / cellSize);
      setGridDim({ cols, rows });
      setActiveShapes(Array.from({ length: 5 }, (_, i) => spawnShape(i, cols)));
    };
    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, [spawnShape]);

  React.useEffect(() => {
    const tick = setInterval(() => {
      setStackedBlocks(prevStacked => {
        let newStacked = [...prevStacked];
        
        // Only keep blocks that aren't marked for removal
        newStacked = newStacked.filter(b => !b.isClearing);

        setActiveShapes(prevShapes => {
          return prevShapes.map(shape => {
            const nextY = shape.y + 1;
            
            const collision = shape.cells.some(([cx, cy]) => {
              const absX = shape.x + cx;
              const absY = nextY + cy;
              return absY >= gridDim.rows || newStacked.some(b => b.x === absX && b.y === absY);
            });

            if (collision && shape.y >= -2) {
              // LOCK PIECE PERMANENTLY
              shape.cells.forEach(([cx, cy]) => {
                const lx = shape.x + cx;
                const ly = Math.floor(shape.y + cy);
                if (ly >= 0) {
                  newStacked.push({ x: lx, y: ly, color: shape.color });
                }
              });

              // LINE CLEAR - ONLY 100% FULL ROWS (Real Game Logic)
              let linesToClear: number[] = [];
              for (let r = gridDim.rows - 1; r >= 0; r--) {
                const rowBlocks = newStacked.filter(b => b.y === r);
                // Must be exactly equal to columns to clear
                if (rowBlocks.length >= gridDim.cols) {
                  linesToClear.push(r);
                }
              }

              if (linesToClear.length > 0) {
                // Trigger the "Pop" animation
                newStacked = newStacked.map(b => linesToClear.includes(b.y) ? { ...b, isClearing: true } : b);
                
                setTimeout(() => {
                  setStackedBlocks(current => {
                    let next = current.filter(b => !linesToClear.includes(b.y));
                    linesToClear.sort((a, b) => a - b).forEach(r => {
                      next = next.map(b => b.y < r ? { ...b, y: b.y + 1 } : b);
                    });
                    return next;
                  });
                }, 400);
              }

              return spawnShape(shape.id, gridDim.cols);
            } else if (collision && shape.y < -2) {
              return spawnShape(shape.id, gridDim.cols);
            }

            return { ...shape, y: nextY };
          });
        });

        // MASSIVE STACK CAPACITY: Allow up to 2000 blocks for giant structures
        if (newStacked.length > 2000) {
           newStacked = newStacked.filter(b => b.y > gridDim.rows / 5);
        }

        return newStacked;
      });
    }, 450);

    return () => clearInterval(tick);
  }, [spawnShape, gridDim]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40 flex justify-center">
      <div 
        className="relative" 
        style={{ 
          width: gridDim.cols * cellSize, 
          height: gridDim.rows * cellSize 
        }}
      >
        {/* Falling Pieces */}
        {activeShapes.map(shape => (
          <div 
            key={shape.id} 
            className="absolute"
            style={{ 
              left: shape.x * cellSize,
              top: shape.y * cellSize,
              transition: shape.y <= 0 ? 'none' : 'top 0.4s linear'
            }}
          >
            {shape.cells.map(([cx, cy], i) => (
              <div 
                key={i}
                className="absolute"
                style={{ 
                  width: cellSize, 
                  height: cellSize,
                  left: cx * cellSize,
                  top: cy * cellSize,
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.05)'
                }}
              />
            ))}
          </div>
        ))}

        {/* Stacked Pieces */}
        {stackedBlocks.map((block, i) => (
          <motion.div 
            key={`stacked-${i}-${block.x}-${block.y}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={block.isClearing ? { 
              scale: 1.8, 
              opacity: 0,
              backgroundColor: '#ffffff',
              boxShadow: '0 0 60px #ffffff'
            } : { 
              scale: 1, 
              opacity: 1 
            }}
            transition={{ duration: block.isClearing ? 0.4 : 0.2 }}
            className="absolute"
            style={{ 
              width: cellSize, 
              height: cellSize,
              left: block.x * cellSize,
              top: block.y * cellSize,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: block.isClearing ? 10 : 1
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RippleGrid() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CONFIG = {
      spacing: 32,
      dotRadius: 1.5,
      color: { r: 255, g: 255, b: 255 }, // Neon White
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

    let w = 0, h = 0, cx = 0, cy = 0;
    let dots: any[] = [];
    const autoWaves: any[] = [];
    const mouseWaves: any[] = [];
    let lastAutoWave = 0;
    let mouse = { x: -1000, y: -1000, active: false };
    let mouseMoveDist = 0;
    const startTime = performance.now();

    class GridDot {
      ox: number; oy: number; x: number; y: number; centerDist: number;
      baseAlpha: number; alpha: number; radius: number; baseRadius: number; phase: number;
      constructor(ox: number, oy: number, centerDist: number) {
        this.ox = ox; this.oy = oy; this.x = ox; this.y = oy; this.centerDist = centerDist;
        if (centerDist < CONFIG.centerDeadzone) this.baseAlpha = 0;
        else if (centerDist < CONFIG.centerDeadzone + CONFIG.centerFade) this.baseAlpha = ((centerDist - CONFIG.centerDeadzone) / CONFIG.centerFade) * 0.07;
        else this.baseAlpha = 0.04 + Math.random() * 0.04;
        this.alpha = this.baseAlpha;
        this.radius = CONFIG.dotRadius;
        this.baseRadius = CONFIG.dotRadius * (0.8 + Math.random() * 0.4);
        this.phase = Math.random() * Math.PI * 2;
      }
    }

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      w = parent.clientWidth;
      h = parent.clientHeight;
      cx = w / 2;
      cy = h / 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    };

    const buildGrid = () => {
      dots = [];
      const sp = CONFIG.spacing;
      const cols = Math.ceil(w / sp) + 2;
      const rows = Math.ceil(h / sp) + 2;
      const offsetX = (w - (cols - 1) * sp) / 2;
      const offsetY = (h - (rows - 1) * sp) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = offsetX + c * sp;
          const oy = offsetY + r * sp;
          const dx = ox - cx;
          const dy = oy - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          dots.push(new GridDot(ox, oy, dist));
        }
      }
    };

    const spawnMouseWave = (time: number) => {
      mouseWaves.push({ cx: mouse.x, cy: mouse.y, birthTime: time, speed: CONFIG.mouseWaveSpeed, decay: CONFIG.mouseWaveDecay, strength: CONFIG.mouseWaveStrength });
      if (mouseWaves.length > CONFIG.maxMouseWaves) mouseWaves.shift();
    };

    const computeWaveDisplacement = (dot: any, waves: any[], time: number) => {
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
    };

    const animate = () => {
      const time = (performance.now() - startTime) / 1000;
      const { r, g, b } = CONFIG.color;

      if (time - lastAutoWave > CONFIG.autoWaveInterval) {
        autoWaves.push({ cx, cy, birthTime: time, speed: CONFIG.autoWaveSpeed, decay: CONFIG.autoWaveDecay, strength: CONFIG.autoWaveStrength });
        if (autoWaves.length > 6) autoWaves.shift();
        lastAutoWave = time;
      }

      if (mouse.active && mouseMoveDist > 40) {
        spawnMouseWave(time);
        mouseMoveDist = 0;
      }

      ctx.clearRect(0, 0, w, h);
      for (const dot of dots) {
        if (dot.baseAlpha === 0) continue;
        const ambient = Math.sin(time * 0.8 + dot.phase) * CONFIG.ambientStrength;
        const ambientX = Math.sin(dot.oy * 0.01 + time * 0.3) * ambient * 0.3;
        const ambientY = Math.cos(dot.ox * 0.01 + time * 0.3) * ambient * 0.3;

        const auto = computeWaveDisplacement(dot, autoWaves, time);
        const mouseD = computeWaveDisplacement(dot, mouseWaves, time);
        const totalDispX = auto.dispX + mouseD.dispX + ambientX;
        const totalDispY = auto.dispY + mouseD.dispY + ambientY;
        const totalBright = auto.brightness + mouseD.brightness;

        dot.x = dot.ox + totalDispX;
        dot.y = dot.oy + totalDispY;
        dot.alpha = dot.baseAlpha + totalBright * 0.5;
        dot.radius = dot.baseRadius + totalBright * 1.2;

        if (mouse.active) {
          const mdx = dot.ox - mouse.x;
          const mdy = dot.oy - mouse.y;
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

        // 1. Draw persistent soft glow/halo for every dot (Brighter)
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dot.alpha * 0.25})`;
        ctx.fill();

        // 2. Extra bloom for active/bright dots (waves)
        if (dot.radius > CONFIG.dotRadius * 1.2) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dot.alpha * 0.15})`;
          ctx.fill();
        }

        // 3. Core dot (Solid Alpha)
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(dot.alpha * 1.5, 1)})`;
        ctx.fill();
      }
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      const dx = nx - mouse.x;
      const dy = ny - mouse.y;
      mouseMoveDist += Math.sqrt(dx * dx + dy * dy);
      mouse.x = nx;
      mouse.y = ny;
      mouse.active = true;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-100" />;
}

function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Grassroot Foundation Physics with Purple Aesthetic */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>
      <RippleGrid />
    </div>
  );
}

function DrawingStroke({ delay }: { delay: number }) {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {/* Path 1: Bottom-Center -> Left -> Top-Center */}
      <motion.path
        d="M 50 100 L 5 100 C 2 100 0 98 0 95 L 0 5 C 0 2 2 0 5 0 L 50 0"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: 1 
        }}
        transition={{ 
          duration: 2.5, 
          delay: delay, 
          ease: "linear" 
        }}
        style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))" }}
      />
      {/* Path 2: Bottom-Center -> Right -> Top-Center */}
      <motion.path
        d="M 50 100 L 95 100 C 98 100 100 98 100 95 L 100 5 C 100 2 98 0 95 0 L 50 0"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: 1, 
          opacity: 1 
        }}
        transition={{ 
          duration: 2.5, 
          delay: delay, 
          ease: "linear" 
        }}
        style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))" }}
      />
    </svg>
  );
}


export default function SpaceHorizonHero() {
  return (
    <section className="relative h-[100dvh] w-full bg-black overflow-hidden font-sans select-none flex items-center justify-center">

      {/* NAVIGATION LAYER */}
      <div className="absolute top-0 left-0 right-0 z-50 pt-5 flex justify-center">
        <div className="w-full max-w-[1800px] px-6 md:px-12 lg:px-20">
          <Navigation show={true} delay={13.0} />
        </div>
      </div>

      <div className="relative z-20 h-full w-full flex items-end justify-center pb-[4vh]">
        <div className="w-full max-w-[1800px] px-6 md:px-12 lg:px-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 3.5, 
              delay: 10.2, // Reveal AFTER Loading complete (10.2s)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ease: [0.16, 1, 0.3, 1] as any 
            }}
            className="relative w-full min-h-[50vh] h-[75vh] md:h-[80vh] p-6 md:p-12 lg:p-20 rounded-[48px] overflow-hidden backdrop-blur-[30px] shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center transform-gpu"
            style={{ 
              isolation: 'isolate',
              willChange: 'transform, opacity',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)'
            }}
          >
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-end">
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Subtle white glow at the bottom edge */}
                <div 
                  className="absolute -bottom-[45%] left-[-50%] w-[200%] h-[120%] rounded-[100%] z-10 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at bottom, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)',
                    filter: 'blur(40px)',
                    opacity: 0.6
                  }}
                />
              </div>
            </div>





            {/* BRAND TEXT */}
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800;900&display=swap');
              
              @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .shimmer-text {
                background: linear-gradient(90deg, 
                  rgba(255,255,255,0.6) 0%, 
                  rgba(255,255,255,1) 50%, 
                  rgba(255,255,255,0.6) 100%
                );
                background-size: 200% auto;
                -webkit-background-clip: text;
                background-clip: text;
                animation: shimmer 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                text-shadow: 0 0 30px rgba(255,255,255,0.15);
              }
            `}</style>
            <div className="relative z-10 flex flex-col items-center">
              
              <motion.h1
                initial={{ opacity: 0, scale: 5, letterSpacing: "0em", filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, letterSpacing: "0.2em", filter: 'blur(0px)' }}
                transition={{ 
                  opacity: { duration: 2, delay: 10.7 },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  scale: { duration: 4, delay: 10.7, ease: [0.16, 1, 0.3, 1] as any },
                  letterSpacing: { duration: 5, delay: 11.2, ease: "easeOut" },
                  filter: { duration: 2, delay: 10.7 }
                }}
                className="shimmer-text relative z-10 text-transparent font-bold leading-tight uppercase select-none text-center max-w-full break-words tracking-widest mb-10"
                style={{ 
                  fontFamily: "'Alexandria', sans-serif",
                  fontSize: "clamp(32px, 6vw, 72px)",
                }}
              >
                COMMERCE AGENTS
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                transition={{ duration: 2, delay: 14.0, ease: [0.16, 1, 0.3, 1] as any }}
                className="text-white/80 font-medium text-sm md:text-base lg:text-lg tracking-[0.2em] uppercase text-center"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Autonomous Intelligence for Modern Commerce
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
