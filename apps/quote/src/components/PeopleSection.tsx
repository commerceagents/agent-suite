'use client';

import React from 'react';
import { motion } from 'framer-motion';

const team = [
  {
    name: 'Elena Vance',
    role: 'Chief Architect',
    bio: 'Pioneering the intersection of structural form and digital identity.',
    image: '/people-1.png',
  },
  {
    name: 'Marcus Thorne',
    role: 'Technical Director',
    bio: 'Orchestrating the future of commerce through advanced AI systems.',
    image: '/people-2.png',
  },
  {
    name: 'Sarah Chen',
    role: 'Design Principal',
    bio: 'Crafting premium brand experiences with high-end minimalism.',
    image: '/people-3.png',
  },
  {
    name: 'Julian Voss',
    role: 'Creative Lead',
    bio: 'Translating complex structural goals into iconic brand identities.',
    image: '/people-4.png',
  },
];

export default function PeopleSection() {
  return (
    <section 
      id="people" 
      className="relative w-full bg-[#050508] py-8 md:py-12 lg:py-16 px-6 md:px-12 lg:px-24 scroll-mt-24 overflow-hidden"
      style={{ position: 'relative' }}
    >
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            className="inline-block text-[12px] font-bold tracking-[0.4em] uppercase mb-4"
          >
            Our Visionaries
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
          >
            People.
          </motion.h2>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group cursor-pointer"
            >
              {/* Portrait Image Container with Cinematic Overlay Style */}
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10 bg-black mb-8 group">
                <motion.img 
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false }}
                  transition={{
                    duration: 1.2,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ease: [0.16, 1, 0.3, 1] as any,
                  }}
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover filter grayscale contrast-[1.2] brightness-[0.9] transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* 1. CINEMATIC COLOR TINT (Blue/Violet/Teal) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020617]/40 via-[#1e1b4b]/20 to-[#134e4a]/20 mix-blend-soft-light opacity-100 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />
                
                {/* 2. FACE HIGHLIGHT / GLOW */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_60%)] pointer-events-none" />

                {/* 3. VIGNETTE & DEPTH */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_120%)] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

                {/* Social Connect (Fade In on Hover) */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 z-20">
                  <motion.div 
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: '#FFFFFF', 
                      color: '#000000', 
                      boxShadow: "0 0 20px rgba(255,255,255,0.3)" 
                    }}
                    whileTap={{ scale: 0.9 }}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    className="w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center text-white/40 border border-white/10 transition-all duration-500"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </motion.div>
                </div>

                {/* Internal Designation Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                  <p className="text-white/80 text-[11px] font-light leading-relaxed">&quot;{member.bio}&quot;</p>
                </div>
              </div>

              {/* External Identity Layer */}
              <div className="px-4">
                <h4 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {member.name}
                </h4>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.4em]">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
