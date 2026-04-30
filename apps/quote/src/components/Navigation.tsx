'use client';
 
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useLenis } from 'lenis/react';
import LiquidGlassButton from './LiquidGlassButton';
 
const navLinks = [
  { name: 'About us', href: '#about' },
  { name: 'Service', href: '#services' },
  { name: 'Project', href: '#projects' },
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
        <div className="flex items-center gap-6 md:gap-10 lg:gap-12 backdrop-blur-2xl border border-white/10 rounded-2xl pl-3 md:pl-5 pr-5 md:pr-8 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(0,242,255,0.08) 50%, rgba(59,130,246,0.03) 100%)',
          }}
        >
          {/* LOGO SECTION */}
          <motion.div 
            variants={item} 
            className="flex items-center group -ml-1 md:-ml-2"
          >
            <div className="relative cursor-pointer py-1" onClick={() => lenis?.scrollTo(0)}>
                <img
                  src="/image/CA_logo-PNG.png"
                  alt="Commerce Agents Logo"
                  className="w-[38px] md:w-[48px] lg:w-[54px] h-auto object-contain group-hover:scale-105 transition-transform"
                />
            </div>
          </motion.div>

          {/* HEADER LINKS - Reduced gap and padding to tighten spacing */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => (
              <motion.div 
                variants={item} 
                key={link.name} 
                className="relative px-2 group"
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
                  className={`text-[13px] lg:text-[14px] font-medium tracking-wide transition-colors duration-300 select-none cursor-pointer ${
                    activeSection === link.name ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                  style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {link.name}
                </a>
                
                {activeSection === link.name && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-2 right-2 h-[1.5px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* CONTACT US BUTTON */}
          <motion.div 
            variants={item} 
            className="hidden md:flex items-center"
          >
            <LiquidGlassButton 
              label="Contact us"
              onClick={(e) => {
                e.preventDefault();
                lenis?.scrollTo('#contact');
              }}
            />
          </motion.div>

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
          {navLinks.map((link) => (
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
          <motion.div variants={menuItemVariants} className="mt-8">
            <LiquidGlassButton
              label="Contact us"
              onClick={() => {
                lenis?.scrollTo('#contact');
                setIsOpen(false);
              }}
              className="px-10 py-5 text-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
