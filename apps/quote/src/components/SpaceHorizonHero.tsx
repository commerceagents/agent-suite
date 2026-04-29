'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
 
function TetrisSimulation() {
  const [gridDim, setGridDim] = React.useState({ cols: 20, rows: 20 });
  const cellSize = 40; // Perfect match for GridBackground
  const [stackedBlocks, setStackedBlocks] = React.useState<{x: number, y: number, color: string, isClearing?: boolean}[]>([]);
  
  // Classic Neon Tetrimino Palette
  const TETRIMINOS = React.useMemo(() => [
    { name: 'I', cells: [[0,1], [1,1], [2,1], [3,1]], color: '#00f0f0' }, // Cyan
    { name: 'O', cells: [[0,0], [1,0], [0,1], [1,1]], color: '#f0f000' }, // Yellow
    { name: 'T', cells: [[1,0], [0,1], [1,1], [2,1]], color: '#a000f0' }, // Purple
    { name: 'S', cells: [[1,0], [2,0], [0,1], [1,1]], color: '#00f000' }, // Green
    { name: 'Z', cells: [[0,0], [1,0], [1,1], [2,1]], color: '#f00000' }, // Red
    { name: 'J', cells: [[0,0], [0,1], [1,1], [2,1]], color: '#0000f0' }, // Blue
    { name: 'L', cells: [[2,0], [0,1], [1,1], [2,1]], color: '#f0a000' }, // Orange
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
              shape.cells.forEach(([cx, cy]) => {
                const lx = shape.x + cx;
                const ly = shape.y + cy;
                if (ly >= 0) {
                  newStacked.push({ x: lx, y: ly, color: shape.color });
                }
              });

              // Line clear check (80% full)
              let linesToClear: number[] = [];
              for (let r = gridDim.rows - 1; r >= 0; r--) {
                const rowBlocks = newStacked.filter(b => b.y === r);
                if (rowBlocks.length >= gridDim.cols * 0.8) {
                  linesToClear.push(r);
                }
              }

              if (linesToClear.length > 0) {
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

        if (newStacked.length > 400) {
           newStacked = newStacked.filter(b => b.y > gridDim.rows / 4);
        }

        return newStacked;
      });
    }, 450);

    return () => clearInterval(tick);
  }, [spawnShape, gridDim]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
      {/* Falling Pieces */}
      {activeShapes.map(shape => (
        <div 
          key={shape.id} 
          className="absolute transition-all duration-300 ease-out"
          style={{ 
            left: `${(shape.x / gridDim.cols) * 100}%`,
            top: `${(shape.y / gridDim.rows) * 100}%`,
          }}
        >
          {shape.cells.map(([cx, cy], i) => (
            <div 
              key={i}
              className="absolute"
              style={{ 
                width: cellSize - 1, 
                height: cellSize - 1,
                left: cx * cellSize,
                top: cy * cellSize,
                backgroundColor: `${shape.color}22`,
                border: `1px solid ${shape.color}`,
                boxShadow: `0 0 10px ${shape.color}44, inset 0 0 5px ${shape.color}44`
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
            boxShadow: '0 0 40px #ffffff'
          } : { 
            scale: 1, 
            opacity: 1 
          }}
          transition={{ duration: block.isClearing ? 0.4 : 0.2 }}
          className="absolute"
          style={{ 
            width: cellSize - 1, 
            height: cellSize - 1,
            left: `${(block.x / gridDim.cols) * 100}%`,
            top: `${(block.y / gridDim.rows) * 100}%`,
            backgroundColor: `${block.color}11`,
            border: `1px solid ${block.color}88`,
            zIndex: block.isClearing ? 10 : 1
          }}
        />
      ))}
    </div>
  );
}

function GridBackground() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.15] pointer-events-none z-0" 
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
