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
      className="relative w-full bg-[#050508] py-24 md:py-32 lg:py-48 px-6 overflow-hidden border-t border-white/5"
    >
      
      {/* CENTRAL ATMOSPHERIC GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/[0.02] blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        
        {/* SECTION IDENTITY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="mb-16 md:mb-24"
        >
          <span className="inline-block text-white/40 text-[10px] font-bold tracking-[0.6em] uppercase mb-4">Voice of the Network</span>
          <h2 
            className="text-4xl md:text-5xl font-bold text-white/20"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Testimonials.
          </h2>
        </motion.div>

        {/* THE CONTENT STAGE */}
        <div className="relative min-h-[450px] md:min-h-[350px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center"
            >
              {/* QUOTE ICON */}
              <div className="text-white/10 text-7xl md:text-8xl mb-12 font-serif select-none">
                &ldquo;
              </div>

              <p className="text-white text-2xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight max-w-5xl mb-16">
                {testimonials[index].content}
              </p>
              
              <div className="flex flex-col items-center gap-6">
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="text-center">
                  <h4 className="text-white text-xl md:text-2xl font-bold" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    {testimonials[index].author}
                  </h4>
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] mt-3">
                    {testimonials[index].role} — {testimonials[index].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CENTRIC INDICATORS */}
        <div className="flex justify-center gap-6 mt-24">
          {testimonials.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setIndex(idx)}
              className={`h-[1px] transition-all duration-700 ${idx === index ? 'w-16 bg-white' : 'w-8 bg-white/10'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
