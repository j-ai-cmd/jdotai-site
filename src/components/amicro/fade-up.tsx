import React from 'react';
import { motion } from 'framer-motion';

interface FadeUpProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  yOffset?: number;
  className?: string;
}

// index.html adds "js" to <html> synchronously, before hydration — the same
// signal site.css gates [data-rise] on. Reading it here means a no-JS or
// JS-still-loading visit renders content already visible instead of stuck at
// the registry's unconditional opacity:0, while JS visits still get the
// entrance play (initial is only sampled once, at mount, by framer-motion).
const hasJs = typeof document !== 'undefined' && document.documentElement.classList.contains('js');

export function FadeUp({
  children,
  duration = 0.6,
  delay = 0,
  yOffset = 20,
  className = '',
}: FadeUpProps) {
  return (
    <motion.div
      initial={hasJs ? { opacity: 0, y: yOffset } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
