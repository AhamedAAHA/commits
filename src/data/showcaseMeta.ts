import type { ExperienceItem, Project } from "./siteContent";

function slugFromTitle(title: string): string {
  return title.split(/[-–|]/)[0]?.trim().toLowerCase().replace(/\s+/g, "-") ?? "";
}

export const PROJECT_META: Record<
  string,
  Pick<Project, "id" | "summary" | "thumbnail" | "featured" | "featuredOrder" | "journeyId">
> = {
  neuroloom: {
    id: "neuroloom",
    summary:
      "Nine Gemma agents on AMD for family care — meds, handoffs, documents, and emergencies.",
    thumbnail: "/thumbnails/neuroloom.jpg",
    featured: true,
    featuredOrder: 1,
    journeyId: "neuroloom",
  },
  aria: {
    id: "aria",
    summary:
      "AI job platform with voice CV upload, explainable matching, and Kanban tracking.",
    thumbnail: "/thumbnails/aria.jpg",
    featured: true,
    featuredOrder: 2,
    journeyId: "aria",
  },
  kagent: {
    id: "kagent",
    summary:
      "Life situations become complete Kapruka carts via a seven-agent shopping swarm.",
    thumbnail: "/thumbnails/kagent.jpg",
    featured: true,
    featuredOrder: 3,
    journeyId: "kagent",
  },
  adgpt: {
    id: "adgpt",
    summary:
      "Turns static ads and scripts into 15–30 second vertical videos for Reels, TikTok, and YouTube Shorts with Remotion export.",
    thumbnail: "/thumbnails/adgpt.jpg",
    journeyId: "adgpt",
  },
  cyanidex: {
    id: "cyanidex",
    summary:
      "Cyber threat forecasting OS with OSINT collection, AI risk analysis, voice intelligence, and a 3D global threat globe.",
    thumbnail: "/thumbnails/cyanidex.jpg",
    journeyId: "cyanidex",
  },
  sentra: {
    id: "sentra",
    summary:
      "Live GTM intelligence OS with verified competitor research, executive briefings, and evidence-linked insights.",
    thumbnail: "/thumbnails/sentra.jpg",
    journeyId: "sentra",
  },
  santra: {
    id: "santra",
    summary:
      "Startup intelligence OS for founders covering idea validation, competitor analysis, GTM execution, and watchlists.",
    thumbnail: "/thumbnails/santra.jpg",
    journeyId: "santra",
  },
  suzie: {
    id: "suzie",
    summary:
      "Global intelligence OS that monitors world events, supply chains, and geopolitical risk with AI briefings and 3D globe views.",
    thumbnail: "/thumbnails/suzie.jpg",
    journeyId: "suzie",
  },
  "neural-ops": {
    id: "neural-ops",
    summary:
      "Enterprise incident command platform with 20+ AI agents, Band SDK collaboration, evidence chains, and approval workflows.",
    thumbnail: "/thumbnails/neural-ops.jpg",
    journeyId: "neural-ops",
  },
  deebug: {
    id: "deebug",
    summary:
      "Digital twin quantity surveying platform that converts drawings to BOQs, 3D views, and live construction intelligence.",
    thumbnail: "/thumbnails/deebug.jpg",
    journeyId: "deebug",
  },
  lumora: {
    id: "lumora",
    summary:
      "Voice-first AI interview platform with PIN access, CV analysis, structured evaluations, and ElevenLabs voice delivery.",
    thumbnail: "/thumbnails/lumora.jpg",
    journeyId: "lumora",
  },
  gesturemed: {
    id: "gesturemed",
    summary:
      "Sign-to-speech healthcare platform with MediaPipe gestures, multilingual medical output, and emergency alerts.",
    thumbnail: "/thumbnails/gesturemed.jpg",
    journeyId: "gesturemed",
  },
  "smart-study-companion": {
    id: "smart-study-companion",
    summary:
      "AI learning platform for Sri Lankan students with PDF summaries, flashcards, Tamil voice lessons, and mock viva practice.",
    thumbnail: "/thumbnails/smart-study-companion.jpg",
    journeyId: "smart-study-companion",
  },
  bismi: {
    id: "bismi",
    summary:
      "3D tuition management hub with Admin, Student, and Parent portals, attendance, MCQ tests, fees, and AI study assistant.",
    thumbnail: "/thumbnails/bismi.jpg",
    journeyId: "bismi",
  },
  aerospace: {
    id: "aerospace",
    summary:
      "Aviation intelligence command center with live flight tracking, seat scoring, delay prediction, and AI copilot agents.",
    thumbnail: "/thumbnails/aerospace.jpg",
    journeyId: "aerospace",
  },
  torquex: {
    id: "torquex",
    summary:
      "Gesture-controlled 3D car showroom using webcam hand tracking for navigation, customization, and environment switching.",
    thumbnail: "/thumbnails/torquex.jpg",
    journeyId: "torquex",
  },
  "golden-fork": {
    id: "golden-fork",
    summary:
      "Multi-role restaurant system with orders, reservations, payments, menu management, and operational reporting.",
    thumbnail: "/thumbnails/golden-fork.jpg",
    journeyId: "golden-fork",
  },
  raillink: {
    id: "raillink",
    summary:
      "Train booking system with passenger, staff, and admin roles, transactional seats, PDF tickets, and live SSE schedules.",
    thumbnail: "/thumbnails/raillink.jpg",
    journeyId: "raillink",
  },
  inkspire: {
    id: "inkspire",
    summary:
      "Online bookstore with browsing, cart, orders, admin inventory, and session-based persistence using Java MVC.",
    thumbnail: "/thumbnails/inkspire.jpg",
    journeyId: "inkspire",
  },
  portfolio: {
    id: "portfolio",
    summary:
      "Personal developer portfolio with featured projects, project journeys, skills matrix, and live GitHub activity.",
    thumbnail: "/thumbnails/portfolio.jpg",
    journeyId: "portfolio",
  },
};

