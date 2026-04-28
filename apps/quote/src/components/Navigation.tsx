'use client';
 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
 
const navLinks = [
  { name: 'About us', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projects', href: '#projects' },
  { name: 'People', href: '#people' },
  { name: 'Testimonial', href: '#testimonial' },
];
 
export default function Navigation({ show = true, delay = 0 }) {
  const [mounted, setMounted] = React.useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const lenis = useLenis();

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (scrollPos > windowHeight * 5.4) {
        setActiveSection('Testimonial');
      } else if (scrollPos > windowHeight * 4.4) {
        setActiveSection('People');
      } else if (scrollPos > windowHeight * 2.6) {
        setActiveSection('Projects');
      } else if (scrollPos > windowHeight * 1.6) {
        setActiveSection('Services');
      } else if (scrollPos > windowHeight * 0.6) {
        setActiveSection('About us');
      } else {
        setActiveSection(null);
      }
    };
 
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: delay,
      }
    }
  };
 
  const item: any = {
    hidden: { opacity: 0, y: -30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 1
      } 
    }
  };
 
  return (
    <motion.nav 
      variants={container}
      initial="hidden"
      animate={show ? "show" : "hidden"}
      className="relative flex justify-center items-center w-full z-50"
    >
      
      {/* 1. LOGO SECTION */}
      <motion.div 
        variants={item} 
        className="absolute left-0 md:left-4 lg:left-8 flex items-center h-full group"
      >
        <div className="relative cursor-pointer py-2" onClick={() => lenis?.scrollTo(0)}>
            <img
              src="/image/CA_logo-PNG.png"
              alt="Commerce Agents Logo"
              className="w-[50px] md:w-[65px] lg:w-[75px] h-auto object-contain group-hover:scale-105 transition-transform"
            />
        </div>
      </motion.div>
 
      {/* 2. HEADER LINKS */}
      <div className="relative flex items-center gap-4 px-4 py-2">
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
              suppressHydrationWarning
              onClick={(e) => {
                if (link.href.startsWith('#')) {
                  e.preventDefault();
                  lenis?.scrollTo(link.href);
                }
                setActiveSection(link.name);
              }}
              className={`text-[16px] font-medium tracking-wide transition-colors duration-300 select-none cursor-pointer ${
                activeSection === link.name ? 'text-white' : 'text-white/50 hover:text-white'
              }`}
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {link.name}
            </a>
            
            {activeSection === link.name && (
              <motion.div 
                layoutId="activeNav"
                className="absolute -bottom-1 left-3 right-3 h-[1.5px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
 
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
      >
        <div className="relative py-2">
          <button 
            onClick={(e) => {
              e.preventDefault();
              lenis?.scrollTo('#contact');
            }}
            suppressHydrationWarning
            className="bg-white text-black px-7 py-3 text-[14px] font-bold tracking-wide hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Contact us
          </button>
        </div>
      </motion.div>
    </motion.nav>
  );
}
