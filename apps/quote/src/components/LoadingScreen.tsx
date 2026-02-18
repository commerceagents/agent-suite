"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedLogo from "./AnimatedLogo";

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [showText, setShowText] = useState(false);

  const TIMELINE = {
    LOGO_ANIM_START: 0.2,
    PUSH_APART_START: 3.0,
    PUSH_APART_DURATION: 0.6,
    TEXT_REVEAL_DELAY: 3.8,
    TOTAL_HIDE_DELAY: 6.5,
  };

  useEffect(() => {
    // Lock scroll during loading
    document.body.style.overflow = "hidden";

    const textTimeout = setTimeout(() => {
      setShowText(true);
    }, TIMELINE.TEXT_REVEAL_DELAY * 1000);

    const hideTimeout = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "unset";
    }, TIMELINE.TOTAL_HIDE_DELAY * 1000);

    return () => {
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
            transition={{ duration: 0.8 }}
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
            style={{
              zIndex: 9999,
              backgroundColor: "#050508",
            }}
          >
            {/* Blueprint corner markers */}
            <div className="absolute top-6 left-6 text-[rgba(192,192,200,0.12)] font-mono text-[10px] tracking-[0.15em]">
              +
            </div>
            <div className="absolute top-6 right-6 text-[rgba(192,192,200,0.12)] font-mono text-[10px] tracking-[0.15em]">
              +
            </div>
            <div className="absolute bottom-6 left-6 text-[rgba(192,192,200,0.12)] font-mono text-[10px] tracking-[0.15em]">
              +
            </div>
            <div className="absolute bottom-6 right-6 text-[rgba(192,192,200,0.12)] font-mono text-[10px] tracking-[0.15em]">
              +
            </div>

            {/* Vertical blueprint text — left */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 1.5 }}
              className="absolute left-6 top-1/2 -translate-y-1/2"
              style={{
                writingMode: "vertical-lr",
                textOrientation: "mixed",
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
                textOrientation: "mixed",
                color: "rgba(192, 192, 200, 0.08)",
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              SYSTEM LOADING — V2.0
            </motion.div>

            {/* Center content */}
            <div className="relative flex items-center justify-center w-full h-full">
              {/* Logo — slides left to make room for text */}
              <motion.div
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: -80 }}
                transition={{
                  delay: TIMELINE.PUSH_APART_START,
                  duration: TIMELINE.PUSH_APART_DURATION,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative z-20"
              >
                <AnimatedLogo
                  size="base"
                  delay={0.2}
                  shimmerDelay={3.5}
                />
              </motion.div>

              {/* Text reveal container */}
              <div
                className="absolute left-1/2 overflow-hidden py-4 z-10"
                style={{
                  marginLeft: "40px",
                  transform: "translateX(-50%)",
                  width: "400px",
                }}
              >
                <AnimatePresence>
                  {showText && (
                    <motion.div
                      className="flex flex-col items-center leading-none"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {/* Chrome shimmer text */}
                      <motion.div
                        className="flex flex-col items-center"
                        animate={{
                          backgroundPosition: [
                            "200% center",
                            "-200% center",
                          ],
                        }}
                        transition={{
                          delay: 1.0,
                          duration: 2.0,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(192,192,200,0.2) 0%, rgba(192,192,200,0.2) 40%, rgba(255,255,255,1) 50%, rgba(192,192,200,0.2) 60%, rgba(192,192,200,0.2) 100%)",
                          backgroundSize: "300% auto",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Cabinet Grotesk', sans-serif",
                            fontSize: "18px",
                            fontWeight: 100,
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            marginLeft: "6px",
                          }}
                        >
                          COMMERCE
                        </span>
                        <span
                          style={{
                            fontFamily: "'Cabinet Grotesk', sans-serif",
                            fontSize: "34px",
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            marginTop: "-4px",
                          }}
                        >
                          AGENTS
                        </span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom section counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 1.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(192, 192, 200, 0.15)" }}
            >
              INITIALIZING SYSTEM
            </motion.div>

            {/* Film grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0.03,
                mixBlendMode: "overlay",
                backgroundImage:
                  "url('https://grainy-gradients.vercel.app/noise.svg')",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinemascope letterbox bars — reveal after loading screen */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{
          delay: TIMELINE.TOTAL_HIDE_DELAY + 0.3,
          duration: 1.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed top-0 left-0 w-full pointer-events-none"
        style={{
          height: "50.1%",
          backgroundColor: "#050508",
          zIndex: 100,
        }}
      />
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{
          delay: TIMELINE.TOTAL_HIDE_DELAY + 0.3,
          duration: 1.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: "50.1%",
          backgroundColor: "#050508",
          zIndex: 100,
        }}
      />
    </>
  );
}
