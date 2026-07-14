import { useEffect, useRef } from "react";

/**
 * Fixed deep-space backdrop: twinkling starfield canvas + drifting aurora
 * blobs (violet / cyan / magenta) + fine grain + HUD scanlines.
 * Pure decoration — sits behind all content at z-0.
 */
export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Star = { x: number; y: number; r: number; phase: number; speed: number };
    let stars: Star[] = [];

    function resize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(160, Math.floor((width * height) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
      }));
    }

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let t = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const twinkle = reduceMotion
          ? 0.7
          : 0.45 + 0.55 * Math.sin(t * 0.001 * s.speed + s.phase);
        ctx.globalAlpha = Math.max(0, twinkle);
        ctx.fillStyle = "#e8e6ff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduceMotion) {
        t += 16;
        raf = requestAnimationFrame(draw);
      }
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.16 0.05 280), transparent), var(--void)",
        }}
      />

      {/* aurora blobs */}
      <div
        className="aurora-blob left-[-10%] top-[-10%] h-[55vw] w-[55vw] opacity-40"
        style={{ background: "var(--aurora-violet)" }}
      />
      <div
        className="aurora-blob right-[-15%] top-[10%] h-[45vw] w-[45vw] opacity-30"
        style={{ background: "var(--aurora-cyan)", animationDelay: "-8s" }}
      />
      <div
        className="aurora-blob bottom-[-20%] left-[20%] h-[50vw] w-[50vw] opacity-25"
        style={{ background: "var(--aurora-magenta)", animationDelay: "-16s" }}
      />

      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="scanline-overlay" />
      <div className="grain-overlay" />

      {/* vignette to keep edges/readability dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 40%, transparent 40%, oklch(0.04 0.02 280 / 0.55) 100%)",
        }}
      />
    </div>
  );
}
