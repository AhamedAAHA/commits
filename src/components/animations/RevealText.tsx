import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import { ensureGsapRegistered, gsap } from "../../lib/gsapSetup";

export type RevealMode = "words" | "lines" | "chars";
export type RevealEffect = "mask" | "blur" | "tracking";

interface RevealTextProps {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  wordClassName?: string;
  delay?: number;
  /** Split granularity. Default: words. */
  mode?: RevealMode;
  /** Visual entrance style. Default: mask (y clip). */
  effect?: RevealEffect;
  /**
   * When true, play is scrubbed by ScrollTrigger instead of whileInView.
   * Best for section titles that should feel tied to the camera.
   */
  scrub?: boolean;
  scrubStart?: string;
  scrubEnd?: string;
  /** Play entrance on mount (for above-the-fold hero text). */
  playOnMount?: boolean;
}

function splitUnits(text: string, mode: RevealMode): string[] {
  if (mode === "chars") {
    return text.split("").map((c) => (c === " " ? "\u00A0" : c));
  }
  if (mode === "lines") {
    // Soft line split on punctuation / natural breaks; else wrap as one line of words.
    const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    return parts.length > 1 ? parts : [text];
  }
  return text.split(" ").filter((w) => w.length > 0);
}

function hiddenState(effect: RevealEffect) {
  if (effect === "blur") return { opacity: 0, y: "40%", filter: "blur(8px)" };
  if (effect === "tracking")
    return { opacity: 0, y: "30%", letterSpacing: "0.18em" };
  return { opacity: 0, y: "110%" };
}

function showState(effect: RevealEffect) {
  if (effect === "blur")
    return {
      opacity: 1,
      y: "0%",
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    };
  if (effect === "tracking")
    return {
      opacity: 1,
      y: "0%",
      letterSpacing: "0em",
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
    };
  return {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function MotionUnits({
  text,
  mode,
  effect,
  wordClassName,
  unitClassName,
}: {
  text: string;
  mode: RevealMode;
  effect: RevealEffect;
  wordClassName: string;
  unitClassName: string;
}) {
  const units = splitUnits(text, mode);
  const unitVariants: Variants = {
    hidden: hiddenState(effect),
    show: showState(effect),
  };

  return (
    <>
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          className={unitClassName}
        >
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={unitVariants}
          >
            {unit}
          </motion.span>
        </span>
      ))}
    </>
  );
}

function StaticTag({
  as,
  className,
  text,
}: {
  as: RevealTextProps["as"];
  className: string;
  text: string;
}) {
  if (as === "h1") return <h1 className={className}>{text}</h1>;
  if (as === "h2") return <h2 className={className}>{text}</h2>;
  if (as === "p") return <p className={className}>{text}</p>;
  return <span className={className}>{text}</span>;
}

/** Word / line / char kinetic text — enter on view, or scrub with scroll. */
export function RevealText({
  text,
  as = "span",
  className = "",
  wordClassName = "",
  delay = 0,
  mode = "words",
  effect = "mask",
  scrub = false,
  scrubStart = "top 80%",
  scrubEnd = "top 35%",
  playOnMount = false,
}: RevealTextProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (reduceMotion || !scrub || !rootRef.current) return;

    ensureGsapRegistered();
    const root = rootRef.current;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal-unit]");

    const fromVars =
      effect === "blur"
        ? { opacity: 0, yPercent: 40, filter: "blur(8px)" }
        : effect === "tracking"
          ? { opacity: 0, yPercent: 30, letterSpacing: "0.14em" }
          : { opacity: 0, yPercent: 110 };

    const toVars =
      effect === "blur"
        ? { opacity: 1, yPercent: 0, filter: "blur(0px)" }
        : effect === "tracking"
          ? { opacity: 1, yPercent: 0, letterSpacing: "0em" }
          : { opacity: 1, yPercent: 0 };

    const tween = gsap.fromTo(targets, fromVars, {
      ...toVars,
      ease: "none",
      stagger: mode === "chars" ? 0.02 : 0.05,
      immediateRender: false,
      scrollTrigger: {
        trigger: root,
        start: scrubStart,
        end: scrubEnd,
        scrub: 0.65,
        invalidateOnRefresh: true,
        scroller: document.documentElement,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduceMotion, scrub, effect, mode, scrubStart, scrubEnd, text]);

  if (reduceMotion) {
    return <StaticTag as={as} className={className} text={text} />;
  }

  const unitClassName =
    mode === "chars"
      ? "inline-block overflow-hidden align-bottom"
      : mode === "lines"
        ? "mb-[0.2em] block overflow-hidden pb-[0.08em]"
        : "mr-[0.28em] inline-block overflow-hidden pb-[0.1em] align-bottom last:mr-0";

  const units = splitUnits(text, mode);

  const setRoot = (node: HTMLElement | null) => {
    rootRef.current = node;
  };

  if (scrub) {
    const scrubInner = (
      <>
        {units.map((unit, i) => (
          <span key={`${unit}-${i}`} className={unitClassName}>
            <span
              data-reveal-unit
              className={`inline-block ${wordClassName}`}
            >
              {unit}
            </span>
          </span>
        ))}
      </>
    );

    if (as === "h1")
      return (
        <h1 ref={setRoot} className={className}>
          {scrubInner}
        </h1>
      );
    if (as === "h2")
      return (
        <h2 ref={setRoot} className={className}>
          {scrubInner}
        </h2>
      );
    if (as === "p")
      return (
        <p ref={setRoot} className={className}>
          {scrubInner}
        </p>
      );
    return (
      <span ref={setRoot} className={className}>
        {scrubInner}
      </span>
    );
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: mode === "chars" ? 0.02 : mode === "lines" ? 0.1 : 0.055,
        delayChildren: delay,
      },
    },
  };

  const common = playOnMount
    ? {
        variants: container,
        initial: "hidden" as const,
        animate: "show" as const,
        className,
      }
    : {
        variants: container,
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true, amount: 0.2, margin: "0px 0px -8% 0px" },
        className,
      };

  const kids = (
    <MotionUnits
      text={text}
      mode={mode}
      effect={effect}
      wordClassName={wordClassName}
      unitClassName={unitClassName}
    />
  );

  if (as === "h1") return <motion.h1 {...common}>{kids}</motion.h1>;
  if (as === "h2") return <motion.h2 {...common}>{kids}</motion.h2>;
  if (as === "p") return <motion.p {...common}>{kids}</motion.p>;
  return <motion.span {...common}>{kids}</motion.span>;
}
