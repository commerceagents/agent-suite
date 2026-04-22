'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
 
export default function SpaceHorizonHero() {
  return (
    <section className="relative h-[100dvh] w-full bg-black overflow-hidden font-sans select-none">
      
      {/* 1) INITIAL BLANK SCREEN OVERLAY (0.5s) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "linear" }}
        className="absolute inset-0 z-[100] bg-black pointer-events-none"
      />

      {/* MAIN CONTAINER */}
      <div className="relative h-full w-full">
        
        {/* 2) BACKGROUND VIDEO (Fade in 1s starting at 0.5s) */}
        <div className="absolute inset-0 z-0 bg-black">
          <motion.video 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            src="/video-7.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-5" />
        </div>

        {/* UI LAYER */}
        <div className="relative z-20 h-full w-full flex flex-col">
          
          {/* 5) HEADER ITEMS (Staggered reveal starting at 2.9s) */}
          <div className="w-full px-[4vw] pt-[2vh] mb-[1vh]">
            <Navigation show={true} delay={2.9} />
          </div>

          <div className="flex-1 flex items-center justify-center p-[2vw] pb-[4vh]">
            {/* 3) GLASS CARD (Fade + translateY starting at 1.5s) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
              className="relative w-[92vw] max-w-[1700px] min-h-[40vh] h-[75vh] md:h-[80vh] p-6 md:p-12 lg:p-20 rounded-[30px] md:rounded-[60px] overflow-hidden border border-white/10 bg-[#0A0A0F]/20 backdrop-blur-[6px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] ring-1 ring-white/10 flex items-center justify-center transform-gpu"
              style={{ 
                isolation: 'isolate',
                willChange: 'transform, opacity',
              }}
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }} />

              <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[50%] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-violet-600/10 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)] pointer-events-none" />

              {/* 4) TEXT ANIMATION (Scale 1.2 -> 1 starting at 2.3s) */}
              <motion.h1
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 2.3, ease: "easeOut" }}
                className="relative z-10 text-white font-bold tracking-[0.4em] md:tracking-[0.5em] leading-tight uppercase select-none text-center max-w-full break-words"
                style={{ 
                  fontFamily: "'Inter', 'SF Pro Display', sans-serif",
                  fontSize: "clamp(20px, 4.5vw, 52px)",
                  textShadow: "0 0 20px rgba(255,255,255,0.1)"
                }}
              >
                COMMERCE AGENTS
              </motion.h1>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}

