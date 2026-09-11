import { motion, useScroll, useSpring } from 'framer-motion';

/** Adapted from the registry's progress-indicator: the registry hardcodes
 *  `bg-blue-500` as a Tailwind class, which would be the one raw colour in
 *  the whole stylesheet system (and fail gate 48). Painted with the token
 *  directly instead. Purposeful here, not decorative — Long Document has no
 *  other orientation cue for how far into the piece a reader is. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="reading-progress"
      style={{ scaleX }}
    />
  );
}
