interface TechMarqueeProps {
  items: readonly string[];
}

export function TechMarquee({ items }: TechMarqueeProps) {
  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-[var(--line)] bg-[var(--overlay-base)]/15 py-3"
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--void)] to-transparent sm:w-28"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--void)] to-transparent sm:w-28"
        aria-hidden
      />
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-mono-ui flex items-center gap-3 whitespace-nowrap px-6 text-xs uppercase tracking-[0.2em] text-[var(--ink-faint)]"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
          </span>
        ))}
      </div>
    </div>
  );
}
