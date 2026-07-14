import { useTilt } from "../../lib/useTilt";
import { PortraitAccent } from "./PortraitAccent";

type ProfilePortraitProps = {
  src: string;
  alt: string;
};

export function ProfilePortrait({ src, alt }: ProfilePortraitProps) {
  const tilt = useTilt<HTMLDivElement>(7);

  return (
    <div className="group relative mx-auto w-full max-w-[280px] sm:max-w-xs lg:max-w-sm">
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="relative aspect-[3/4] w-full [transform-style:preserve-3d]"
      >
        <div
          className="absolute -inset-3 rounded-[2rem] opacity-70 blur-2xl transition-opacity duration-300 group-hover:opacity-95"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.22 293 / 0.3), oklch(0.8 0.15 205 / 0.22))",
          }}
          aria-hidden
        />

        <div className="hud-frame glass relative h-full overflow-hidden rounded-[2rem] shadow-[0_34px_72px_-30px_oklch(0.02_0.02_280/0.85)]">
          <img
            src={src}
            alt={alt}
            width={400}
            height={533}
            className="h-full w-full object-cover object-top"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.06_0.02_280_/0.65)] via-transparent to-transparent"
            aria-hidden
          />
        </div>

        <div className="pointer-events-none absolute -right-2 -top-2 h-24 w-24 sm:h-28 sm:w-28">
          <PortraitAccent className="h-full w-full drop-shadow-[0_0_24px_oklch(0.72_0.19_290/0.32)]" />
        </div>
      </div>
    </div>
  );
}
