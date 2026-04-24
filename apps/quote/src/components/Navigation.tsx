'use client';
 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
 
const navLinks = [
  { name: 'About us', href: '#', active: false },
  { 
    name: 'Projects', 
    href: '#', 
    active: true,
    dropdown: [
      { name: 'Architecture', href: '#' },
      { name: 'Interior Design', href: '#' },
      { name: 'Urban Planning', href: '#' },
      { name: 'Digital Art', href: '#' },
    ]
  },
  { name: 'People', href: '#', active: false },
  { name: 'Testimonial', href: '#', active: false },
];
 
export default function Navigation({ show = true, delay = 0 }) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: delay,
      }
    }
  };
 
  const item = {
    hidden: { opacity: 0, y: -30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };
 
  return (
    <motion.nav 
      variants={container}
      initial="hidden"
      animate={show ? "show" : "hidden"}
      className="relative flex justify-center items-center w-full mb-8 z-50"
    >
      
      {/* 1. LOGO SECTION with Dropdown */}
      <motion.div 
        variants={item} 
        className="absolute left-0 md:left-4 lg:left-8 flex items-center h-full group"
        onMouseEnter={() => setHoveredSection('logo')}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <div className="relative cursor-pointer py-4">
          <img
            src="/image/CA_logo-PNG.png"
            alt="Commerce Agents Logo"
            className="w-[40px] md:w-[50px] lg:w-[55px] h-auto object-contain group-hover:scale-105 transition-transform"
          />
          
        </div>
      </motion.div>
 
      {/* 2. HEADER LINKS with Dropdowns */}
      <div className="flex items-center gap-1 px-4 py-5">
        {navLinks.map((link) => (
          <motion.div 
            variants={item} 
            key={link.name} 
            className="relative px-3 group"
            onMouseEnter={() => setHoveredSection(link.name)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <a 
              href={link.href}
              className={`text-[13px] font-medium tracking-wide transition-colors duration-300 select-none cursor-pointer ${
                link.active ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link.name}
            </a>
            
            {/* Active Highlight */}
            {link.active && (
              <motion.div 
                layoutId="activeNav"
                className="absolute -bottom-1 left-3 right-3 h-[1.5px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
 
            {/* Hover Underline */}
            {!link.active && (
              <div className="absolute -bottom-1 left-3 right-3 h-[1.5px] bg-white/0 group-hover:bg-white/10 transition-colors" />
            )}

            <AnimatePresence>
              {link.dropdown && hoveredSection === link.name && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 pt-4"
                >
                  <div className="w-48 py-2 bg-[#0A0A0F]/80 backdrop-blur-[12px] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    {link.dropdown.map((subItem, idx) => (
                      <motion.a
                        key={subItem.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        href={subItem.href}
                        className="block px-5 py-2.5 text-[12px] text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      >
                        {subItem.name}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
 
      {/* 3. CONTACT US SECTION with Dropdown */}
      <motion.div 
        variants={item} 
        className="absolute right-0 md:right-4 lg:right-8 flex items-center h-full group"
        onMouseEnter={() => setHoveredSection('contact')}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <div className="relative py-4">
          <button 
            className="bg-white text-black px-4 py-1.5 text-[12px] font-bold tracking-wide hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Contact us
          </button>
          
        </div>
      </motion.div>
    </motion.nav>
  );
}
