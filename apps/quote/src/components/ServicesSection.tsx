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
      className="relative w-full bg-[#050508] py-[8vw] px-[5vw] overflow-hidden border-y border-white/5"
      style={{ position: 'relative' }}
    >
      
      <div className="w-full max-w-[1700px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-[6vw]">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            style={{ 
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: 'clamp(8px, 0.7vw, 12px)'
            }}
            className="inline-block font-bold tracking-[0.6em] uppercase mb-[1vw]"
          >
            Capabilities
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
            Services.
          </motion.h2>
        </div>

        {/* GLOWING SERVICES GRID - Always 4 columns */}
        <div className="grid grid-cols-4 gap-[2vw] items-stretch">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ y: "-1vw" }}
              className="relative group p-[2.5vw] rounded-[3vw] bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all duration-500 backdrop-blur-3xl flex flex-col justify-start h-full overflow-hidden"
              style={{ minHeight: "22vw" }}
            >
              {/* INTERNAL GLOWS */}
              <div className={`absolute -bottom-[5vw] -right-[5vw] w-[15vw] h-[15vw] blur-[6vw] rounded-full transition-opacity duration-1000 ${
                idx % 3 === 0 ? 'bg-blue-500/20' : idx % 3 === 1 ? 'bg-cyan-500/20' : 'bg-purple-500/20'
              }`} />
              
              <div className="relative z-10 space-y-[1.5vw]">
                <motion.div 
                  whileHover={{ scale: 1.1, backgroundColor: '#FFFFFF', color: '#000000', boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-[4.5vw] h-[4.5vw] rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white transition-all duration-500 cursor-pointer group/icon shadow-inner"
                >
                  <div className="group-hover/icon:text-black transition-colors scale-[0.6] md:scale-100">
                    {service.icon}
                  </div>
                </motion.div>
                
                <h3 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(10px, 1.8vw, 32px)", fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {service.title}
                </h3>
                
                <p className="text-white/40 leading-relaxed font-light" style={{ fontSize: "clamp(8px, 0.9vw, 16px)" }}>
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
