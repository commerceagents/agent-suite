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
      className="relative w-full bg-[#050508] py-24 md:py-32 lg:py-48 px-6 md:px-12 lg:px-24 scroll-mt-24 overflow-hidden"
    >
      
      {/* ATMOSPHERIC DECORATION */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40%] h-[60%] bg-white/[0.02] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="inline-block text-white/40 text-[10px] font-bold tracking-[0.6em] uppercase mb-4"
          >
            Capabilities
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Services.
          </motion.h2>
        </div>

        {/* STAGGERED SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ y: -12 }}
              className="group p-10 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 backdrop-blur-xl flex flex-col justify-between aspect-square"
            >
              <div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-2xl bg-white/[0.05] flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/[0.08] transition-all duration-500 mb-12"
                >
                  {service.icon}
                </motion.div>
                
                <h3 className="text-white text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {service.title}
                </h3>
                
                <p className="text-white/40 text-sm leading-relaxed font-light">
                  {service.desc}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Protocol 0{idx + 1}</span>
                <div className="h-[1px] flex-grow bg-white/20" />
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
