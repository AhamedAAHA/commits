import { ArrowDownRight, Download, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import type { SocialLink as SocialLinkType } from "../data/siteContent";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "../lib/gsapSetup";
import { ProfilePortrait } from "./animations/ProfilePortrait";
import { RevealText } from "./animations/RevealText";
import { MagneticButton, MagneticLink } from "./animations/MagneticButton";
import { SocialLinks } from "./SocialLinks";

interface HeroProps {
  name: string;
  title: string;
  tagline?: string;
  location: string;
  profileImage: string;
  socials: readonly SocialLinkType[];
  cvPdfPath: string;
  onContactClick: () => void;
}

export function Hero({
  name,
  title,
  tagline,
  location,
  profileImage,
  socials,
  cvPdfPath,
  onContactClick,
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        scale: 0.93,
        opacity: 0.1,
        filter: "blur(8px)",
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === sectionRef.current) trigger.kill();
      });
    };
  }, [reduceMotion]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-28 sm:pt-36 lg:px-8"
    >
      <div
        ref={contentRef}
        className="relative mx-auto grid max-w-5xl items-center gap-12 [transform-style:preserve-3d] lg:grid-cols-[1fr_minmax(240px,320px)] lg:gap-14"
      >
        <div className="min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono-ui glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            status: open to opportunities
          </motion.p>

          <RevealText
            as="h1"
            text={name}
            delay={0.1}
            className="font-display text-5xl leading-[1.02] tracking-tight text-[var(--ink)] sm:text-6xl lg:text-7xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-lg text-[var(--ink-soft)] sm:text-xl"
          >
            {title}
          </motion.p>

          {tagline ? (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-aurora mt-2 max-w-xl text-sm font-semibold sm:text-base"
            >
              {tagline}
            </motion.p>
          ) : null}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="font-mono-ui mt-3 text-xs text-[var(--ink-faint)]"
          >
            // {location}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5"
          >
            <MagneticLink
              href={cvPdfPath}
              download="Ahamed_AAH.pdf"
              data-cursor-text="GET"
              className="focus-ring glass glass-hover items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[var(--ink)]"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download CV
            </MagneticLink>
            <MagneticButton
              type="button"
              onClick={onContactClick}
              data-cursor-text="SAY HI"
              className="focus-ring items-center justify-center gap-2 rounded-full border border-[oklch(0.72_0.19_258_/0.4)] bg-[oklch(0.62_0.19_258_/0.16)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_12px_36px_-14px_oklch(0.2_0.1_258_/0.72)] backdrop-blur-md transition hover:bg-[oklch(0.62_0.19_258_/0.26)]"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Contact me
              <ArrowDownRight className="h-4 w-4 opacity-70" aria-hidden />
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 border-t border-[var(--line)] pt-10"
          >
            <p className="font-mono-ui mb-4 text-[11px] uppercase tracking-widest text-[var(--ink-faint)]">
              // connect
            </p>
            <SocialLinks links={socials} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="order-first lg:order-none"
        >
          <ProfilePortrait src={profileImage} alt={`Portrait of ${name}`} />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-[var(--ink-faint)]">
          scroll
        </span>
        <motion.span
          className="h-8 w-px bg-gradient-to-b from-[var(--accent)] to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
