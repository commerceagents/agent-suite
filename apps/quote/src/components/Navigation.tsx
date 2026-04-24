'use client';
 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';
 
const navLinks = [
  { name: 'About us', href: '#about', active: false },
  { 
    name: 'Projects', 
    href: '#projects', 
    active: true,
  },
  { name: 'People', href: '#people', active: false },
  { name: 'Testimonial', href: '#testimonial', active: false },
];
 
export default function Navigation({ show = true, delay = 0 }) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('Projects');
  const lenis = useLenis();

  // HANDLE SCROLL FOR ACTIVE STATE
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // CALIBRATED SCROLL LAYERS
      if (scrollPos > windowHeight * 5.4) {
        setActiveSection('Testimonial');
      } else if (scrollPos > windowHeight * 4.4) {
        setActiveSection('People');
      } else if (scrollPos > windowHeight * 1.6) {
        setActiveSection('Projects');
      } else if (scrollPos > windowHeight * 0.6) {
        setActiveSection('About us');
      } else {
        setActiveSection('Projects');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      
      {/* 1. LOGO SECTION */}
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
 
      {/* 2. HEADER LINKS */}
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
              onClick={(e) => {
                if (link.href.startsWith('#')) {
                  e.preventDefault();
                  lenis?.scrollTo(link.href);
                }
                setActiveSection(link.name);
              }}
              className={`text-[13px] font-medium tracking-wide transition-colors duration-300 select-none cursor-pointer ${
                activeSection === link.name ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link.name}
            </a>
            
            {/* Dynamic Active Highlight (Magnetic Underline) */}
            {activeSection === link.name && (
              <motion.div 
                layoutId="activeNav"
                className="absolute -bottom-1 left-3 right-3 h-[1.5px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
 
            {/* Hover Underline (Hidden when active) */}
            {activeSection !== link.name && (
              <div className="absolute -bottom-1 left-3 right-3 h-[1.5px] bg-white/0 group-hover:bg-white/10 transition-colors" />
            )}

          </motion.div>
        ))}
      </div>
 
      {/* 3. CONTACT US SECTION */}
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
