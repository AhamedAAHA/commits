import { useCallback, useRef, type MouseEvent, type RefObject } from "react";

interface TiltHandlers<T extends HTMLElement> {
  ref: RefObject<T | null>;
  onMouseMove: (e: MouseEvent<T>) => void;
  onMouseLeave: () => void;
}

/**
 * Imperative 3D tilt + cursor-spotlight tracking for card elements.
 * Mutates styles directly (no React state) to stay smooth at 60fps.
 * Pair with the `.spotlight-card` CSS class for the glow effect.
 */
export function useTilt<T extends HTMLElement = HTMLElement>(
  maxTiltDeg = 6,
): TiltHandlers<T> {
  const ref = useRef<T | null>(null);

  const onMouseMove = useCallback(
    (e: MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTiltDeg * 2;
      const rotateX = (0.5 - py) * maxTiltDeg * 2;

      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.transition = "transform 0.08s linear";
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    },
    [maxTiltDeg],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

