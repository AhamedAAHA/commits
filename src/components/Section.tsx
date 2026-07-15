import { motion, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useCinematicScene } from "../lib/useCinematicScene";
import { useParallax } from "../lib/useParallax";
import { ScrollReveal } from "./animations/ScrollReveal";
import { RevealText } from "./animations/RevealText";

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Skip default header when a section supplies its own cinematic chrome. */
  hideHeader?: boolean;
  className?: string;
}

export function Section({
  id,
  title,
  subtitle,
  children,
  hideHeader = false,
  className = "",
}: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();

  useParallax(glowRef, {
    y: 110,
    scrub: 0.65,
    disabled: Boolean(reduceMotion),
    trigger: sectionRef,
  });

  useCinematicScene(
    sectionRef,
    ({ gsap }) => {
      if (!labelRef.current) return;
      gsap.fromTo(
        labelRef.current,
        { x: -24, opacity: 0.35 },
        {
          x: 18,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 35%",
            scrub: 0.5,
          },
        },
      );
    },
    { disabled: Boolean(reduceMotion) || hideHeader },
  );

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative scroll-mt-20 overflow-hidden px-4 py-14 sm:scroll-mt-28 sm:px-6 sm:py-16 lg:px-8 ${className}`}
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[620px] -translate-x-1/2 rounded-full opacity-[0.09] blur-[100px] will-change-transform"
        style={{ background: "var(--accent)" }}
      />
      <div className="relative mx-auto max-w-5xl">
        {hideHeader ? null : (
          <ScrollReveal>
            <header className="mb-8 sm:mb-12">
              <p
                ref={labelRef}
                className="font-mono-ui mb-3 text-xs uppercase tracking-[0.25em] text-[var(--accent)] will-change-transform"
              >
                // {id}
              </p>
              <RevealText
                as="h2"
                text={title}
                mode="words"
                effect="mask"
                className="font-display text-3xl tracking-tight text-[var(--ink)] sm:text-4xl"
              />
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.15,
                }}
                className="mt-4 block h-px w-16 origin-left"
                style={{
                  background:
                    "linear-gradient(90deg, var(--accent), var(--accent-secondary))",
                }}
              />
              {subtitle ? (
                <RevealText
                  as="p"
                  text={subtitle}
                  mode="words"
                  effect="blur"
                  delay={0.08}
                  className="mt-4 max-w-2xl text-base text-[var(--ink-soft)]"
                />
              ) : null}
            </header>
          </ScrollReveal>
        )}
        {children}
      </div>
    </section>
  );
}
