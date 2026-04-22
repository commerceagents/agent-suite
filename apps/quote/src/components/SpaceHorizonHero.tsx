'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SpaceHorizonCanvas from './SpaceHorizonCanvas';
import Navigation from './Navigation';

export default function SpaceHorizonHero() {
  const [videoSrc, setVideoSrc] = React.useState("/video-4.mp4");
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasEnded = useRef(false);

  const handleTimeUpdate = () => {
    // We only track the end state here
    if (hasEnded.current) return;
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && !hasEnded.current) {
      // One-time cinematic trim on load
      videoRef.current.currentTime = 0.5;
    }
  };

  const handleEnded = () => {
    hasEnded.current = true;
    if (videoRef.current) videoRef.current.pause();
  };

  const handleVideoError = () => {
    console.warn("Video 4 failed to decode (unsupported codec). Falling back to Video 2.");
    if (videoSrc !== "/video-2.mp4") {
      setVideoSrc("/video-2.mp4");
      hasEnded.current = false;
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(err => {
        console.warn("Hero video autoplay or decode failed:", err);
        // Fallback on play fail (e.g. codec issues masquerading as NotAllowedError)
        handleVideoError();
      });
    }
  }, [videoSrc]);

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
    <section className="relative h-screen w-full flex flex-col bg-[#050505] overflow-hidden font-sans select-none p-6 md:p-10 lg:p-12">
      
      {/* Floating Capsule Navigation */}
      <Navigation />

      {/* Box Container - inspired by reference image */}
      <motion.div 
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative flex-1 w-full h-full bg-black rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl ring-1 ring-white/10"
      >
        
        {/* Cinematic Video Background - Continuous Loop */}
        <div className="absolute inset-0 z-0">
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline 
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onError={handleVideoError}
            className="w-full h-full object-cover opacity-60"
          >
            {/* Using dynamic src for graceful fallback */}
            <source src={videoSrc} type="video/mp4" />
          </video>
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
