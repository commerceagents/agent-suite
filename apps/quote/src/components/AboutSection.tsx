'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AboutSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms for background elements
  const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#050508] overflow-hidden py-24 md:py-32 lg:py-48 px-6 md:px-12 lg:px-24 scroll-mt-24"
    >
      
      {/* ── PARALLAX BACKGROUND DECORATION ── */}
      <motion.div 
        style={{ y: bgY1 }}
        className="absolute top-0 left-[10%] w-[60%] h-[60%] bg-violet-600/5 blur-[140px] rounded-full pointer-events-none" 
      />
      <motion.div 
        style={{ y: bgY2 }}
        className="absolute bottom-0 right-[10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" 
      />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* ── SECTION HEADER (Fade + Up) ── */}
        <div className="mb-32 md:mb-48">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block text-white/40 text-[12px] font-bold tracking-[0.4em] uppercase mb-6"
          >
            Our Identity
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] max-w-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            About us
          </motion.h2>
        </div>

        {/* ── STORY BLOCK 1: THE ORIGIN (Image Slide Left, Text Reveal Right) ── */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-48 lg:mb-64">
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 aspect-[4/3] rounded-[40px] overflow-hidden border border-white/5 relative group"
          >
            <img 
              src="/architectural_minimalist_branding_hq_1777017235727.png" 
              alt="Architectural Vision" 
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-60" />
          </motion.div>

          <div className="w-full lg:w-1/2">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white text-3xl md:text-4xl font-bold mb-8 tracking-tight"
            >
              The Architectural Blueprint
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white/50 text-lg md:text-xl leading-relaxed font-light mb-10"
            >
              Commerce Agents was founded on the intersection of structural precision and digital innovation. We view every project as a unique ecosystem, requiring a perfect balance of aesthetic form and technical functionality.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center gap-6"
            >
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Established 2024</span>
            </motion.div>
          </div>
        </div>

        {/* ── STORY BLOCK 2: THE VISION (Staggered Cards with Fade + Up) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {[
            {
              title: "Our Vision",
              desc: "To redefine the architectural landscape of modern commerce by weaving cutting-edge AI orchestration into the very fabric of brand experience.",
              icon: "✦"
            },
            {
              title: "Our Mission",
              desc: "Providing visionary leaders with the tools and blueprints necessary to navigate the complexities of a hyper-connected global marketplace.",
              icon: "✧"
            }
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 + (idx * 0.2) }}
              className="p-12 md:p-16 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="text-white/80 text-4xl mb-10">{item.icon}</div>
              <h4 className="text-white text-2xl md:text-3xl font-bold mb-6">{item.title}</h4>
              <p className="text-white/40 text-lg leading-relaxed font-light">{item.desc}</p>
              
              {/* Subtle Corner Accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* ── FOOTER STATS (Reveal + Up) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-48 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <div className="flex flex-col gap-2">
            <p className="text-white/20 text-xs tracking-[0.5em] uppercase">Global Recognition</p>
            <p className="text-white/60 text-lg font-light">"Redefining the digital horizon."</p>
          </div>
          
          <div className="flex gap-16 md:gap-24">
            {[
              { label: "Projects", val: "120+" },
              { label: "Markets", val: "15+" },
              { label: "Accuracy", val: "99.9%" }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-white text-3xl font-bold mb-2">{stat.val}</div>
                <div className="text-white/20 text-[10px] uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
