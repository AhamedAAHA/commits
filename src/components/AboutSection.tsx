import { useTilt } from "../lib/useTilt";
import { ScrollReveal } from "./animations/ScrollReveal";
import { StaggerReveal } from "./animations/StaggerReveal";

interface Stat {
  label: string;
  value: string;
}

interface AboutSectionProps {
  summary: string;
  stats: Stat[];
}

function StatCard({ stat }: { stat: Stat }) {
  const tilt = useTilt<HTMLDivElement>(6);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="glass glass-hover spotlight-card hud-frame flex flex-col gap-1 rounded-2xl p-4 [transform-style:preserve-3d] sm:p-5"
    >
      <span className="font-display text-3xl text-[var(--ink)] sm:text-4xl">
        {stat.value}
      </span>
      <span className="font-mono-ui text-[11px] uppercase tracking-widest text-[var(--ink-faint)]">
        {stat.label}
      </span>
    </div>
  );
}

export function AboutSection({ summary, stats }: AboutSectionProps) {
  const paragraphs = summary
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const [lead, ...rest] = paragraphs;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
      <ScrollReveal>
        <div className="hud-frame glass rounded-3xl p-6 sm:p-8">
          {lead ? (
            <p className="font-display text-xl leading-snug text-[var(--ink)] sm:text-2xl">
              {lead}
            </p>
          ) : null}
          {rest.length > 0 ? (
            <div className="mt-5 space-y-4 border-t border-[var(--line)] pt-5">
              {rest.map((p, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg"
                >
                  {p}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </ScrollReveal>

      <StaggerReveal className="grid grid-cols-2 gap-3 sm:gap-4 lg:content-start">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </StaggerReveal>
    </div>
  );
}
