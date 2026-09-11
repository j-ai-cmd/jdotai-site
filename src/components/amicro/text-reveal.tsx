import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface TextRevealProps {
  text: string;
  duration?: number;
  staggerDelay?: number;
  className?: string;
  /** The registry ships this as a fixed div; a heading rendered through it
   *  otherwise loses its semantic tag, which is worse for a11y/SEO than the
   *  animation is worth. */
  as?: 'div' | 'h1' | 'h2' | 'h3';
}

// index.html adds "js" to <html> synchronously, before hydration — the same
// signal site.css gates [data-rise] on. A no-JS or JS-still-loading visit
// renders content already visible instead of stuck behind this component's
// own overflow-hidden clip; JS visits still get the entrance play.
const hasJs = typeof document !== 'undefined' && document.documentElement.classList.contains('js');

export function TextReveal({
  text,
  duration = 0.8,
  staggerDelay = 0.15,
  className = '',
  as = 'div',
}: TextRevealProps) {
  const Container = motion[as];
  const lines = text.split('\n');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  // Typed as Variants so the cubic-bezier array narrows to framer-motion's
  // Easing tuple. Upstream ships this untyped, which fails `tsc` against
  // framer-motion 12 — a bug in the registry component, not in the array.
  const itemVariants: Variants = {
    hidden: { y: '100%' },
    visible: {
      y: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      },
    },
  };

  return (
    <Container
      variants={containerVariants}
      initial={hasJs ? 'hidden' : 'visible'}
      animate="visible"
      className={`flex flex-col ${className}`}
    >
      {lines.map((line, index) => (
        <div key={index} className="overflow-hidden py-1">
          <motion.span variants={itemVariants} className="block">
            {line}
          </motion.span>
        </div>
      ))}
    </Container>
  );
}
