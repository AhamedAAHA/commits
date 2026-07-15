import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "./gsapSetup";

type CinematicBuilder = (api: {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
}) => void;

type UseCinematicSceneOptions = {
  /** Skip all GSAP setup (e.g. reduced motion). */
  disabled?: boolean;
  /** Extra deps that should rebuild the scene. */
  deps?: DependencyList;
};

/**
 * Registers a GSAP context scoped to `scopeRef`, with automatic cleanup.
 * Use for scrubbed / pinned cinematic timelines tied to Lenis + ScrollTrigger.
 */
export function useCinematicScene(
  scopeRef: RefObject<HTMLElement | null>,
  build: CinematicBuilder,
  { disabled = false, deps = [] }: UseCinematicSceneOptions = {},
) {
  useLayoutEffect(() => {
    if (disabled || !scopeRef.current) return;

    ensureGsapRegistered();
    const ctx = gsap.context(() => {
      build({ gsap, ScrollTrigger });
    }, scopeRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps passed explicitly by callers
  }, [disabled, scopeRef, ...deps]);
}
