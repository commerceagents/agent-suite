'use client';

import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    title: "AI Orchestration",
    desc: "Seamlessly weaving artificial intelligence into the structural fabric of your commerce operations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v8"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h8"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 22v-8"/><path d="m19.07 19.07-2.83-2.83"/><path d="M22 12h-8"/><path d="m19.07 4.93-2.83 2.83"/>
      </svg>
    )
  },
  {
    title: "Architectural Identity",
    desc: "Crafting iconic brand horizons that translate complex visionary goals into structural reality.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h0"/><path d="M9 12h0"/><path d="M9 15h0"/><path d="M9 18h0"/>
      </svg>
    )
  },
  {
    title: "Global Connectivity",
    desc: "Synchronizing your commercial nodes across the international digital marketplace with zero friction.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    )
  },
  {
    title: "Neural Strategy",
    desc: "Data-driven decision frameworks that empower leaders to navigate the hyper-connected future.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .47 4.96 2.5 2.5 0 0 0 3 1.98 2.5 2.5 0 0 0 4.96-.47 2.5 2.5 0 0 0 1.97-3 2.5 2.5 0 0 0-.47-4.96 2.5 2.5 0 0 0-3-1.97Z"/><path d="M9 11.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5"/><path d="M12 11.5V17"/>
      </svg>
    )
  }
];

export default function ServicesSection() {
  return (
    <section 
      id="services" 
      className="relative w-full bg-[#050508] py-8 md:py-12 lg:py-16 px-6 md:px-12 lg:px-24 overflow-hidden border-y border-white/5"
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
            className="inline-block text-[10px] font-bold tracking-[0.6em] uppercase mb-4"
          >
            Capabilities
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Services.
          </motion.h2>
        </div>

        {/* GLOWING SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-stretch">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ y: -12 }}
              className="relative group p-8 md:p-10 rounded-[40px] bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all duration-500 backdrop-blur-3xl flex flex-col justify-start min-h-[320px] h-full overflow-hidden"
            >
              {/* INTERNAL GLOWS (Matching About Us style) */}
              <div className={`absolute -bottom-10 -right-10 w-48 h-48 blur-[80px] rounded-full transition-opacity duration-1000 ${
                idx % 3 === 0 ? 'bg-blue-500/20' : idx % 3 === 1 ? 'bg-cyan-500/20' : 'bg-purple-500/20'
              }`} />
              <div className={`absolute -top-10 -left-10 w-32 h-32 blur-[60px] rounded-full opacity-60 transition-opacity duration-1000 ${
                idx % 3 === 0 ? 'bg-indigo-500/10' : idx % 3 === 1 ? 'bg-blue-500/10' : 'bg-cyan-500/10'
              }`} />

              <div className="relative z-10 space-y-6">
                <motion.div 
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: '#FFFFFF', 
                    color: '#000000', 
                    boxShadow: "0 0 30px rgba(255,255,255,0.3)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white transition-all duration-500 cursor-pointer group/icon shadow-inner"
                >
                  <div className="group-hover/icon:text-black transition-colors">
                    {service.icon}
                  </div>
                </motion.div>
                
                <h3 className="text-white text-xl md:text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {service.title}
                </h3>
                
                <p className="text-white/40 text-sm leading-relaxed font-light">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
