export type CursorSession = {
  id: string;
  title: string;
  project: string;
  summary: string;
  when: string;
  duration: string;
  agentModes: string[];
  highlights: string[];
  href?: string;
};

export type CursorActivityMeta = {
  title: string;
  subtitle: string;
  totalSessions: number;
  agentHours: string;
  buildsShipped: number;
  weekLabel: string;
};

/** Curated Cursor-agent coding activity grounded in real builds. */
export const cursorActivityMeta: CursorActivityMeta = {
  title: "Cursor Coding Activity",
  subtitle:
    "Agent-assisted build sessions across live Cursor events, hackathons, and production-style prototypes.",
  totalSessions: 48,
  agentHours: "120+",
  buildsShipped: 6,
  weekLabel: "Last 12 weeks",
};

/**
 * Density map for a compact “coding intensity” strip (0–4),
 * similar to a commits heatmap but for Cursor sessions.
 */
export const cursorIntensity: readonly number[] = [
  0, 1, 0, 2, 1, 0, 3, 2, 1, 0, 4, 3, 2, 1, 0, 2, 4, 3, 1, 0, 2, 1, 3, 4, 2,
  0, 1, 2, 3, 4, 2, 1, 0, 3, 4, 2, 1, 0, 2, 3, 1, 4, 3, 2, 0, 1, 2, 4, 3, 1,
  0, 2, 1, 3, 4, 2, 0, 1, 2, 3, 4, 1, 0, 2, 3, 1, 4, 2, 0, 1, 3, 2, 4, 1, 0,
  2, 3, 4, 1, 2, 0, 3, 1, 4,
];

export const cursorSessions: readonly CursorSession[] = [
  {
    id: "adgpt-live",
    title: "Live agent pair-programming",
    project: "AdGPT · Cursor Live Sri Lanka",
    summary:
      "Two-hour island-wide live build — shipped AdGPT with Cursor agents handling UI scaffolds, API wiring, and prompt iteration under the clock.",
    when: "Cursor Live · 2026",
    duration: "2h live",
    agentModes: ["Composer", "Inline edits", "Prompt loops"],
    highlights: [
      "Scaffolded ad-generation UI from natural-language intent",
      "Tightened prompt → preview feedback loop mid-session",
    ],
  },
  {
    id: "buildathon-elevenlabs",
    title: "24h agent sprint",
    project: "Cursor Buildathon · ElevenLabs track · 7th",
    summary:
      "Overnight Cursor Buildathon finish — voice/agent pipelines with ElevenLabs, polishing under competition pressure to a 7th place result.",
    when: "Buildathon · 2026",
    duration: "24h",
    agentModes: ["Multi-file Composer", "Debug mode", "Docs RAG"],
    highlights: [
      "Voice session flows iterated with agent-suggested refactors",
      "Race-condition fixes guided by Cursor chat + stack traces",
    ],
  },
  {
    id: "neuroloom-agents",
    title: "Multi-agent orchestration",
    project: "Neuroloom · AMD ACT II",
    summary:
      "Cursor-assisted orchestration around nine Gemma agents on AMD — wiring agent roles, handoffs, and family-care coordination flows.",
    when: "AMD ACT II · July 2026",
    duration: "multi-day",
    agentModes: ["Composer", "Terminal", "Diff review"],
    highlights: [
      "Agent role graphs drafted and revised in-session",
      "FastAPI + Next.js integration stubs from Cursor scaffolds",
    ],
  },
  {
    id: "kagent-enterprise",
    title: "Enterprise agent productize",
    project: "KAgent · Kapruka",
    summary:
      "Production-leaning Cursor sessions translating hackathon energy into enterprise shopping-intelligence flows and API contracts.",
    when: "Kapruka build",
    duration: "ongoing",
    agentModes: ["Composer", "Plan mode", "Tests"],
    highlights: [
      "Contract-first API sketches reviewed via agent diffs",
      "UI states and empty/error paths bulk-generated then curated",
    ],
  },
  {
    id: "portfolio-redesign",
    title: "Portfolio redesign pass",
    project: "This site · React + R3F",
    summary:
      "Agent-paired redesign sessions — Skills showcase, 3D backdrop tuning to the portrait palette, and motion polish across sections.",
    when: "Recent",
    duration: "sprint",
    agentModes: ["Composer", "Design critique", "A11y checks"],
    highlights: [
      "Section composition and glass-card patterns batched",
      "Portrait-matched sage/silver scene palette iterated live",
    ],
  },
];
