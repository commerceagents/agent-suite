'use client';

import React from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'About us', href: '#', active: false },
  { name: 'Projects', href: '#', active: true },
  { name: 'People', href: '#', active: false },
  { name: 'Testimonial', href: '#', active: false },
];

export default function Navigation() {
  return (
    <nav className="relative flex justify-center items-center w-full mb-8 z-50">
      
      {/* Brand Logo - Aligned far left, vertically centered with header */}
      <div className="absolute left-0 md:left-4 lg:left-8 flex items-center h-full">
        <motion.img
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          src="/ca-logo.png"
          alt="Commerce Agents Logo"
          className="w-[50px] md:w-[60px] lg:w-[70px] h-auto object-contain mix-blend-screen contrast-125 brightness-110"
        />
      </div>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 px-8 py-3"
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

      {/* Contact Us Button - Aligned far right */}
      <div className="absolute right-0 md:right-4 lg:right-8 flex items-center h-full">
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white text-black px-6 py-2.5 text-sm font-bold tracking-wide hover:bg-gray-200 transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Contact us
        </motion.button>
      </div>
    </nav>
  );
}
