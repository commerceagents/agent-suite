'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    content: "Commerce Agents transformed our global distribution network with an AI orchestration that feels more like an architectural masterpiece than a piece of software.",
    author: "Alexander Wright",
    role: "CEO, Nexa Logistics",
    company: "London, UK"
  },
  {
    content: "The level of technical precision and aesthetic form they bring to digital brand identity is unmatched. They don't just build websites; they build digital legacies.",
    author: "Sophia Moretti",
    role: "Design Director, Veloce Luxury",
    company: "Milan, Italy"
  },
  {
    content: "Navigating the complexities of modern commerce required a visionary partner. The neural strategy provided by the team became our most valuable asset.",
    author: "David Chen",
    role: "COO, Prime Solutions",
    company: "Singapore"
  }
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      id="testimonial" 
      className="relative min-h-[70vh] w-full bg-[#050508] py-24 md:py-32 lg:py-48 px-6 md:px-12 lg:px-24 flex items-center overflow-hidden border-t border-white/5"
    >
      
      {/* ATMOSPHERIC GLOWS */}
      <div className="absolute top-0 left-1/4 w-[40%] h-[40%] bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-white/40 text-[10px] font-bold tracking-[0.6em] uppercase mb-4"
          >
            Voice of the Network
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Testimonials.
          </motion.h2>
        </div>

        {/* SLIDER STAGE */}
        <div className="relative h-[400px] md:h-[300px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl"
            >
              <p className="text-white text-2xl md:text-4xl lg:text-5xl font-light leading-tight mb-12">
                "{testimonials[index].content}"
              </p>
              
              <div className="flex items-center gap-6">
                <div className="h-[1px] w-12 bg-white/20" />
                <div>
                  <h4 className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    {testimonials[index].author}
                  </h4>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                    {testimonials[index].role} — {testimonials[index].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* SLIDER INDICATORS */}
          <div className="absolute bottom-0 left-0 flex gap-4">
            {testimonials.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1 transition-all duration-700 ${idx === index ? 'w-12 bg-white' : 'w-4 bg-white/10'}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
