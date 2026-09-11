import React from 'react';
import { motion } from 'framer-motion';

interface FigureRevealProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

// Same no-JS guard as fade-up.tsx and text-reveal.tsx.
const hasJs = typeof document !== 'undefined' && document.documentElement.classList.contains('js');

/** Adapted from the registry's scroll-reveal: a distinct entrance for inline
 *  figures (charts, video, diagrams) — a hair of scale alongside the fade so
 *  a figure reads differently from a paragraph's plain FadeUp. Dropped the
 *  x-offset and eased the scale in from 0.98 rather than 0.95; anything more
 *  reads as a "zoom" rather than a settle. */
export function FigureReveal({ children, duration = 0.6, className = '' }: FigureRevealProps) {
  return (
    <motion.div
      initial={hasJs ? { opacity: 0, y: 16, scale: 0.98 } : false}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{
        duration,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
