import { motion, useReducedMotion } from "framer-motion";
import {
  Clock3,
  Sparkles,
  Terminal,
  WandSparkles,
} from "lucide-react";
import {
  cursorActivityMeta,
  cursorIntensity,
  cursorSessions,
} from "../data/cursorActivity";

const LEVEL_COLORS = [
  "oklch(0.22 0.02 130 / 0.45)",
  "oklch(0.45 0.05 130 / 0.55)",
  "oklch(0.58 0.07 130 / 0.7)",
  "oklch(0.68 0.09 130 / 0.85)",
  "oklch(0.76 0.1 130)",
] as const;

function IntensityGrid() {
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
      role="img"
      aria-label="Cursor coding intensity over recent weeks"
    >
      {cursorIntensity.map((level, i) => (
        <span
          key={i}
          className="aspect-square rounded-[3px]"
          style={{ background: LEVEL_COLORS[level] ?? LEVEL_COLORS[0] }}
          title={`Session density ${level}/4`}
        />
      ))}
    </div>
  );
}

export function CursorCodingActivity({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const meta = cursorActivityMeta;

  return (
    <div className={className || "mt-12 sm:mt-14"}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono-ui text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
            // cursor
          </p>
          <h3 className="mt-1 font-display text-xl text-[var(--ink)] sm:text-2xl">
            {meta.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
            {meta.subtitle}
          </p>
        </div>
      </div>

      <div className="hud-frame glass overflow-hidden rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-5 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[oklch(0.72_0.06_130_/0.35)] bg-[oklch(0.72_0.06_130_/0.12)] text-[oklch(0.82_0.08_130)]">
              <WandSparkles className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--ink-faint)]">
                  Agent-assisted builds
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.72_0.06_130_/0.35)] bg-[oklch(0.72_0.06_130_/0.12)] px-2.5 py-1 text-xs font-semibold text-[oklch(0.82_0.08_130)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.1_130)]" />
                  Cursor
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
                Sessions from Cursor Live, the Cursor Buildathon, and everyday
                agent pair-programming across shipped products.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[14rem]">
            {[
              { label: "Sessions", value: String(meta.totalSessions) },
              { label: "Agent hrs", value: meta.agentHours },
              { label: "Builds", value: String(meta.buildsShipped) },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[var(--line)] bg-[var(--overlay-base)]/25 px-3 py-2 text-center"
              >
                <p className="font-display text-lg text-[var(--ink)]">
                  {item.value}
                </p>
                <p className="font-mono-ui text-[10px] uppercase tracking-wider text-[var(--ink-faint)]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--overlay-base)]/20 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[var(--ink)]">
              Coding intensity
            </p>
            <p className="font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-faint)]">
              {meta.weekLabel}
            </p>
          </div>
          <IntensityGrid />
          <div className="mt-3 flex items-center justify-end gap-2 text-xs text-[var(--ink-faint)]">
            <span>Less</span>
            {LEVEL_COLORS.map((color, i) => (
              <span
                key={i}
                className="h-2.5 w-2.5 rounded-[2px]"
                style={{ background: color }}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--ink)]">
              Recent Cursor sessions
            </p>
            <p className="font-mono-ui text-xs uppercase tracking-wider text-[var(--ink-faint)]">
              {cursorSessions.length} logged
            </p>
          </div>

          <ol className="grid gap-3">
            {cursorSessions.map((session, index) => (
              <motion.li
                key={session.id}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <article className="group grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--overlay-base)]/20 p-4 transition hover:border-[oklch(0.72_0.06_130_/0.4)] hover:bg-[var(--surface-hover)] sm:grid-cols-[1fr_auto] sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-[oklch(0.72_0.06_130_/0.1)] text-[oklch(0.82_0.08_130)] transition group-hover:border-[oklch(0.72_0.06_130_/0.4)]">
                      {index % 2 === 0 ? (
                        <Terminal className="h-4 w-4" aria-hidden />
                      ) : (
                        <Sparkles className="h-4 w-4" aria-hidden />
                      )}
                    </span>
                    <div>
                      <h4 className="text-base font-semibold text-[var(--ink)]">
                        {session.title}
                      </h4>
                      <p className="mt-0.5 text-sm text-[oklch(0.78_0.06_130)]">
                        {session.project}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                        {session.summary}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {session.agentModes.map((mode) => (
                          <li
                            key={mode}
                            className="rounded-full border border-[var(--line)] bg-[var(--overlay-base)]/30 px-2.5 py-1 text-[11px] font-medium text-[var(--ink-soft)]"
                          >
                            {mode}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-end sm:justify-between sm:gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--ink-faint)]">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden />
                      {session.duration}
                    </span>
                    <span className="font-mono-ui text-[11px] uppercase tracking-wider text-[var(--ink-faint)]">
                      {session.when}
                    </span>
                  </div>
                </article>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
