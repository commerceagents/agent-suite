'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const projects = [
  {
    id: '01',
    title: 'THE NEXUS HEADQUARTERS',
    sector: 'Architecture',
    year: '2024',
    impact: 'Net-Zero Emissions',
    image: '/project_alpha_futuristic_hq_1777020684582.png',
  },
  {
    id: '02',
    title: 'CHROME RETAIL FLAGSHIP',
    sector: 'Interior Design',
    year: '2023',
    impact: '240% Growth',
    image: '/project_beta_luxury_retail_1777020707727.png',
  },
];

export default function ProjectsSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="relative h-[300vh] bg-[#050508] scroll-mt-24"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* SECTION TITLE (STATIONARY) */}
        <div className="absolute top-24 left-6 md:left-12 lg:left-24 z-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block text-white/40 text-[12px] font-bold tracking-[0.4em] uppercase mb-4"
          >
            Portfolio
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-400 to-neutral-700"
          >
            Project<span className="text-white/20">s</span>
          </motion.h2>
        </div>

        {/* HORIZONTAL TRACK */}
        <motion.div style={{ x }} className="flex gap-12 px-6 md:px-12 lg:px-24">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="relative flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[60vw] aspect-[16/9] group overflow-hidden rounded-[40px] border border-white/5"
            >
              {/* Project Image */}
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Glass Info Card */}
              <div className="absolute bottom-10 left-10 right-10 p-8 md:p-12 rounded-[30px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 flex flex-col md:flex-row items-end justify-between gap-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                <div className="max-w-md">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-white/40 text-xs font-mono">{project.id}</span>
                    <div className="h-[1px] w-8 bg-white/20" />
                    <span className="text-white/40 text-[10px] uppercase tracking-widest">{project.sector}</span>
                  </div>
                  <h3 className="text-white text-3xl md:text-4xl font-bold mb-4">{project.title}</h3>
                  <p className="text-white/40 text-sm font-light">
                    Redefining the standard of {project.sector.toLowerCase()} through technical excellence and visionary form.
                  </p>
                </div>
                
                <div className="flex gap-10">
                  <div className="text-right">
                    <div className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Impact</div>
                    <div className="text-white font-bold">{project.impact}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Year</div>
                    <div className="text-white font-bold">{project.year}</div>
                  </div>
                </div>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </div>
          ))}
          
          {/* ENDING PLACEHOLDER / NEXT SECTION PREVIEW */}
          <div className="flex-shrink-0 w-[40vw] flex items-center justify-center">
            <div className="h-[1px] w-32 bg-white/10" />
            <span className="text-white/20 text-[10px] uppercase tracking-[0.4em] mx-8">End of Portfolio</span>
            <div className="h-[1px] w-32 bg-white/10" />
          </div>
        </motion.div>

        {/* PROGRESS INDICATOR */}
        <div className="absolute bottom-12 left-6 md:left-12 lg:left-24 flex items-center gap-4">
          <div className="h-[1px] w-48 bg-white/10 overflow-hidden">
            <motion.div 
              style={{ scaleX: scrollYProgress }} 
              className="h-full bg-white origin-left"
            />
          </div>
          <span className="text-white/20 text-[10px] font-mono tracking-widest">PROGRESS</span>
        </div>

      </div>
    </section>
  );
}
