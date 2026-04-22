'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SpaceHorizonCanvas from './SpaceHorizonCanvas';
import Navigation from './Navigation';

export default function SpaceHorizonHero() {
  const [videoSrc] = React.useState("/video-6.mp4");
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            if (hasMounted.current) {
              // Restart video perfectly when user scrolls back to Hero
              videoRef.current.currentTime = 0;
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(e => {
                  if (e.name !== 'AbortError') console.warn(e);
                });
              }
            } else {
              hasMounted.current = true;
            }
          } else if (!entry.isIntersecting && videoRef.current) {
            // Pause video to save bandwidth/CPU when out of view
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.1 } // Trigger when at least 10% of the Hero is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const containerVars = {
    initial: { opacity: 0, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as any,
        staggerChildren: 0.2,
        delayChildren: 0.6,
      },
    },
  };

  const itemVars = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full flex flex-col bg-[#050505] overflow-hidden font-sans select-none p-6 md:p-10 lg:p-12">
      
      {/* Floating Capsule Navigation */}
      <Navigation />

      {/* Box Container - inspired by reference image */}
      <motion.div 
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative flex-1 w-full h-full bg-black rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl ring-1 ring-white/10"
      >
        
        {/* Cinematic Video Background - Plays Once On Viewport Entry */}
        <div className="absolute inset-0 z-0 bg-black">
          <video 
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted 
            playsInline 
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          {/* Studio Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-5" />
        </div>





        {/* Main Content Area - Centered Agency Title */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6">
          <motion.h1 
            variants={itemVars}
            className="text-white font-bold tracking-[0.3em] leading-none uppercase select-none text-center whitespace-nowrap"
            style={{ 
              fontFamily: "'Inter', 'SF Pro Display', sans-serif",
              fontSize: "clamp(24px, 8vw, 56px)"
            }}
          >
            COMMERCE AGENTS
          </motion.h1>
          

        </div>

      </motion.div>

    </section>
  );
}
