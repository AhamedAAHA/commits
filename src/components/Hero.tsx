import { ArrowDownRight, Download, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { SocialLink as SocialLinkType } from "../data/siteContent";
import { useCinematicScene } from "../lib/useCinematicScene";
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
  const copyRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useCinematicScene(
    sectionRef,
    ({ gsap }) => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.to(copyRef.current, {
        y: -70,
        opacity: 0.05,
        filter: "blur(10px)",
        scale: 0.92,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.55,
        },
      });

      gsap.to(portraitRef.current, {
        y: 90,
        scale: 1.08,
        rotate: -2,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      gsap.to(cueRef.current, {
        opacity: 0,
        y: 24,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });
    },
    { disabled: Boolean(reduceMotion) },
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-28 sm:pt-36 lg:px-8"
    >
      <div className="relative mx-auto grid max-w-5xl items-center gap-12 [transform-style:preserve-3d] lg:grid-cols-[1fr_minmax(240px,320px)] lg:gap-14">
        <div ref={copyRef} className="min-w-0 will-change-transform">
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
            mode="chars"
            effect="mask"
            playOnMount
            className="font-display text-5xl leading-[1.02] tracking-tight text-[var(--ink)] sm:text-6xl lg:text-7xl"
          />

          <RevealText
            as="p"
            text={title}
            delay={0.35}
            mode="words"
            effect="blur"
            playOnMount
            className="mt-5 max-w-xl text-lg text-[var(--ink-soft)] sm:text-xl"
          />

          {tagline ? (
            <RevealText
              as="p"
              text={tagline}
              delay={0.55}
              mode="words"
              effect="tracking"
              className="text-aurora mt-2 max-w-xl text-sm font-semibold sm:text-base"
            />
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
          ref={portraitRef}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="order-first will-change-transform lg:order-none"
        >
          <ProfilePortrait src={profileImage} alt={`Portrait of ${name}`} />
        </motion.div>
      </div>

      <div
        ref={cueRef}
        className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="font-mono-ui text-[10px] uppercase tracking-[0.3em] text-[var(--ink-faint)]">
          scroll
        </span>
        <motion.span
          className="h-8 w-px bg-gradient-to-b from-[var(--accent)] to-transparent"
          animate={
            reduceMotion
              ? undefined
              : { scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
