import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ensureGsapRegistered, ScrollSmoother, ScrollTrigger } from "./gsapSetup";

/**
 * Buttery scroll easing for the whole page, layered on top of native
 * scroll (ScrollTrigger-driven parallax/pin effects keep working as-is).
 * Skipped entirely for reduced-motion users, who get plain native scroll.
 */
export function useScrollSmoother(enabled: boolean) {
  const reduceMotion = useReducedMotion();
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useLayoutEffect(() => {
    if (!enabled || reduceMotion) return;
    ensureGsapRegistered();

    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.1,
      smoothTouch: 0.1,
      effects: false,
      normalizeScroll: { allowNestedScroll: true },
    });

    // Layout can shift slightly as fonts/images finish loading; recalculate.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const timeout = window.setTimeout(refresh, 400);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timeout);
      smootherRef.current?.kill();
      smootherRef.current = null;
    };
  }, [enabled, reduceMotion]);
}
