import { useLayoutEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "../lib/gsapSetup";
import { ScrollReveal } from "./animations/ScrollReveal";
import { RevealText } from "./animations/RevealText";

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Section({ id, title, subtitle, children }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        glowRef.current,
        { y: -80 },
        {
          y: 80,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
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
      id={id}
      ref={sectionRef}
      className="relative scroll-mt-20 overflow-hidden px-4 py-14 sm:scroll-mt-28 sm:px-6 sm:py-16 lg:px-8"
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[620px] -translate-x-1/2 rounded-full opacity-[0.09] blur-[100px]"
        style={{ background: "var(--accent)" }}
      />
      <div className="relative mx-auto max-w-5xl">
        <ScrollReveal>
          <header className="mb-8 sm:mb-12">
            <p className="font-mono-ui mb-3 text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
              // {id}
            </p>
            <RevealText
              as="h2"
              text={title}
              className="font-display text-3xl tracking-tight text-[var(--ink)] sm:text-4xl"
            />
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="mt-4 block h-px w-16 origin-left"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent), var(--accent-secondary))",
              }}
            />
            {subtitle ? (
              <p className="mt-4 max-w-2xl text-base text-[var(--ink-soft)]">
                {subtitle}
              </p>
            ) : null}
          </header>
        </ScrollReveal>
        {children}
      </div>
    </section>
  );
}
