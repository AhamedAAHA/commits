import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type CommitStat = {
  label: string;
  value: number;
  unit?: string;
};

type CommitCountStatsProps = {
  stats: readonly CommitStat[];
  className?: string;
};

function useCountUp(target: number, enabled: boolean, duration = 1200) {
  const [value, setValue] = useState(enabled ? 0 : target);
  const frame = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, enabled, duration]);

  return value;
}

function StatCell({
  stat,
  index,
  inView,
}: {
  stat: CommitStat;
  index: number;
  inView: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const count = useCountUp(stat.value, inView && !reduceMotion);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.45,
        delay: reduceMotion ? 0 : index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--overlay-base)]/20 px-4 py-5 sm:px-5 sm:py-6"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.06 130 / 0.55), transparent)",
        }}
        aria-hidden
      />
      <p className="font-display text-4xl tracking-tight text-[var(--ink)] sm:text-5xl">
        {count}
        <span className="ml-1 font-mono-ui text-sm font-normal text-[var(--ink-faint)]">
          {stat.unit ?? ""}
        </span>
      </p>
      <p className="font-mono-ui mt-2 text-[11px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
        {stat.label}
      </p>
    </motion.div>
  );
}

export function CommitCountStats({
  stats,
  className = "",
}: CommitCountStatsProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(Boolean(reduceMotion));

  useEffect(() => {
    if (reduceMotion || !ref.current) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div ref={ref} className={className || "mt-10 sm:mt-12"}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono-ui text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
            // impact
          </p>
          <h3 className="mt-1 font-display text-xl text-[var(--ink)] sm:text-2xl">
            Shipped in numbers
          </h3>
        </div>
        <p className="max-w-sm text-sm text-[var(--ink-soft)]">
          Snapshot metrics styled like a contribution / commits total —
          grounded in projects, events, certs, and tools on this site.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((stat, index) => (
          <StatCell
            key={stat.label}
            stat={stat}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
}
