import { useMemo } from "react";

interface ProjectVisualProps {
  title: string;
  stack: string[];
}

/** Small deterministic hash so each card gets a consistent, unique layout. */
function seedFrom(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = (h * 31 + title.charCodeAt(i)) >>> 0;
  }
  return h;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Node {
  x: number;
  y: number;
}

/** Generates a small constellation of connected nodes, unique per project. */
function useConstellation(title: string) {
  return useMemo(() => {
    const rand = mulberry32(seedFrom(title));
    const nodeCount = 7 + Math.floor(rand() * 4);
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: 8 + rand() * 84,
      y: 10 + rand() * 60,
    }));

    const edges: [Node, Node][] = [];
    for (let i = 0; i < nodes.length; i++) {
      const next = nodes[(i + 1) % nodes.length];
      edges.push([nodes[i], next]);
      if (rand() > 0.55) {
        const j = Math.floor(rand() * nodes.length);
        if (j !== i) edges.push([nodes[i], nodes[j]]);
      }
    }

    return { nodes, edges };
  }, [title]);
}

/**
 * Abstract, brand-neutral project header used instead of a screenshot
 * thumbnail: a generative node constellation + a faceted rotating 3D token,
 * unique per project, consistent across the grid.
 */
export function ProjectVisual({ title, stack }: ProjectVisualProps) {
  const { nodes, edges } = useConstellation(title);
  const featured = stack.slice(0, 3);

  return (
    <div className="showcase-card__media relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden border-b border-[var(--line)] bg-[var(--void-deep)]">
      <svg
        aria-hidden
        viewBox="0 0 100 70"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.4]"
      >
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="var(--line-strong)"
            strokeWidth="0.25"
          />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="0.9" fill="var(--accent)" opacity="0.7" />
        ))}
      </svg>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--accent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "var(--accent-secondary)" }}
      />

      {/* Faceted 3D token */}
      <div className="relative" style={{ perspective: "700px" }}>
        <div className="spin-3d relative h-16 w-16">
          <span className="absolute inset-0 rounded-2xl border border-[var(--accent-soft)] bg-[var(--surface-card-1)] shadow-[0_20px_44px_-16px_var(--shadow-soft)]" />
          <span
            className="absolute inset-[6px] rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)",
              opacity: 0.85,
              transform: "translateZ(6px)",
            }}
          />
          <span
            className="absolute inset-[6px] rounded-xl border border-[var(--accent-soft)]"
            style={{ transform: "rotateY(90deg) translateZ(6px)" }}
          />
        </div>
      </div>

      {featured.length > 0 ? (
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {featured.map((tech) => (
            <span
              key={tech}
              className="font-mono-ui rounded-full border border-[var(--line)] bg-[var(--void)]/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--ink-soft)] backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
