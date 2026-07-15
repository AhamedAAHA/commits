import Lenis from "lenis";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "./gsapSetup";

type LenisInstance = InstanceType<typeof Lenis>;

let lenis: LenisInstance | null = null;
let tickerFn: ((time: number) => void) | null = null;
let started = false;

export function getLenis(): LenisInstance | null {
  return lenis;
}

/** Smoothly scroll to an element id (Lenis when available, native fallback). */
export function scrollToSection(id: string, offset = -88) {
  const target = document.getElementById(id);
  if (!target) return;

  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.15 });
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function startSmoothScroll() {
  if (started || typeof window === "undefined") return;

  const prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  ensureGsapRegistered();

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  // Keep ScrollTrigger in sync with Lenis scroll position (fixes scrub / pin bugs)
  const scroller = document.documentElement;
  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      if (arguments.length && lenis) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis?.scroll ?? window.scrollY;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  lenis.on("scroll", ScrollTrigger.update);

  tickerFn = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  document.documentElement.classList.add("has-lenis", "lenis", "lenis-smooth");
  document.documentElement.style.scrollBehavior = "auto";

  started = true;

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

export function stopSmoothScroll() {
  if (!started) return;

  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }

  ScrollTrigger.scrollerProxy(document.documentElement, {});
  lenis?.destroy();
  lenis = null;

  document.documentElement.classList.remove("has-lenis", "lenis", "lenis-smooth");
  document.documentElement.style.scrollBehavior = "";
  started = false;

  ScrollTrigger.refresh();
}

export function pauseSmoothScroll() {
  lenis?.stop();
}

export function resumeSmoothScroll() {
  lenis?.start();
}
