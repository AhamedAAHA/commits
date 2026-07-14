/** CSS-only portrait accent with no runtime JSON or evaluation. */
type PortraitAccentProps = {
  className?: string;
};

export function PortraitAccent({ className = "" }: PortraitAccentProps) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <span className="absolute inset-4 rounded-full bg-[oklch(0.81_0.15_290_/0.14)] blur-xl" />
      <span className="absolute inset-6 rounded-full border border-[oklch(0.81_0.15_290_/0.3)]" />
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] shadow-[0_0_28px_oklch(0.81_0.15_290/0.55)]" />
      <span className="absolute inset-2 rounded-full border border-white/15 motion-safe:animate-[spin_14s_linear_infinite]" />
    </div>
  );
}
