import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import {
  pauseSmoothScroll,
  resumeSmoothScroll,
  startSmoothScroll,
  stopSmoothScroll,
} from "../../lib/smoothScroll";

type SmoothScrollProps = {
  /** When true (e.g. preloader / modal), temporarily halt Lenis. */
  paused?: boolean;
};

/**
 * Boots Lenis and wires it into GSAP ScrollTrigger.
 * Falls back to native scrolling when reduced-motion is preferred.
 */
export function SmoothScroll({ paused = false }: SmoothScrollProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    startSmoothScroll();
    return () => stopSmoothScroll();
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    if (paused) pauseSmoothScroll();
    else resumeSmoothScroll();
  }, [paused, reduceMotion]);

  return null;
}
