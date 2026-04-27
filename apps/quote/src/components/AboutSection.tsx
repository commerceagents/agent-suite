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
      className="relative w-full bg-[#050508] py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-24 overflow-hidden border-y border-white/5"
      style={{ position: 'relative' }}
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            className="inline-block text-[12px] font-bold tracking-[0.4em] uppercase mb-4"
          >
            Our Identity
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            About us.
          </motion.h2>
        </div>

        {/* ── HIGH-END GLOWING GLASS GRID (Single Horizontal Line) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* CARD 1: VISION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative group overflow-hidden rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-10 flex flex-col justify-start min-h-[320px] h-full"
          >
            {/* INTERNAL GLOWS */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full transition-all duration-1000" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/10 blur-[80px] rounded-full transition-all duration-1000" />
            
            <div className="relative z-10 space-y-6">
              <motion.div 
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: '#FFFFFF', 
                  color: '#000000', 
                  boxShadow: "0 0 30px rgba(255,255,255,0.3)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-10 shadow-inner text-white transition-all duration-500 cursor-pointer group/icon"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/icon:stroke-black transition-colors"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
              </motion.div>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-6 leading-tight tracking-tight">
                Build workflows <br/> that work for you
              </h3>
              <p className="text-white/40 text-base md:text-lg font-light leading-relaxed mb-10">
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
            className="relative group overflow-hidden rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-10 flex flex-col justify-start min-h-[320px] h-full"
          >
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-cyan-600/10 blur-[80px] rounded-full transition-all duration-1000" />
            
            <div className="relative z-10 space-y-6">
              <motion.div 
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: '#FFFFFF', 
                  color: '#000000', 
                  boxShadow: "0 0 30px rgba(255,255,255,0.3)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-10 shadow-inner text-white transition-all duration-500 cursor-pointer group/icon"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/icon:stroke-black transition-colors"><path d="M12 2v20"/><path d="m17 7-5-5-5 5"/><path d="m17 17-5 5-5-5"/></svg>
              </motion.div>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-6 leading-tight tracking-tight">
                Integrate with <br/> anything
              </h3>
              <p className="text-white/40 text-base md:text-lg font-light leading-relaxed mb-10">
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
            className="relative group overflow-hidden rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-10 flex flex-col justify-start min-h-[320px] h-full"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <motion.div 
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: '#FFFFFF', 
                  color: '#000000', 
                  boxShadow: "0 0 30px rgba(255,255,255,0.3)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-10 shadow-inner text-white transition-all duration-500 cursor-pointer group/icon"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/icon:stroke-black transition-colors"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </motion.div>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-6 leading-tight tracking-tight">
                Automate the <br/> boring stuff
              </h3>
              <p className="text-white/40 text-base md:text-lg font-light leading-relaxed mb-10">
                Streamlining complex operational workflows with intelligent automated protocols.
              </p>
            </div>


          </motion.div>

        </div>

      </div>
    </section>
  );
}
