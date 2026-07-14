import type { ExperienceItem } from "../data/siteContent";
import { experienceSummary } from "../lib/showcaseHelpers";
import { useTilt } from "../lib/useTilt";

interface HackathonCardProps {
  entry: ExperienceItem;
  compact?: boolean;
}

const DISPLAY_HIGHLIGHTS = 2;

export function HackathonCard({ entry }: HackathonCardProps) {
  const visibleHighlights = entry.highlights.slice(0, DISPLAY_HIGHLIGHTS);
  const summary = experienceSummary(entry);
  const tilt = useTilt(5);

  return (
    <article
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="showcase-card showcase-card-hover spotlight-card hud-frame flex h-full flex-col rounded-3xl p-5 [transform-style:preserve-3d] sm:p-6"
    >
      <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-[oklch(0.78_0.11_290)]">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
          aria-hidden
        />
        {entry.period}
      </p>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-[var(--ink)]">
        {entry.role}
      </h3>
      <p className="mt-1 text-sm font-medium text-[var(--ink-faint)]">{entry.company}</p>
      <p className="mt-3 min-h-[2.75rem] text-sm leading-relaxed text-[var(--ink-soft)]">
        {summary}
      </p>

      <ul className="mt-4 flex min-h-[4.5rem] flex-1 flex-col space-y-2 border-t border-[var(--line)] pt-4">
        {visibleHighlights.map((bullet, bulletIndex) => (
          <li
            key={`${bullet}-${bulletIndex}`}
            className="flex gap-2 text-sm leading-relaxed text-[var(--ink-soft)]"
          >
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
              aria-hidden
            />
            <span className="min-w-0 flex-1">{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
