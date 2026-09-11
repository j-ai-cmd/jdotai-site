import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  range?: number;
  strength?: number;
  className?: string;
}

/** Adapted from the registry's magnetic-button: raised the spring damping
 *  (15 → 24) so the follow settles instead of jiggling past centre on
 *  release — a continuous cursor-follow, not a discrete enter/exit, so it
 *  reads as a "no bobbing" state per prior feedback even though it does use
 *  spring physics. Wraps a real element rather than rendering its own
 *  <button>, so it can wrap the shadcn Button and inherit its markup/a11y. */
export function Magnetic({ children, range = 50, strength = 0.3, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const springConfig = { stiffness: 150, damping: 24, mass: 0.6 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = el.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const dist = Math.hypot(clientX - centerX, clientY - centerY);
    if (dist < range) {
      x.set((clientX - centerX) * strength);
      y.set((clientY - centerY) * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
