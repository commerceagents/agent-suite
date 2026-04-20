'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const NAV_ITEMS = [
  { name: 'About us', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'People', href: '#people' },
  { name: 'Testimonial', href: '#testimonials' },
  { name: 'Contact us', href: '#contact' },
];

export default function Header() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <div className="relative glass-dock px-2 py-2 flex items-center gap-1 rounded-full border border-white/10 shadow-2xl backdrop-blur-xl">
        {NAV_ITEMS.map((item, index) => (
          <a
            key={item.name}
            href={item.href}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative px-6 py-2 text-xs font-medium tracking-widest uppercase text-white/50 transition-colors hover:text-white z-10"
          >
            {item.name}
            {hoveredIndex === index && (
              <motion.div
                layoutId="nav-highlight"
                className="absolute inset-0 bg-white/10 rounded-full -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </a>
        ))}
      </div>
    </nav>
  );
}
