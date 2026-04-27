'use client';
 
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
 
export default function AboutSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative w-full bg-[#050508] py-[10vw] px-[5vw] overflow-hidden border-y border-white/5"
      style={{ position: 'relative' }}
    >
      <div className="w-full max-w-[1700px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-[6vw]">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            style={{ 
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: 'clamp(8px, 0.8vw, 14px)'
            }}
            className="inline-block font-bold tracking-[0.4em] uppercase mb-[1vw]"
          >
            Our Identity
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            style={{ 
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "clamp(24px, 5.5vw, 100px)"
            }}
          >
            About us.
          </motion.h2>
        </div>

        {/* ── HIGH-END GLOWING GLASS GRID (Single Horizontal Line) ── */}
        <div className="grid grid-cols-3 gap-[3vw] items-stretch">
          
          {/* CARD 1: VISION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative group overflow-hidden rounded-[4vw] bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-[3vw] flex flex-col justify-start h-full"
            style={{ minHeight: "25vw" }}
          >
            {/* INTERNAL GLOWS */}
            <div className="absolute -bottom-[10vw] -left-[10vw] w-[30vw] h-[30vw] bg-blue-600/20 blur-[10vw] rounded-full transition-all duration-1000" />
            <div className="absolute -top-[10vw] -right-[10vw] w-[20vw] h-[20vw] bg-purple-600/10 blur-[8vw] rounded-full transition-all duration-1000" />
            
            <div className="relative z-10 space-y-[2vw]">
              <motion.div 
                whileHover={{ scale: 1.1, backgroundColor: '#FFFFFF', color: '#000000', boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="w-[5vw] h-[5vw] rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-[2vw] shadow-inner text-white transition-all duration-500 cursor-pointer group/icon"
              >
                <svg width="1.5vw" height="1.5vw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/icon:stroke-black transition-colors"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
              </motion.div>
              <h3 className="text-white font-bold leading-tight tracking-tight" style={{ fontSize: "clamp(12px, 2.2vw, 42px)" }}>
                Build workflows <br/> that work for you
              </h3>
              <p className="text-white/40 font-light leading-relaxed" style={{ fontSize: "clamp(8px, 1.1vw, 18px)" }}>
                Create, customize, and launch powerful automations without writing a single line of code.
              </p>
            </div>
          </motion.div>

          {/* CARD 2: INTEGRATE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative group overflow-hidden rounded-[4vw] bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-[3vw] flex flex-col justify-start h-full"
            style={{ minHeight: "25vw" }}
          >
            <div className="absolute -bottom-[10vw] -right-[10vw] w-[25vw] h-[25vw] bg-cyan-600/10 blur-[8vw] rounded-full transition-all duration-1000" />
            
            <div className="relative z-10 space-y-[2vw]">
              <motion.div 
                whileHover={{ scale: 1.1, backgroundColor: '#FFFFFF', color: '#000000', boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="w-[5vw] h-[5vw] rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-[2vw] shadow-inner text-white transition-all duration-500 cursor-pointer group/icon"
              >
                <svg width="1.5vw" height="1.5vw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/icon:stroke-black transition-colors"><path d="M12 2v20"/><path d="m17 7-5-5-5 5"/><path d="m17 17-5 5-5-5"/></svg>
              </motion.div>
              <h3 className="text-white font-bold leading-tight tracking-tight" style={{ fontSize: "clamp(12px, 2.2vw, 42px)" }}>
                Integrate with <br/> anything
              </h3>
              <p className="text-white/40 font-light leading-relaxed" style={{ fontSize: "clamp(8px, 1.1vw, 18px)" }}>
                Connect with over 200+ tools — from Google Workspace to Slack, Notion, and more.
              </p>
            </div>
          </motion.div>

          {/* CARD 3: AUTOMATE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="relative group overflow-hidden rounded-[4vw] bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-[3vw] flex flex-col justify-start h-full"
            style={{ minHeight: "25vw" }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-600/5 blur-[10vw] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-[2vw]">
              <motion.div 
                whileHover={{ scale: 1.1, backgroundColor: '#FFFFFF', color: '#000000', boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="w-[5vw] h-[5vw] rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-[2vw] shadow-inner text-white transition-all duration-500 cursor-pointer group/icon"
              >
                <svg width="1.5vw" height="1.5vw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/icon:stroke-black transition-colors"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </motion.div>
              <h3 className="text-white font-bold leading-tight tracking-tight" style={{ fontSize: "clamp(12px, 2.2vw, 42px)" }}>
                Automate the <br/> boring stuff
              </h3>
              <p className="text-white/40 font-light leading-relaxed" style={{ fontSize: "clamp(8px, 1.1vw, 18px)" }}>
                Streamlining complex operational workflows with intelligent automated protocols.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