const TITLE_TO_META_KEY: Record<string, keyof typeof PROJECT_META> = {
  Neuroloom: "neuroloom",
  "Neuroloom - Family Care Command Center": "neuroloom",
  Aria: "aria",
  "Aria - AI-Powered Job Application Platform": "aria",
  KAgent: "kagent",
  "KAgent - Sri Lanka's AI Life Shopping Concierge": "kagent",
  AdGPT: "adgpt",
  "AdGPT - AI Creative Studio for Short-Form Video Ads": "adgpt",
  CyanideX: "cyanidex",
  "CyanideX - AI-Powered Cyber Threat Forecasting & Intelligence OS": "cyanidex",
  "Sentra AI": "sentra",
  "Sentra AI - Live GTM Intelligence OS": "sentra",
  "SANTRA AI": "santra",
  "SANTRA AI - Startup Intelligence OS": "santra",
  "SUZIE AI": "suzie",
  "SUZIE AI - Global Intelligence Operating System": "suzie",
  "Neural OPS": "neural-ops",
  "Neural OPS - Enterprise Risk & Incident Operations": "neural-ops",
  DeeBug: "deebug",
  "DeeBug - Digital Twin Quantity Surveying Platform": "deebug",
  Lumora: "lumora",
  "Lumora - AI Interview Platform": "lumora",
  GestureMed: "gesturemed",
  "GestureMed - AI Powered (Sign to Speech) Healthcare Platform": "gesturemed",
  "Smart Study Companion": "smart-study-companion",
  Bismi: "bismi",
  "Bismi - 3D Education Hub": "bismi",
  AeroSpace: "aerospace",
  "AeroSpace (AERIS X) - Aviation Intelligence OS": "aerospace",
  "TorqueX AI": "torquex",
  "TorqueX AI - GestureDrive 3D Showroom": "torquex",
  "Golden Fork": "golden-fork",
  "Golden Fork Restaurant Management System": "golden-fork",
  RailLink: "raillink",
  InkSpire: "inkspire",
  "InkSpire BookStore": "inkspire",
  Portfolio: "portfolio",
  "Portfolio - Personal Developer Portfolio": "portfolio",
};

export const HACKATHON_META: Record<
  string,
  Pick<ExperienceItem, "id" | "summary" | "featured" | "featuredOrder">
> = {
  "amd-act-ii": {
    id: "amd-act-ii",
    summary: "Nine Gemma agents on AMD GPUs for family care coordination.",
    featured: true,
    featuredOrder: 1,
  },
  "h0-aria": {
    id: "h0-aria",
    summary: "AI job platform on Vercel v0 and Aurora PostgreSQL.",
    featured: true,
    featuredOrder: 2,
  },
  "kapruka-kagent": {
    id: "kapruka-kagent",
    summary: "7-agent shopping swarm on the Kapruka MCP.",
    featured: true,
    featuredOrder: 3,
  },
  "band-agents": {
    id: "band-agents",
    summary: "Multi-agent collaboration with Band task handoff.",
  },
  "cursor-adgpt": {
    id: "cursor-adgpt",
    summary: "2-hour live build — static ads to short-form video.",
  },
  "cursor-buildathon": {
    id: "cursor-buildathon",
    summary: "Smart Study Companion for Sri Lankan students.",
  },
  "lablab-sentra": {
    id: "lablab-sentra",
    summary: "Sentra AI — live GTM intelligence with verified web data.",
  },
  meetups: {
    id: "meetups",
    summary: "Local meetups for tools, practice, and networking.",
  },
};

