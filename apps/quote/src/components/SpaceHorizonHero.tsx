'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import SpaceHorizonCanvas from './SpaceHorizonCanvas';
import Navigation from './Navigation';

export default function SpaceHorizonHero() {
  const [videoSrc] = React.useState("/video-6.mp4");
  const [activeVideo, setActiveVideo] = React.useState<1 | 2>(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const crossfadeTriggerTime = 1.5; // Trigger crossfade 1.5 seconds before end
    
    if (video.duration && (video.duration - video.currentTime) <= crossfadeTriggerTime) {
      if (activeVideo === 1) {
        if (video2Ref.current && video2Ref.current.paused) {
          video2Ref.current.currentTime = 0;
          const playPromise = video2Ref.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => { if (error.name !== 'AbortError') console.warn(error) });
          }
          setActiveVideo(2);
        }
      } else {
        if (video1Ref.current && video1Ref.current.paused) {
          video1Ref.current.currentTime = 0;
          const playPromise = video1Ref.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => { if (error.name !== 'AbortError') console.warn(error) });
          }
          setActiveVideo(1);
        }
      }
    }
  };

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
        
        {/* Cinematic Video Background - Dual Crossfade Loop System */}
        <div className="absolute inset-0 z-0 bg-black">
          {/* Video 1 */}
          <video 
            ref={video1Ref}
            src={videoSrc}
            autoPlay={true}
            muted 
            playsInline 
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${activeVideo === 1 ? 'opacity-60' : 'opacity-0'}`}
          />
          {/* Video 2 */}
          <video 
            ref={video2Ref}
            src={videoSrc}
            autoPlay={false}
            muted 
            playsInline 
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${activeVideo === 2 ? 'opacity-60' : 'opacity-0'}`}
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
