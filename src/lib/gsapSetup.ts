import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

let registered = false;

/** Registers GSAP plugins exactly once. Safe to call from multiple components. */
export function ensureGsapRegistered() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  registered = true;
}

export { gsap, ScrollTrigger, ScrollSmoother };
