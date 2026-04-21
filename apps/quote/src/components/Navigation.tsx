'use client';

import React from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'About us', href: '#', active: false },
  { name: 'Projects', href: '#', active: true },
  { name: 'People', href: '#', active: false },
  { name: 'Testimonial', href: '#', active: false },
  { name: 'Contact us', href: '#', active: false },
];

export default function Navigation() {
  return (
    <nav className="flex justify-center w-full mb-8">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 px-8 py-3 bg-[#1a1a1a]/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl"
      >
        {navLinks.map((link) => (
          <div key={link.name} className="relative px-4 group">
            <a 
              href={link.href}
              className={`text-[14px] font-medium tracking-wide transition-colors duration-300 select-none ${
                link.active ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link.name}
            </a>
            
            {/* Active Highlight (Cyan Underline from screenshot) */}
            {link.active && (
              <motion.div 
                layoutId="activeNav"
                className="absolute -bottom-1 left-4 right-4 h-[2px] bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            {/* Hover Highlight */}
            {!link.active && (
              <div className="absolute -bottom-1 left-4 right-4 h-[2px] bg-white/0 group-hover:bg-white/10 transition-colors" />
            )}
          </div>
        ))}
      </motion.div>
    </nav>
  );
}
