"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * CinematicReveal.tsx
 * A minimalist, high-end text reveal focusing on optical focus 
 * and dynamic letter-spacing (tracking).
 * 
 * Logic:
 * 1. Initial State: 100% blurred, expanded letter-spacing.
 * 2. Animation: Slowly fades blur to 0 and tightens letter-spacing.
 * 3. Result: Hyper-sharp focus with clean chrome texture.
 */
export default function CinematicReveal({
  text,
  fontSize = "72px",
  delay = 0,
  duration = 4,
  className = "",
  fontWeight = 900,
  letterSpacingStart = "0.5em",
  letterSpacingEnd = "-0.04em",
  initialScale = 1.5,
  initialOpacity = 0,
  initialY = 0,
  useMask = false,
}: {
  text: string;
  fontSize?: string;
  delay?: number;
  duration?: number;
  className?: string;
  fontWeight?: number;
  letterSpacingStart?: string;
  letterSpacingEnd?: string;
  initialScale?: number;
  initialOpacity?: number;
  initialY?: number;
  useMask?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Singular focal motion logic
    gsap.set(containerRef.current, {
      "--blur": "60px",
      "--brightness": "1",
      "--scale": initialScale,
      opacity: initialOpacity,
      letterSpacing: letterSpacingStart,
      y: initialY,
    });

    const tl = gsap.timeline({ delay });

    // Primary Reveal: Scale + Blur + Track + Opacity + Y
    tl.to(containerRef.current, {
      opacity: 1,
      "--blur": "0px",
      "--scale": 1,
      y: 0,
      letterSpacing: letterSpacingEnd,
      duration: duration,
      ease: "power2.out",
    });

    // Elegant Brightness Pop
    tl.to(containerRef.current, {
      "--brightness": "1.5",
      duration: duration * 0.3,
      ease: "power2.inOut",
    }, `-=${duration * 0.8}`)
    .to(containerRef.current, {
      "--brightness": "1",
      duration: duration * 0.45,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [text, delay, duration, letterSpacingStart, letterSpacingEnd, initialScale, initialOpacity, initialY]);

  const content = (
    <div 
      ref={containerRef} 
      className={`select-none text-center ${className}`}
      style={{
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontSize,
        fontWeight,
        lineHeight: 1.1,
        filter: "blur(var(--blur)) brightness(var(--brightness)) drop-shadow(0 0 1px rgba(255,255,255,0.3))",
        transform: "scale(var(--scale)) translateZ(0)",
        // Restore unified background for the whole word
        background: "linear-gradient(180deg, #FFFFFF 0%, #D0D0DA 50%, #8A8A94 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        whiteSpace: "nowrap",
        willChange: "transform, filter, letter-spacing, opacity",
      } as any}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );

  if (useMask) {
    return (
      <div style={{ overflow: "hidden", padding: "4px 0" }}>
        {content}
      </div>
    );
  }

  return content;
}
