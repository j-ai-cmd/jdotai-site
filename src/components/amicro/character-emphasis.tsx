import { motion, type Variants } from 'framer-motion';

interface CharacterEmphasisProps {
  text: string;
  staggerDelay?: number;
  className?: string;
}

// Same no-JS guard as the rest of the amicro set.
const hasJs = typeof document !== 'undefined' && document.documentElement.classList.contains('js');

/** Adapted from the registry's character-stagger, de-bounced: the original
 *  animates each character in on a spring with scale 0.8 → 1, which is
 *  exactly the "pop" motion the site was corrected away from before. This
 *  keeps the per-character stagger but drops spring and scale for a plain
 *  tween + fade + rise, matching the easing every other reveal on the site
 *  uses. Reserved for one emphasis moment per page — a third use turns a
 *  register into a tic. */
export function CharacterEmphasis({ text, staggerDelay = 0.018, className = '' }: CharacterEmphasisProps) {
  const characters = Array.from(text);

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: staggerDelay } },
  };

  const charVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial={hasJs ? 'hidden' : 'visible'}
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className={`inline-block ${className}`}
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={charVariants} className="inline-block">
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
