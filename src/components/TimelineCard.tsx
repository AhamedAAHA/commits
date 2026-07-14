import { ExternalLink } from "lucide-react";
import { useTilt } from "../lib/useTilt";

interface TimelineCardProps {
  title: string;
  subtitle: string;
  period: string;
  bullets?: readonly string[];
  links?: readonly { label: string; href: string }[];
}

export function TimelineCard({
  title,
  subtitle,
  period,
  bullets,
  links,
}: TimelineCardProps) {
  const tilt = useTilt(4);

  return (
    <article
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="glass glass-hover spotlight-card hud-frame rounded-3xl p-5 [transform-style:preserve-3d] sm:p-6"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--ink)]">{title}</h3>
          <p className="text-sm font-medium text-[var(--accent)]">{subtitle}</p>
        </div>
        <p className="mt-1 shrink-0 text-xs font-medium uppercase tracking-wider text-[var(--ink-faint)] sm:mt-0 sm:text-right">
          {period}
        </p>
      </div>
      {bullets && bullets.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-[var(--line)] pt-4">
          {bullets.map((bullet, bulletIndex) => (
            <li
              key={`${bullet}-${bulletIndex}`}
              className="flex gap-2 text-sm leading-relaxed text-[var(--ink-soft)]"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_10px_oklch(0.81_0.15_290/0.75)]"
                aria-hidden
              />
              <span className="min-w-0 flex-1">{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {links && links.length > 0 ? (
        <div className={`flex flex-wrap gap-2 ${bullets?.length ? "mt-4" : "mt-4 border-t border-[var(--line)] pt-4"}`}>
          {links.map((link, linkIndex) => (
            <a
              key={`${link.href}-${linkIndex}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[oklch(0.81_0.15_290_/0.26)] bg-[var(--accent-soft)] px-3 py-2 text-xs font-semibold text-[var(--accent)] transition hover:border-[oklch(0.81_0.15_290_/0.46)] hover:bg-[oklch(0.7_0.15_290_/0.18)]"
            >
              {link.label}
              <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden />
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
