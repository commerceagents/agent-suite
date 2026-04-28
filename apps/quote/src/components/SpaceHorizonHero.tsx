'use client';
 
import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import Navigation from './Navigation';
 
export default function SpaceHorizonHero() {
  const [isMounted, setIsMounted] = React.useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const backgroundGradient = useMotionTemplate`radial-gradient(circle 400px at ${springX}px ${springY}px, rgba(255,0,128,0.15), transparent 70%)`;

  useEffect(() => {
    setIsMounted(true);
    // Set initial position to center safely after hydration
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative h-[100dvh] w-full bg-[#050816] overflow-hidden font-sans select-none p-4 md:p-6">
      
      {/* 🖱️ INTERACTIVE MOUSE GLOW */}
      {isMounted && (
        <motion.div 
          className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
          style={{
            background: backgroundGradient,
            filter: 'blur(40px)',
          }}
        />
      )}

      {/* STEP 1: SAAS GLOW GRADIENT BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#050816]">
        {/* Central Ambient Purple Glow */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] max-w-[1000px] max-h-[1000px] rounded-full mix-blend-screen pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(128,0,255,0.15) 0%, transparent 70%)' }}
        />
        
        {/* Bottom Right Magenta Glow */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] right-[10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full mix-blend-screen pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,0,128,0.15) 0%, transparent 70%)' }}
        />

        {/* Bottom Left Pink Glow */}
        <motion.div 
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-[15%] left-[10%] w-[40vw] h-[40vw] max-w-[700px] max-h-[700px] rounded-full mix-blend-screen pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,105,180,0.15) 0%, transparent 70%)' }}
        />
      </div>

      {/* NAVIGATION LAYER (Starts 10.5s - Sync with text) */}
      <div className="absolute top-0 left-0 right-0 z-50 pt-6 px-4">
        <Navigation show={true} delay={10.5} />
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
              delay: 9.5, 
              ease: [0.16, 1, 0.3, 1] as any 
            }}
            className="relative w-full min-h-[50vh] h-[75vh] md:h-[80vh] p-6 md:p-12 lg:p-20 rounded-[24px] overflow-hidden border border-white/5 bg-black/40 backdrop-blur-[30px] shadow-[0_30px_80px_rgba(0,0,0,0.6),inset_0_0_80px_rgba(255,255,255,0.02)] flex flex-col items-center justify-center transform-gpu"
            style={{ 
              isolation: 'isolate',
              willChange: 'transform, opacity',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)'
            }}
          >
            {/* 1. SAAS GRADIENT WAVE & PLASMA FLAME */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-end">
              
              {/* Layer 1: Soft Diffused Base Glow */}
              <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#ff007f]/30 to-transparent blur-[40px]" />
              
              {/* Layer 2: Main Gradient Wave (Base) */}
              <motion.div 
                animate={{ opacity: [0.7, 1, 0.7], scaleY: [1, 1.05, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 w-full h-[50%] origin-bottom"
                style={{ 
                  background: 'linear-gradient(to top, rgba(255,0,128,0.4) 0%, rgba(128,0,255,0.15) 60%, transparent 100%)',
                }}
              />

              {/* Layer 3: Soft Vapor / Mist Effect (Full Width Distribution) */}
              
              {/* Vapor A: Soft Mist Left */}
              <motion.div 
                animate={{ y: [0, -150], opacity: [0, 0.8, 0], scale: [1, 1.3] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-40%] left-[-20%] w-[80%] h-[60%]"
                style={{ 
                  background: 'radial-gradient(circle, rgba(255,150,220,0.6) 0%, transparent 60%)',
                  filter: 'blur(20px)' 
                }}
              />
              
              {/* Vapor B: Soft Mist Right */}
              <motion.div 
                animate={{ y: [20, -180], opacity: [0, 0.8, 0], scale: [0.9, 1.4] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
                className="absolute bottom-[-35%] right-[-20%] w-[80%] h-[70%]"
                style={{ 
                  background: 'radial-gradient(circle, rgba(220,100,255,0.5) 0%, transparent 60%)',
                  filter: 'blur(30px)' 
                }}
              />
              
              {/* Vapor C: Background Wide Mist */}
              <motion.div 
                animate={{ y: [10, -200], opacity: [0, 0.6, 0], scale: [1, 1.5] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 10 }}
                className="absolute bottom-[-45%] left-[0%] w-[100%] h-[80%]"
                style={{ 
                  background: 'radial-gradient(circle, rgba(255,100,200,0.4) 0%, transparent 60%)',
                  filter: 'blur(40px)' 
                }}
              />
              
              {/* Layer 4: Clean Base Horizon Light */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff007f] to-transparent opacity-50" />
            </div>

            {/* 2. SUBTLE WHITE PERSPECTIVE GRID */}
            <div 
              className="absolute inset-0 opacity-[0.08] pointer-events-none z-0" 
              style={{ 
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)'
              }} 
            />

            {/* BRAND TEXT */}
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&display=swap');
            `}</style>
            <motion.h1
              initial={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ 
                duration: 2.5, 
                delay: 10.5, 
                ease: [0.16, 1, 0.3, 1] as any 
              }}
              className="relative z-10 text-white/90 font-bold leading-tight uppercase select-none text-center max-w-full break-words tracking-widest"
              style={{ 
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(16px, 3vw, 36px)",
                textShadow: "0 0 20px rgba(0,170,255,0.3)",
                letterSpacing: "0.3em"
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
