"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import AnimatedLogo from "./AnimatedLogo";
import RippleGrid from "./RippleGrid";

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [showText, setShowText] = useState(false);
  const [showRipples, setShowRipples] = useState(false);

  const TIMELINE = {
    TEXT_REVEAL_DELAY: 3.8,
    CONTENT_FADE_DELAY: 5.5,  // logo+text fade out
    TOTAL_HIDE_DELAY: 6.5,    // loading screen removed from DOM
    BARS_OPEN_DELAY: 8.0,     // cinemascope bars start sliding
  };

  const triggerRipples = useCallback(() => {
    if (!showRipples) setShowRipples(true);
  }, [showRipples]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Trigger ripples when logo fills complete
    const rippleTimeout = setTimeout(() => {
      triggerRipples();
    }, 2400);

    const textTimeout = setTimeout(() => {
      setShowText(true);
    }, TIMELINE.TEXT_REVEAL_DELAY * 1000);

    const hideTimeout = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "unset";
    }, TIMELINE.TOTAL_HIDE_DELAY * 1000);

    return () => {
      clearTimeout(rippleTimeout);
      clearTimeout(textTimeout);
      clearTimeout(hideTimeout);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
            style={{ zIndex: 9999, backgroundColor: "#050508" }}
          >
            {/* ═══ DOT RIPPLE GRID ═══ */}
            <RippleGrid trigger={showRipples} />

            {/* Blueprint corner markers */}
            {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos) => (
              <div
                key={pos}
                className={`absolute ${pos} font-mono text-[11px]`}
                style={{ color: "rgba(192,192,200,0.12)" }}
              >
                +
              </div>
            ))}

            {/* Vertical blueprint text — left */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 1.5 }}
              className="absolute left-6 top-1/2 -translate-y-1/2"
              style={{
                writingMode: "vertical-lr",
                color: "rgba(192, 192, 200, 0.08)",
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              COMMERCE AGENTS — AGENT SUITE
            </motion.div>

            {/* Vertical blueprint text — right */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.5 }}
              className="absolute right-6 top-1/2 -translate-y-1/2"
              style={{
                writingMode: "vertical-lr",
                color: "rgba(192, 192, 200, 0.08)",
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              SYSTEM LOADING — V2.0
            </motion.div>

            {/* Center content — split reveal: logo slides left, text reveals right */}
            <div className="relative flex items-center justify-center w-full h-full" style={{ zIndex: 10 }}>
              <motion.div className="flex items-center gap-1" layout transition={{ layout: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }}>
                {/* Logo — starts centered, smoothly shifts left via layout animation */}
                <motion.div className="relative z-20" layout>
                  <AnimatedLogo
                    size="base"
                    delay={0.2}
                    shimmerDelay={4.0}
                    onShockwave={triggerRipples}
                  />
                </motion.div>

                {/* Text — smooth clipPath mask reveal */}
                {showText && (
                  <motion.div
                    initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                    animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    layout
                  >
                    <motion.div
                      className="flex flex-col leading-none whitespace-nowrap"
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.div
                        className="flex flex-col items-center"
                        animate={{ backgroundPosition: ["200% center", "-200% center"] }}
                        transition={{
                          delay: 0.8,
                          duration: 2.0,
                          ease: "easeInOut",
                        }}
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(192,192,200,0.5) 0%, rgba(192,192,200,0.5) 40%, rgba(255,255,255,1) 50%, rgba(192,192,200,0.5) 60%, rgba(192,192,200,0.5) 100%)",
                          backgroundSize: "300% auto",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "22px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                          COMMERCE
                        </span>
                        <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "36px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: "4px" }}>
                          AGENTS
                        </span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Bottom text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 1.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(192, 192, 200, 0.15)", zIndex: 10 }}
            >
              INITIALIZING SYSTEM
            </motion.div>

            {/* Film grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0.03,
                mixBlendMode: "overlay",
                backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
                zIndex: 20,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinemascope letterbox bars — with chrome edge glow */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ delay: TIMELINE.BARS_OPEN_DELAY, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full pointer-events-none"
        style={{ height: "50.1%", backgroundColor: "#050508", zIndex: 100 }}
      >
        {/* Chrome edge glow — hidden until bars open */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: TIMELINE.BARS_OPEN_DELAY - 0.3, duration: 0.5 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent 0%, rgba(192,192,200,0.3) 20%, rgba(255,255,255,0.6) 50%, rgba(192,192,200,0.3) 80%, transparent 100%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: TIMELINE.BARS_OPEN_DELAY - 0.3, duration: 0.5 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "20px",
            background: "linear-gradient(to top, rgba(192,192,200,0.08), transparent)",
          }}
        />
      </motion.div>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ delay: TIMELINE.BARS_OPEN_DELAY, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 left-0 w-full pointer-events-none"
        style={{ height: "50.1%", backgroundColor: "#050508", zIndex: 100 }}
      >
        {/* Chrome edge glow — hidden until bars open */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: TIMELINE.BARS_OPEN_DELAY - 0.3, duration: 0.5 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent 0%, rgba(192,192,200,0.3) 20%, rgba(255,255,255,0.6) 50%, rgba(192,192,200,0.3) 80%, transparent 100%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: TIMELINE.BARS_OPEN_DELAY - 0.3, duration: 0.5 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "20px",
            background: "linear-gradient(to bottom, rgba(192,192,200,0.08), transparent)",
          }}
        />
      </motion.div>
    </>
  );
}
