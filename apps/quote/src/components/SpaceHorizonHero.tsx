'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import HalftoneCanvas from './HalftoneCanvas';
import { useLenis } from 'lenis/react';

const NAV_LINKS = [
  { label: 'About us', href: '#about' },
  { label: 'Service', href: '#services' },
  { label: 'Project', href: '#projects' },
  { label: 'Contact us', href: '#contact' },
];

const HEADER_HEIGHT = 72; // px — keep in sync with HalftoneCanvas prop

// ── Rotating circular text badge ──
function RotatingBadge() {
  // radius=44 → circumference = 2*π*44 ≈ 276.5px
  // Text fills exactly using textLength to close the gap
  const R = 44;
  const SIZE = 110;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const circumference = 2 * Math.PI * R; // ~276.5

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
          <defs>
            {/* Full circle path: starts at leftmost point, goes clockwise */}
            <path
              id="badge-ring"
              d={`M ${CX},${CY} m -${R},0 a ${R},${R} 0 1,1 ${R * 2},0 a ${R},${R} 0 1,1 -${R * 2},0`}
            />
          </defs>
          {/* textLength forces text to fill the full circumference — no gap */}
          <text
            fill="rgba(255,255,255,0.5)"
            fontSize="8.5"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="700"
            style={{ textTransform: 'uppercase' }}
          >
            <textPath
              href="#badge-ring"
              textLength={circumference.toFixed(1)}
              lengthAdjust="spacing"
            >
              AUTONOMOUS · INTELLIGENCE · AUTONOMOUS · INTELLIGENCE ·
            </textPath>
          </text>
        </svg>
      </motion.div>
      {/* Reticle icon — increased size */}
      <svg width="32" height="32" viewBox="0 0 26 26" fill="none" className="relative z-10">
        <circle cx="13" cy="13" r="10.5" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />
        <circle cx="13" cy="13" r="5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
        <circle cx="13" cy="13" r="1.5" fill="rgba(255,255,255,0.9)" />
        <line x1="13" y1="2" x2="13" y2="7.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <line x1="13" y1="18.5" x2="13" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <line x1="2" y1="13" x2="7.5" y2="13" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        <line x1="18.5" y1="13" x2="24" y2="13" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

// ── Blueprint corner mark ──
function CornerMark({ pos, label }: { pos: string; label: string }) {
  return (
    <div className={`absolute ${pos} flex items-center gap-1 pointer-events-none z-10`}>
      <span className="text-white/18 font-mono text-[8px]">+</span>
      <span className="text-white/10 font-mono text-[7px] tracking-widest hidden md:inline">{label}</span>
    </div>
  );
}

export default function SpaceHorizonHero() {
  const [ready, setReady] = useState(false);
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date().toISOString().split('T')[1].replace('Z', '');
      setTime(now);
      requestAnimationFrame(updateTime);
    };
    const frame = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-[#060608] flex flex-col overflow-hidden select-none"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      {/* ═══════════════════════════════════════
          DECENTRALIZED HUD INTERFACE (Unique Style)
      ═══════════════════════════════════════ */}
      <div className="absolute top-10 left-0 right-0 z-50 pointer-events-none flex justify-center">
        {/* CENTERED VERTICAL HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
          className="pointer-events-auto flex flex-col items-center bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-all duration-500 hover:border-white/20 min-w-[300px]"
        >
          {/* LOGO SECTION */}
          <button
            onClick={() => lenis?.scrollTo(0)}
            className="flex items-center gap-4 py-2 transition-all hover:opacity-80"
            suppressHydrationWarning
          >
            <img
              src="/image/CA_logo-PNG.png"
              alt="Logo"
              className="w-10 h-10 object-contain brightness-0 invert flex-shrink-0"
            />
            <div className="flex flex-col items-center leading-[0.85] gap-0">
              <span className="text-[9px] font-medium text-white/40 uppercase tracking-[0.3em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>COMMERCE</span>
              <span className="text-[20px] font-black text-white uppercase tracking-[0.02em] mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AGENTS</span>
            </div>
          </button>

          {/* THE UNDERLINE */}
          <div className="w-[180px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-5 mb-5" />

          {/* MENU / NAV LINKS AREA */}
          <div className="relative flex flex-col items-center min-h-[40px] justify-center">
            <AnimatePresence mode="wait">
              {!isMenuOpen ? (
                <motion.div
                  key="menu-label"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center"
                >
                  <span 
                    className="text-[10px] font-bold text-white/25 uppercase tracking-[0.6em]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    MENU
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="nav-links"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-row items-center gap-6 whitespace-nowrap"
                >
                  {NAV_LINKS.map((link, i) => (
                    <motion.button
                      key={link.label}
                      onClick={() => {
                        lenis?.scrollTo(link.href);
                      }}
                      className="group/item relative py-2"
                    >
                      <span className="relative inline-block overflow-hidden px-4 py-1.5 rounded-sm">
                        <motion.div
                          initial={{ y: "-100%" }}
                          whileHover={{ y: "0%" }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 bg-white"
                        />
                        <span className="relative z-10 text-[10px] font-bold text-white/40 group-hover/item:text-black transition-colors duration-300 uppercase tracking-[0.4em] whitespace-nowrap" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {link.label}
                        </span>
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>



      {/* ═══════════════════════════════════════
          HALFTONE CANVAS (hands start below header)
      ═══════════════════════════════════════ */}
      <HalftoneCanvas
        onTitleReady={() => setReady(true)}
        headerHeight={HEADER_HEIGHT}
      />

      {/* Blueprint corner markers */}
      <CornerMark pos="top-[62px] left-4" label="X:0000 Y:0000" />
      <CornerMark pos="bottom-4 left-4"  label="X:0000 Y:1080" />
      <CornerMark pos="bottom-4 right-4" label="X:1920 Y:1080" />

      {/* Thin side lines */}
      <div className="absolute top-[54px] bottom-0 left-0 w-[1px] bg-gradient-to-b from-white/6 via-transparent to-transparent pointer-events-none z-10" />
      <div className="absolute top-[54px] bottom-0 right-0 w-[1px] bg-gradient-to-b from-white/6 via-transparent to-transparent pointer-events-none z-10" />

      {/* ═══════════════════════════════════════
          NEW REFINED UI ELEMENTS (Inspired by References)
      ═══════════════════════════════════════ */}

      {/* BLUEPRINT GRID BACKGROUND */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* BLUEPRINT DRAFTING MARKS (+) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        {[...Array(24)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-[10px] text-white/40 font-thin select-none pointer-events-none"
            style={{
              left: `${(i % 6) * 20 + 2}%`,
              top: `${Math.floor(i / 6) * 25 + 5}%`,
            }}
          >
            +
          </div>
        ))}
      </div>

      {/* DRAFTING ARCS (Construction Lines around Star) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-10">
        <div className="relative w-[480px] h-[480px] border border-white rounded-full translate-y-[36px]" />
        <div className="absolute w-[680px] h-[680px] border border-dashed border-white/50 rounded-full translate-y-[36px]" />
        <div className="absolute w-[880px] h-[880px] border border-white/20 rounded-full translate-y-[36px]" />
      </div>



      {/* ═══════════════════════════════════════
          TITLE (Bottom Left) — Clean & Sharp
      ═══════════════════════════════════════ */}
      <div className="absolute bottom-16 left-10 md:left-14 z-30 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(32px, 5.5vw, 72px)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              lineHeight: '0.95',
              color: '#FFFFFF',
              textShadow: '0 0 40px rgba(255,255,255,0.1)',
            } as React.CSSProperties}
          >
            NEURAL<br />COMMERCE SYSTEMS
          </h1>
          
          <div className="mt-6 flex items-center gap-6">
            <div className="w-12 h-[1px] bg-white/40" />
            <p className="text-white/40 text-[10px] md:text-[11px] tracking-[0.45em] uppercase font-mono">
              Autonomous Intelligence Protocol
            </p>
          </div>
        </motion.div>
      </div>


    </section>
  );
}
