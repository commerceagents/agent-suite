'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    content: "Commerce Agents transformed our global distribution network with an AI orchestration that feels like a masterpiece.",
    author: "Alexander Wright",
    role: "CEO, Nexa Logistics",
    initialPos: { x: "10%", y: "20%" },
    animate: { 
      x: ["10%", "15%", "10%"],
      y: ["20%", "25%", "20%"]
    },
    duration: 15
  },
  {
    content: "The level of technical precision and aesthetic form is unmatched. They build digital legacies.",
    author: "Sophia Moretti",
    role: "Design Director, Veloce Luxury",
    initialPos: { x: "50%", y: "40%" },
    animate: { 
      x: ["50%", "45%", "50%"],
      y: ["40%", "45%", "40%"]
    },
    duration: 18
  },
  {
    content: "Navigating complexities required a visionary partner. The neural strategy became our most valuable asset.",
    author: "David Chen",
    role: "COO, Prime Solutions",
    initialPos: { x: "20%", y: "60%" },
    animate: { 
      x: ["20%", "25%", "20%"],
      y: ["60%", "55%", "60%"]
    },
    duration: 20
  }
];

export default function TestimonialSection() {
  return (
    <section 
      id="testimonial" 
      className="relative w-full h-screen bg-[#050508] overflow-hidden border-t border-white/5 cursor-none"
    >
      
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />

      {/* SECTION IDENTITY ANCHOR */}
      <div className="absolute top-24 left-12 md:left-24 z-0 pointer-events-none">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="inline-block text-white/20 text-[10px] font-bold tracking-[1em] uppercase mb-4"
        >
          Trust Nexus
        </motion.span>
        <h2 
          className="text-8xl md:text-[12rem] font-bold text-white/[0.02] leading-none"
          style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        >
          Voices.
        </h2>
      </div>

      {/* NEURAL NEBULA NODES */}
      <div className="relative w-full h-full">
        {testimonials.map((node, idx) => (
          <motion.div
            key={node.author}
            initial={{ opacity: 0, scale: 0.8, x: node.initialPos.x, y: node.initialPos.y }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: node.animate.x,
              y: node.animate.y
            }}
            transition={{ 
              opacity: { duration: 2 },
              scale: { duration: 2 },
              x: { duration: node.duration, repeat: Infinity, ease: "linear" },
              y: { duration: node.duration, repeat: Infinity, ease: "linear" }
            }}
            whileHover={{ scale: 1.1, zIndex: 50 }}
            className="absolute w-[300px] md:w-[450px] p-8 md:p-12 rounded-[50px] bg-white/[0.03] backdrop-blur-3xl border border-white/5 group hover:bg-white/[0.08] hover:border-white/20 transition-colors duration-700 pointer-events-auto"
          >
            {/* Internal Node Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-10 mb-8 group-hover:opacity-30 transition-opacity">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5M13 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5" />
            </svg>

            <p className="text-white text-lg md:text-xl font-light leading-relaxed mb-10">
              "{node.content}"
            </p>

            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 bg-white/20" />
              <div>
                <h4 className="text-white text-sm font-bold uppercase tracking-widest">{node.author}</h4>
                <p className="text-white/30 text-[8px] uppercase tracking-[0.4em] mt-1">{node.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
