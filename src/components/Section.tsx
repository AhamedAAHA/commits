import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "./animations/ScrollReveal";
import { RevealText } from "./animations/RevealText";

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 px-4 py-14 sm:scroll-mt-28 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <header className="mb-8 sm:mb-12">
            <p className="font-mono-ui mb-3 text-xs uppercase tracking-[0.25em] text-[var(--aurora-cyan)]">
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
                  "linear-gradient(90deg, var(--aurora-violet), var(--aurora-cyan))",
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
