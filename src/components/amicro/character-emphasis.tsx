import { motion } from 'framer-motion';

interface CharacterEmphasisProps {
  text: string;
  staggerDelay?: number;
  className?: string;
}

// Same no-JS guard as the rest of the amicro set.
const hasJs = typeof document !== 'undefined' && document.documentElement.classList.contains('js');

/** Adapted from the registry's character-stagger, de-bounced and re-grouped:
 *  the original animates each character in on a spring with scale 0.8 → 1
 *  (exactly the "pop" motion the site was corrected away from before) and
 *  wraps every character as its own flat inline-block sibling, which lets
 *  the browser line-break the display line *between any two characters* —
 *  a "for." at a wrap point came back "f" / "or." split mid-word. Each word
 *  is now its own non-breaking group; the per-character stagger runs off an
 *  explicit delay computed from each character's position in the whole
 *  string, not from nested variants, so grouping by word doesn't change the
 *  timing. Reserved for one emphasis moment per page — a third use turns a
 *  register into a tic. Plays on mount (not on scroll — see
 *  figure-reveal.tsx for why whileInView isn't used here). */
export function CharacterEmphasis({ text, staggerDelay = 0.018, className = '' }: CharacterEmphasisProps) {
  const words = text.split(' ');
  let i = 0;

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, wi) => {
        const start = i;
        i += word.length;
        return (
          // The breakable space sits outside the nowrap span, as its own
          // text node — nesting it inside (even at the end) risks the
          // browser treating the whole thing as one unbreakable unit.
          <span key={wi}>
            <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {Array.from(word).map((char, ci) => (
                <motion.span
                  key={ci}
                  initial={hasJs ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: (start + ci) * staggerDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}
