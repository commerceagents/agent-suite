'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
 
function TetrisSimulation() {
  const GRID_COLS = 20;
  const GRID_ROWS = 20;
  const [cellSize, setCellSize] = React.useState(25);
  const [stackedBlocks, setStackedBlocks] = React.useState<{x: number, y: number, color: string}[]>([]);
  
  // All 7 Tetrimino shapes with their standard rotations
  const TETRIMINOS = React.useMemo(() => [
    { name: 'I', cells: [[0,1], [1,1], [2,1], [3,1]], color: 'rgba(0, 255, 255, 0.3)' },
    { name: 'O', cells: [[0,0], [1,0], [0,1], [1,1]], color: 'rgba(255, 255, 0, 0.3)' },
    { name: 'T', cells: [[1,0], [0,1], [1,1], [2,1]], color: 'rgba(128, 0, 128, 0.3)' },
    { name: 'S', cells: [[1,0], [2,0], [0,1], [1,1]], color: 'rgba(0, 255, 0, 0.3)' },
    { name: 'Z', cells: [[0,0], [1,0], [1,1], [2,1]], color: 'rgba(255, 0, 0, 0.3)' },
    { name: 'J', cells: [[0,0], [0,1], [1,1], [2,1]], color: 'rgba(0, 0, 255, 0.3)' },
    { name: 'L', cells: [[2,0], [0,1], [1,1], [2,1]], color: 'rgba(255, 165, 0, 0.3)' },
  ], []);

  const [activeShapes, setActiveShapes] = React.useState<{
    id: number;
    cells: [number, number][];
    x: number;
    y: number;
    color: string;
  }[]>([]);

  // Spawn function
  const spawnShape = React.useCallback((id: number) => {
    const type = TETRIMINOS[Math.floor(Math.random() * TETRIMINOS.length)];
    // Random rotation (0, 90, 180, 270)
    let cells = [...type.cells] as [number, number][];
    const rotations = Math.floor(Math.random() * 4);
    for (let i = 0; i < rotations; i++) {
      cells = cells.map(([cx, cy]) => [-cy, cx]) as [number, number][];
    }
    
    return {
      id,
      cells,
      x: Math.floor(Math.random() * (GRID_COLS - 4)) + 2,
      y: -5 - (Math.random() * 10), // Random start height for variety
      color: type.color
    };
  }, [TETRIMINOS]);

  // Initial spawn
  React.useEffect(() => {
    setActiveShapes(Array.from({ length: 6 }, (_, i) => spawnShape(i)));
  }, [spawnShape]);

  // Main Loop
  React.useEffect(() => {
    const tick = setInterval(() => {
      setStackedBlocks(prevStacked => {
        let newStacked = [...prevStacked];
        
        setActiveShapes(prevShapes => {
          return prevShapes.map(shape => {
            // Slower fall speed: 0.1 units per tick
            const nextY = shape.y + 0.15;
            
            // Collision detection
            const collision = shape.cells.some(([cx, cy]) => {
              const absX = shape.x + cx;
              const absY = Math.floor(nextY + cy);
              return absY >= GRID_ROWS || newStacked.some(b => b.x === absX && b.y === absY);
            });

            if (collision) {
              // Lock into grid
              shape.cells.forEach(([cx, cy]) => {
                const lx = shape.x + cx;
                const ly = Math.floor(shape.y + cy);
                if (ly >= 0 && !newStacked.some(b => b.x === lx && b.y === ly)) {
                  newStacked.push({ x: lx, y: ly, color: shape.color });
                }
              });

              // Line clear check (if 60% of row is filled)
              for (let r = GRID_ROWS - 1; r >= 0; r--) {
                const rowBlocks = newStacked.filter(b => b.y === r);
                if (rowBlocks.length >= GRID_COLS * 0.6) {
                  newStacked = newStacked.filter(b => b.y !== r).map(b => b.y < r ? { ...b, y: b.y + 1 } : b);
                }
              }

              // Respawn this specific shape
              return spawnShape(shape.id);
            }

            return { ...shape, y: nextY };
          });
        });

        // Limit stack height (if it reaches top, clear some random bottom blocks)
        if (newStacked.some(b => b.y < 2)) {
          newStacked = newStacked.filter(b => b.y > 10);
        }

        return newStacked;
      });
    }, 50); // Faster ticks but smaller increments for smoothness

    return () => clearInterval(tick);
  }, [spawnShape]);

  React.useEffect(() => {
    const updateSize = () => setCellSize(window.innerWidth < 768 ? 14 : 22);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
      {/* Falling Pieces */}
      {activeShapes.map(shape => (
        <div 
          key={shape.id} 
          className="absolute"
          style={{ 
            left: `${(shape.x / GRID_COLS) * 100}%`,
            top: `${(shape.y / GRID_ROWS) * 100}%`,
            transition: 'top 0.05s linear'
          }}
        >
          {shape.cells.map(([cx, cy], i) => (
            <div 
              key={i}
              className="absolute border border-white/10"
              style={{ 
                width: cellSize, 
                height: cellSize,
                left: cx * cellSize,
                top: cy * cellSize,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)'
              }}
            />
          ))}
        </div>
      ))}

      {/* Stacked Pieces */}
      {stackedBlocks.map((block, i) => (
        <motion.div 
          key={`stacked-${i}-${block.x}-${block.y}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute bg-white/5 border border-white/5"
          style={{ 
            width: cellSize, 
            height: cellSize,
            left: `${(block.x / GRID_COLS) * 100}%`,
            top: `${(block.y / GRID_ROWS) * 100}%`,
            boxShadow: '0 0 5px rgba(255,255,255,0.02)'
          }}
        />
      ))}
    </div>
  );
}

function GridBackground() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.12] pointer-events-none z-0" 
      style={{ 
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
      }} 
    />
  );
}

function DrawingStroke({ delay }: { delay: number }) {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {/* Side 1: Top-Center -> Right -> Bottom-Center */}
      <motion.path
        d="M 50 0 L 98 0 C 99 0 100 1 100 2 L 100 98 C 100 99 99 100 98 100 L 50 100"
        fill="none"
        stroke="white"
        strokeWidth="0.2"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1, 1], 
          opacity: [0, 1, 1, 0] 
        }}
        transition={{ 
          duration: 9, 
          times: [0, 0.4, 0.9, 1],
          delay: delay, 
          ease: "easeInOut" 
        }}
      />
      {/* Side 2: Top-Center -> Left -> Bottom-Center */}
      <motion.path
        d="M 50 0 L 2 0 C 1 0 0 1 0 2 L 0 98 C 0 99 1 100 2 100 L 50 100"
        fill="none"
        stroke="white"
        strokeWidth="0.2"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1, 1], 
          opacity: [0, 1, 1, 0] 
        }}
        transition={{ 
          duration: 9, 
          times: [0, 0.4, 0.9, 1],
          delay: delay, 
          ease: "easeInOut" 
        }}
      />
    </svg>
  );
}

function AtmosphericBloom() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
      {/* Soft volumetric blobs that replicate the 'fog' feel without WebGL */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 10.5, duration: 4 }}
        className="absolute inset-0"
      >
        <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-purple-900/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
      </motion.div>
    </div>
  );
}

export default function SpaceHorizonHero() {
  return (
    <section className="relative h-[100dvh] w-full bg-[#050508] overflow-hidden font-sans select-none flex items-center justify-center">
      {/* STEP 1: DEEP NAVY TO BLACK ATMOSPHERE */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ background: 'radial-gradient(circle at center, #0a0a25 0%, #000000 100%)' }}
      />

      {/* NAVIGATION LAYER (Starts 14s - Sync with text expansion) */}
      <div className="absolute top-0 left-0 right-0 z-50 pt-6 px-4">
        <Navigation show={true} delay={11.5} />
      </div>

      {/* UI LAYER - GLASS CARD (Bottom Aligned) */}
      <div className="relative z-20 h-full w-full flex items-end justify-center pb-[4vh]">
        <div className="w-full max-w-[2400px]">
          {/* STEP 2: GLASS CARD REVEAL (Starts 9.5s) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 3.5, 
              delay: 10.0, 
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
            {/* 1. SAAS GRADIENT WAVE & PLASMA FLAME */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-end">

              {/* PHASE 1 & 5: DRAWING STROKE REVEAL & EXIT */}
              <DrawingStroke delay={10.2} />

              {/* HIGH-FIDELITY GRADIENT STACK (Rising Horizon + Razor Sharp Side Glows) */}
              <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
                {/* 1. The Deep Black Atmosphere (Top down) */}
                <div className="absolute inset-0 bg-black/60" />
                
                {/* 2. The Vibrant Purple Bloom (Bottom-Up) - Tall & Immersive */}
                <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-purple-600/50 via-purple-900/10 to-transparent blur-[30px]" />
                
                {/* 3. Left Side Bloom - Razor Thin & Razor Sharp (Full Height) */}
                <div className="absolute inset-y-0 left-0 w-[1%] bg-gradient-to-r from-purple-600/50 to-transparent blur-[3px]" />
                
                {/* 4. Right Side Bloom - Razor Thin & Razor Sharp (Full Height) */}
                <div className="absolute inset-y-0 right-0 w-[1%] bg-gradient-to-l from-purple-600/50 to-transparent blur-[3px]" />

                {/* 5. The Dense White Horizon (Absolute Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-white/30 via-white/5 to-transparent blur-[5px]" />
              </div>

              {/* PHASE 2: STATIC ATMOSPHERIC BLOOM (Stable & Performant Alternative to WebGL) */}
              <AtmosphericBloom />
            </div>

            {/* 2. SUBTLE GRID & PIXEL BLOCKS */}
            <GridBackground />
            <TetrisSimulation />

            {/* BRAND TEXT */}
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800;900&display=swap');
              
              @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .shimmer-text {
                background: linear-gradient(90deg, 
                  rgba(255,255,255,0.7) 0%, 
                  rgba(255,255,255,1) 50%, 
                  rgba(255,255,255,0.7) 100%
                );
                background-size: 200% auto;
                -webkit-background-clip: text;
                background-clip: text;
                animation: shimmer 5s linear infinite;
              }
            `}</style>
            <motion.h1
              initial={{ opacity: 0, scale: 5, letterSpacing: "0em", filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, letterSpacing: "0.2em", filter: 'blur(0px)' }}
              transition={{ 
                opacity: { duration: 2, delay: 11 },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                scale: { duration: 4, delay: 11, ease: [0.16, 1, 0.3, 1] as any },
                letterSpacing: { duration: 5, delay: 11.5, ease: "easeOut" },
                filter: { duration: 2, delay: 11 }
              }}
              className="shimmer-text relative z-10 text-transparent font-bold leading-tight uppercase select-none text-center max-w-full break-words tracking-widest"
              style={{ 
                fontFamily: "'Alexandria', sans-serif",
                fontSize: "clamp(32px, 6vw, 72px)",
              }}
            >
              COMMERCE AGENTS
            </motion.h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