const HACKATHON_ROLE_TO_KEY: Record<string, keyof typeof HACKATHON_META> = {
  "AMD ACT II (Neuroloom)": "amd-act-ii",
  "AMD ACT II — Unicorn Track (Neuroloom)": "amd-act-ii",
  "AMD Developer Hackathon: ACT II - Unicorn Track (Neuroloom)": "amd-act-ii",
  "Hack the Zero Stack (Aria)": "h0-aria",
  "H0: Hack the Zero Stack with Vercel v0 and AWS Databases": "h0-aria",
  "Kapruka Challenge (KAgent)": "kapruka-kagent",
  "Kapruka Agent Challenge (KAgent)": "kapruka-kagent",
  "Kapruka Agent Challenge - AI Life Shopping Concierge": "kapruka-kagent",
  "Band of Agents": "band-agents",
  "Band of Agents — Enterprise Multi-Agent": "band-agents",
  "Band of Agents Hackathon - Enterprise Multi-Agent Systems": "band-agents",
  "Band of Agents Hackathon - Enterprise Multi-Agent Systems (In Progress)":
    "band-agents",
  "Cursor Live (AdGPT)": "cursor-adgpt",
  "Cursor Live Sri Lanka (AdGPT)": "cursor-adgpt",
  "Build with Cursor Live Sri Lanka - Live Build #1": "cursor-adgpt",
  "Cursor Buildathon (7th)": "cursor-buildathon",
  "Cursor Buildathon — ElevenLabs (7th)": "cursor-buildathon",
  "Cursor 24h Buildathon - ElevenLabs Track (7th Place)": "cursor-buildathon",
  "LabLab WebData (17th)": "lablab-sentra",
  "LabLab WebData — AI Apps (17th)": "lablab-sentra",
  "LabLab WebData - AI Applications (17th Place)": "lablab-sentra",
  "Developer Meetups": "meetups",
  "Developer Community Meetups": "meetups",
};

export function enrichProject(project: Project): Project {
  const fromTitle = TITLE_TO_META_KEY[project.title];
  const fromSlug = slugFromTitle(project.title);
  const key = project.id
    ? (project.id as keyof typeof PROJECT_META)
    : fromTitle ??
      (fromSlug in PROJECT_META
        ? (fromSlug as keyof typeof PROJECT_META)
        : undefined);
  const meta = key ? PROJECT_META[key] : undefined;
  const id = project.id ?? meta?.id ?? slugFromTitle(project.title);
  return {
    ...meta,
    ...project,
    id,
    summary: project.summary ?? meta?.summary,
    thumbnail: project.thumbnail ?? meta?.thumbnail,
    // Prefer admin/localStorage featured flags over hardcoded meta defaults.
    featured: project.featured ?? meta?.featured,
    featuredOrder: project.featuredOrder ?? meta?.featuredOrder,
    journeyId: project.journeyId ?? meta?.journeyId ?? id,
  };
}

export function enrichHackathon(entry: ExperienceItem): ExperienceItem {
  const key = entry.id
    ? (entry.id as keyof typeof HACKATHON_META)
    : HACKATHON_ROLE_TO_KEY[entry.role];
  const meta = key ? HACKATHON_META[key] : undefined;
  const id = entry.id ?? meta?.id ?? slugFromTitle(entry.role);
  return {
    ...meta,
    ...entry,
    id,
    summary: entry.summary ?? meta?.summary,
    featured: entry.featured ?? meta?.featured,
    featuredOrder: entry.featuredOrder ?? meta?.featuredOrder,
  };
}

export function enrichJourney(entry: ExperienceItem): ExperienceItem {
  const id = entry.id ?? slugFromTitle(entry.role);
  return { ...entry, id };
}

export function enrichProjects(projects: Project[]): Project[] {
  return projects.map(enrichProject);
}

export function enrichHackathons(entries: ExperienceItem[]): ExperienceItem[] {
  return entries.map(enrichHackathon);
}

export function enrichJourneys(entries: ExperienceItem[]): ExperienceItem[] {
  return entries.map(enrichJourney);
}
