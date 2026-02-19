"use client";

import { motion } from "framer-motion";
import React from "react";

interface AnimatedLogoProps {
  size?: "small" | "base" | "large";
  loop?: boolean;
  delay?: number;
  shimmerDelay?: number;
  className?: string;
  onShockwave?: () => void;
}

export default function AnimatedLogo({
  size = "base",
  loop = false,
  delay = 0,
  shimmerDelay = 3.5,
  className = "",
  onShockwave,
}: AnimatedLogoProps) {
  const sizeClasses = {
    small: "w-12 h-12 md:w-16 md:h-16",
    base: "w-20 h-20 md:w-24 md:h-24",
    large: "w-32 h-32 md:w-40 md:h-40",
  };

  const logoPaths = {
    outerC:
      "M112.864 197.024C98.8352 199.009 84.5443 197.958 70.9566 193.945C57.3688 189.932 44.8008 183.049 34.1016 173.761C23.4024 164.473 14.8214 152.997 8.93832 140.108C3.05523 127.219 0.00714889 113.218 1.25584e-05 99.0499C-0.00712377 84.8818 3.02685 70.8773 8.89695 57.9824C14.767 45.0876 23.3365 33.603 34.0263 24.3045C44.7161 15.006 57.2772 8.11026 70.8609 4.08323C84.4446 0.0561998 98.7345 -1.00832 112.765 0.961605L107.953 35.2334C98.8273 33.9522 89.5328 34.6445 80.6977 37.2638C71.8625 39.8831 63.6924 44.3683 56.7395 50.4162C49.7866 56.4642 44.2128 63.9341 40.3948 72.3212C36.5767 80.7083 34.6034 89.8172 34.608 99.0324C34.6126 108.248 36.5952 117.355 40.4217 125.738C44.2482 134.121 49.8295 141.585 56.7885 147.626C63.7475 153.667 71.9221 158.144 80.7599 160.755C89.5977 163.365 98.8928 164.048 108.017 162.758L112.864 197.024Z",
    innerComplex:
      "M99 42.9004C129.983 42.9004 155.1 68.017 155.101 99V134.584H134.584V155.101H99C68.017 155.1 42.9004 129.983 42.9004 99C42.9006 68.0171 68.0171 42.9006 99 42.9004ZM98.9072 52.5176C98.1681 64.5791 93.0438 75.9542 84.499 84.499C75.9542 93.0438 64.5791 98.1681 52.5176 98.9072V99.0938C64.5791 99.8329 75.9542 104.957 84.499 113.502C93.0438 122.047 98.1681 133.422 98.9072 145.483H99.0938C99.8343 133.422 104.959 122.048 113.504 113.504C122.048 104.959 133.422 99.8343 145.483 99.0938V98.9072C133.422 98.1667 122.048 93.0416 113.504 84.4971C104.959 75.9526 99.8343 64.5786 99.0938 52.5176H98.9072Z",
    starPath:
      "M98.9072 52.5176C98.1681 64.5791 93.0438 75.9542 84.499 84.499C75.9542 93.0438 64.5791 98.1681 52.5176 98.9072V99.0938C64.5791 99.8329 75.9542 104.957 84.499 113.502C93.0438 122.047 98.1681 133.422 98.9072 145.483H99.0938C99.8343 133.422 104.959 122.048 113.504 113.504C122.048 104.959 133.422 99.8343 145.483 99.0938V98.9072C133.422 98.1667 122.048 93.0416 113.504 84.4971C104.959 75.9526 99.8343 64.5786 99.0938 52.5176H98.9072Z",
  };

  const animationProps = loop
    ? { repeat: Infinity, repeatDelay: 3.5 }
    : {};

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full">
        <svg
          viewBox="0 0 198 198"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6A6A78" />
              <stop offset="25%" stopColor="#9A9AA6" />
              <stop offset="55%" stopColor="#D0D0DC" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            <linearGradient id="iconShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="45%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="1" />
              <stop offset="55%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            <mask id="iconShimmerMask">
              <motion.rect
                x="-400"
                y="0"
                width="400"
                height="200"
                fill="url(#iconShimmer)"
                animate={{ x: [-400, 400] }}
                transition={{
                  delay: delay + shimmerDelay,
                  duration: 2.0,
                  ease: "easeInOut",
                }}
              />
            </mask>
          </defs>

          {/* ── 1. Star path traces first ── */}
          <motion.path
            d={logoPaths.starPath}
            stroke="rgba(192,192,200,0.6)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.8, 0.8, 0] }}
            transition={{
              delay: delay + 0.2,
              duration: 1.2,
              ease: "easeInOut",
              ...animationProps,
            }}
          />

          {/* ── 2. Outer C traces ── */}
          <motion.path
            d={logoPaths.outerC}
            stroke="rgba(192,192,200,0.5)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.7, 0.7, 0.2] }}
            transition={{
              delay: delay + 0.6,
              duration: 1.4,
              ease: "easeInOut",
              ...animationProps,
            }}
          />

          {/* ── 3. Inner shape traces ── */}
          <motion.path
            d={logoPaths.innerComplex}
            stroke="rgba(192,192,200,0.4)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.6, 0.6, 0.2] }}
            transition={{
              delay: delay + 0.8,
              duration: 1.2,
              ease: "easeInOut",
              ...animationProps,
            }}
          />

          {/* ── 4. Outer C fill ── */}
          <motion.path
            d={logoPaths.outerC}
            fill="url(#chromeGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: delay + 1.6,
              duration: 0.5,
              ease: "easeOut",
              ...animationProps,
            }}
          />

          {/* ── 5. Inner shape fill ── */}
          <motion.path
            d={logoPaths.innerComplex}
            fill="url(#chromeGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: delay + 1.7,
              duration: 0.5,
              ease: "easeOut",
              ...animationProps,
            }}
          />

          {/* ── 6. Small square snaps in ── */}
          <motion.rect
            x="143.927"
            y="142.277"
            width="12.8228"
            height="12.8228"
            fill="url(#chromeGrad)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            transition={{
              delay: delay + 2.0,
              duration: 0.4,
              ease: [0.34, 1.56, 0.64, 1] as const,
              ...animationProps,
            }}
          />

          {/* ── 7. Shimmer sweep ── */}
          <motion.g
            mask="url(#iconShimmerMask)"
            style={{ mixBlendMode: "overlay", opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: delay + shimmerDelay,
              duration: 0.01,
              ...animationProps,
            }}
          >
            <path d={logoPaths.outerC} fill="white" />
            <path d={logoPaths.innerComplex} fill="white" />
            <rect x="143.927" y="142.277" width="12.8228" height="12.8228" fill="white" />
          </motion.g>
        </svg>
      </div>
    </div>
  );
}
