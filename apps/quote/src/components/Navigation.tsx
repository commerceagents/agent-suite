'use client';
 
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useLenis } from 'lenis/react';
import LiquidGlassButton from './LiquidGlassButton';
 
const navItems = [
  { name: 'About us', href: '#about' },
  { name: 'Service', href: '#services' },
  { name: 'Project', href: '#projects' },
  { name: 'Contact us', href: '#contact' },
];
 
export default function Navigation({ show = true, delay = 0 }) {
  const [mounted, setMounted] = React.useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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
        setActiveSection('Project');
      } else if (scrollPos > windowHeight * 1.6) {
        setActiveSection('Service');
      } else if (scrollPos > windowHeight * 0.6) {
        setActiveSection('About us');
      } else {
        setActiveSection(null);
      }
    };
 
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: delay,
      }
    }
  };
 
  const item: Variants = {
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

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const menuItemVariants: Variants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 }
  };
 
  return (
    <>
      <motion.nav 
        variants={container}
        initial="hidden"
        animate={show ? "show" : "hidden"}
        className="fixed top-0 left-0 w-full z-50 flex justify-center items-center px-6 py-8"
      >
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8 backdrop-blur-2xl border border-white/10 rounded-2xl pl-3 md:pl-5 pr-3 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(0,242,255,0.08) 50%, rgba(59,130,246,0.03) 100%)',
          }}
        >
          {/* LOGO SECTION */}
          <motion.div 
            variants={item} 
            className="flex items-center group -ml-1 md:-ml-2 pr-2 md:pr-4"
          >
            <div className="relative cursor-pointer py-1" onClick={() => lenis?.scrollTo(0)}>
                <img
                  src="/image/CA_logo-PNG.png"
                  alt="Commerce Agents Logo"
                  className="w-[38px] md:w-[48px] lg:w-[54px] h-auto object-contain group-hover:scale-105 transition-transform"
                />
            </div>
          </motion.div>

          {/* HEADER LINKS & FLOATING PILL */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((link) => {
              const isValidSection = activeSection && navItems.some(i => i.name === activeSection);
              const isActive = activeSection === link.name || (!isValidSection && link.name === 'Contact us');

              return (
                <motion.div 
                  key={link.name}
                  variants={item} 
                  className={`relative py-1.5 lg:py-2 group cursor-pointer ${link.name === 'Contact us' ? 'px-4 lg:px-6 ml-6 md:ml-12 lg:ml-16' : 'px-2 lg:px-3'}`}
                  onMouseEnter={() => setHoveredSection(link.name)}
                  onMouseLeave={() => setHoveredSection(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    lenis?.scrollTo(link.href);
                    setActiveSection(link.name);
                  }}
                >
                  {/* Floating Pill Background */}
                  {isActive && (
                    <motion.div 
                      layoutId="navPillBackground"
                      className="absolute inset-0 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-none"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      style={{ zIndex: 0 }}
                    >
                      {/* Glass Base Layer */}
                      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl" />
                      
                      {/* Hover Gradients mimicking LiquidGlassButton */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#3b82f6] transition-opacity duration-500 ${hoveredSection === link.name ? 'opacity-100' : 'opacity-0'}`} />
                      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,242,255,0.4),transparent_70%)] transition-opacity duration-700 ${hoveredSection === link.name ? 'opacity-100' : 'opacity-0'}`} />
                      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.6),transparent_60%)] transition-opacity duration-700 ${hoveredSection === link.name ? 'opacity-100' : 'opacity-0'}`} />
                      
                      {/* Edge Glow */}
                      <div className={`absolute inset-0 rounded-xl border border-white/40 transition-opacity duration-500 pointer-events-none ${hoveredSection === link.name ? 'opacity-100' : 'opacity-0'}`} />

                      {/* Subtle Refraction Lines */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
                    </motion.div>
                  )}

                  <a 
                    href={link.href}
                    suppressHydrationWarning
                    className={`relative z-10 text-[13px] lg:text-[14px] font-medium tracking-wide transition-colors duration-300 select-none ${
                      isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
                    }`}
                    style={{ 
                      fontFamily: "var(--font-montserrat), sans-serif",
                      textShadow: isActive ? "0 2px 4px rgba(0,0,0,0.3)" : "none"
                    }}
                  >
                    {link.name}
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* MOBILE HAMBURGER ICON */}
          <motion.div
            variants={item}
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-8 h-8 flex flex-col items-center justify-center gap-1 cursor-pointer">
              <motion.div 
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white rounded-full" 
              />
              <motion.div 
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-white rounded-full" 
              />
              <motion.div 
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white rounded-full" 
              />
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* MOBILE FULLSCREEN MENU */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center p-10"
      >
        <div className="flex flex-col items-center gap-8">
          {navItems.map((link) => (
            <motion.a
              key={link.name}
              variants={menuItemVariants}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                lenis?.scrollTo(link.href);
                setIsOpen(false);
              }}
              className="text-4xl font-bold text-white tracking-tighter uppercase"
              style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {link.name}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </>
  );
}
