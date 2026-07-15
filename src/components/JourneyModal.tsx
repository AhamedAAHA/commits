import type { ExperienceItem } from "../data/siteContent";
import { ShowcaseModal } from "./ShowcaseModal";

interface JourneyModalProps {
  journey: ExperienceItem;
  onClose: () => void;
}

export function JourneyModal({ journey, onClose }: JourneyModalProps) {
  return (
    <ShowcaseModal
      title={journey.role}
      subtitle={journey.period || undefined}
      onClose={onClose}
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--ink-faint)]">
            Context
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{journey.company}</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--ink-faint)]">
            Project journey
          </h3>
          <ul className="mt-3 space-y-3">
            {journey.highlights.map((bullet, index) => (
              <li
                key={`${bullet}-${index}`}
                className="flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--overlay-base)]/20 p-4 text-sm leading-relaxed text-[var(--ink-soft)]"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_10px_oklch(0.81_0.15_258/0.75)]"
                  aria-hidden
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </section>

        {journey.technologies ? (
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--ink-faint)]">
              Main technologies
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
              {journey.technologies}
            </p>
          </section>
        ) : null}

        {journey.apis ? (
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--ink-faint)]">
              APIs used
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{journey.apis}</p>
          </section>
        ) : null}
      </div>
    </ShowcaseModal>
  );
}
