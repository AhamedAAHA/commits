import { useLayoutEffect, type RefObject } from "react";
import { ensureGsapRegistered, gsap } from "./gsapSetup";

type ParallaxOptions = {
  /** Vertical travel in px (positive = moves down as you scroll). */
  y?: number;
  /** Optional scale delta (1 → 1+scale). */
  scale?: number;
  /** Scrub lag for smoother cinema feel. */
  scrub?: number;
  disabled?: boolean;
  /** Trigger element; defaults to the animated node. */
  trigger?: RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
};

/** Soft scrubbed parallax on a single element. */
export function useParallax(
  targetRef: RefObject<HTMLElement | null>,
  {
    y = 40,
    scale = 0,
    scrub = 0.7,
    disabled = false,
    trigger,
    start = "top bottom",
    end = "bottom top",
  }: ParallaxOptions = {},
) {
  useLayoutEffect(() => {
    if (disabled || !targetRef.current) return;

    ensureGsapRegistered();
    const el = targetRef.current;
    const triggerEl = trigger?.current ?? el;

    const tween = gsap.fromTo(
      el,
      { y: -y * 0.35, scale: scale ? 1 + scale * 0.25 : 1 },
      {
        y,
        scale: scale ? 1 - scale : 1,
        ease: "none",
        scrollTrigger: {
          trigger: triggerEl,
          start,
          end,
          scrub,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [disabled, targetRef, trigger, y, scale, scrub, start, end]);
}
