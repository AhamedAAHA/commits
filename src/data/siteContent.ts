import profileImage from "../../1.jpg";
import { projectJourneys } from "./projectJourneys";

export interface NavItem {
  id: string;
  label: string;
}

export type SocialIcon = "linkedin" | "github";

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id?: string;
  title: string;
  context: string;
  description: string;
  summary?: string;
  thumbnail?: string;
  featured?: boolean;
  featuredOrder?: number;
  journeyId?: string;
  stack: string[];
  links: ProjectLink[];
}

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  period: string;
  highlights: string[];
  summary?: string;
  thumbnail?: string;
  featured?: boolean;
  featuredOrder?: number;
  links?: ProjectLink[];
  technologies?: string;
  apis?: string;
}

export interface EducationItem {
  qualification: string;
  institution: string;
  period: string;
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface GitHubActivity {
  username: string;
  profileUrl: string;
}

const siteUrl =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://ahamed-4e0q.onrender.com";

export const siteContent = {
  siteUrl,
  cvPdfPath: `${import.meta.env.BASE_URL}cv/Ahamed_AAH.pdf`,

  nav: [
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "hackathons", label: "Hackathons" },
    { id: "education", label: "Education" },
    { id: "activity", label: "Activity" },
    { id: "contact", label: "Contact" },
  ] satisfies NavItem[],

  hero: {
    name: "Ahamed AAH",
    title: "Software Engineering Undergraduate | Hackathon Builder Building AI agents, and automation solutions for real-world challenges",
    tagline: "LabLab WebData (17th) · KAgent (Kapruka) · Cursor Buildathon (7th)",
    location: "Kalubowila, Sri Lanka",
    profileImage,
  },

  summary:
    "Software Engineering undergraduate at SLIIT (Year 3) building full-stack and AI-powered products — from educational platforms to enterprise intelligence and healthcare accessibility tools.\n\nI work across React, Next.js, FastAPI, Node.js, Spring Boot, PostgreSQL, MongoDB, Aurora, and Supabase, integrating Gemma, OpenAI, Bright Data, ElevenLabs, Speechmatics, and MediaPipe into production-style applications. Recent highlights include Neuroloom at AMD Developer Hackathon ACT II (Unicorn Track, Gemma on AMD), Aria at Hack the Zero Stack, KAgent for Kapruka, AdGPT at Cursor Live Sri Lanka, 7th place at the Cursor Buildathon, and 17th of 294 at LabLab WebData (Sentra AI).\n\nFocused on multi-agent systems, family care, edtech, GTM intelligence, accessible healthcare, and hiring automation. Always open to internships, collaborations, and hackathon teams.",

  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/hubaib-ahamed-a67732351/",
      icon: "linkedin",
    },
    {
      label: "GitHub",
      href: "https://github.com/AhamedAAHA/AhamedAAHA",
      icon: "github",
    },
  ] satisfies SocialLink[],

  githubActivity: {
    username: "AhamedAAHA",
    profileUrl: "https://github.com/AhamedAAHA",
  } satisfies GitHubActivity,

  hackathons: [
    {
      role: "AMD ACT II (Neuroloom)",
      company: "lablab.ai · AMD · Unicorn Track · Prompt Pirates 2",
      period: "July 2026 · Submitted Neuroloom",
      summary: "Nine Gemma agents on AMD GPUs for family care coordination.",
      highlights: [
        "Shipped Neuroloom on AMD Developer Cloud with ROCm + vLLM.",
        "Dockerized multi-agent care circle with Fireworks fallback.",
      ],
    },
    {
      role: "Hack the Zero Stack (Aria)",
      company: "Devpost · Vercel · AWS",
      period: "June 2026 · Shipped Aria",
      summary: "AI job platform on Vercel v0 and Aurora PostgreSQL.",
      highlights: [
        "CV parsing, explainable matching, and Kanban tracking.",
        "AWS Cognito, S3, SES, and Vercel Cron in production flow.",
      ],
    },
    {
      role: "Kapruka Challenge (KAgent)",
      company: "Kapruka Holdings · Sri Lanka",
      period: "May–June 2026 · Shipped KAgent",
      summary: "7-agent shopping swarm on the Kapruka MCP.",
      highlights: [
        "Life situations become complete carts in real time.",
        "Festival intelligence and 3-tier bundle recommendations.",
      ],
    },
    {
      role: "Band of Agents",
      company: "Band · Codeband · Enterprise multi-agent",
      period: "June 2026 · In progress",
      summary: "Multi-agent collaboration with Band task handoff.",
      highlights: [
        "3+ agents coordinating planning and execution.",
        "Enterprise workflows with shared context and review.",
      ],
    },
    {
      role: "Cursor Live (AdGPT)",
      company: "Cursor Live Sri Lanka · Island-wide build",
      period: "June 2026 · Shipped AdGPT",
      summary: "2-hour live build — static ads to short-form video.",
      highlights: [
        "Upload → storyboard → Remotion MP4 export.",
        "Shipped live alongside teams across Sri Lanka.",
      ],
    },
    {
      role: "Cursor Buildathon (7th)",
      company: "Sri Lanka · ElevenLabs track · 24-hour",
      period: "24h Buildathon · 7th place",
      summary: "Smart Study Companion for Sri Lankan students.",
      highlights: [
        "PDF summaries, flashcards, and Tamil voice lessons.",
        "7th place on the ElevenLabs track.",
      ],
    },
    {
      role: "LabLab WebData (17th)",
      company: "International · San Francisco · Virtual",
      period: "5-day hackathon · 17th of 294",
      summary: "Sentra AI — live GTM intelligence with verified web data.",
      highlights: [
        "Competitor research with evidence-linked briefings.",
        "Bright Data + AIML + Supabase on Next.js.",
      ],
    },
    {
      role: "Developer Meetups",
      company: "OpenClaw · GitHub Dev Meetup",
      period: "Community · Participant",
      summary: "Local meetups for tools, practice, and networking.",
      highlights: [
        "OpenClaw and GitHub Dev community sessions.",
        "Stayed current with builder workflows.",
      ],
    },
  ] satisfies ExperienceItem[],

  projects: [
    {
      title: "Neuroloom",
      context: "AMD Developer Hackathon ACT II | Unicorn Track · Gemma on AMD",
      description:
        "Family Care Command Center — multi-agent workspace where caregivers coordinate medications, handoffs, documents, check-ins, and emergencies. Nine Gemma agents on AMD GPUs (ROCm + vLLM), with Fireworks fallback, live agent feed, care knowledge graph, Senior View, and Emergency Pack. Care coordination only — not medical advice.",
      stack: [
        "Next.js",
        "FastAPI",
        "LangGraph",
        "PostgreSQL",
        "Redis",
        "MinIO",
        "Gemma",
        "AMD ROCm",
        "vLLM",
        "Docker",
        "WebSockets",
      ],
      links: [
        { label: "Live App", href: "https://web-three-sable-48.vercel.app/" },
        { label: "Lablab", href: "https://lablab.ai/" },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/neuroloom" },
      ],
    },
    {
      title: "Aria",
      context: "Devpost · Hack the Zero Stack | Vercel v0 + AWS · #H0Hackathon",
      description:
        "AI-powered job application platform — voice or upload CV extraction, explainable job matching, tailored CVs and cover letters, PDF export, and Kanban tracking from sent to offer.",
      stack: [
        "Next.js 16",
        "React 19",
        "Aurora PostgreSQL",
        "AWS Cognito",
        "AWS S3",
        "AWS SES",
        "Vercel Cron",
        "GPT-4o",
        "Speechmatics",
        "Bright Data",
      ],
      links: [
        { label: "Live App", href: "https://aria-zeta-virid.vercel.app" },
        { label: "Devpost", href: "https://h01.devpost.com/" },
        {
          label: "Demo Video",
          href: "https://youtu.be/2bKSs4F6nfk?si=nddX_YtWe1xGADOD",
        },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/Aria" },
      ],
    },
    {
      title: "KAgent",
      context: "Kapruka Agent Challenge | Multi-Agent Shopping",
      description:
        "Sri Lanka's AI life shopping concierge — turns life situations into complete Kapruka carts via a 7-agent swarm, with festival intelligence and Budget / Recommended / Complete bundles.",
      stack: [
        "Next.js 14",
        "TypeScript",
        "Tailwind CSS",
        "Framer Motion",
        "Anthropic Claude",
        "Zustand",
      ],
      links: [
        { label: "Live App", href: "https://kagent-nine.vercel.app" },
        { label: "Challenge", href: "https://www.kapruka.com/contactUs/agentChallenge.html" },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/kagent" },
      ],
    },
    {
      title: "AdGPT",
      context: "Build with Cursor Live Sri Lanka | 2-Hour Live Build #1",
      description:
        "AI creative studio that turns static ads and scripts into 15–30 second vertical videos for Reels, TikTok, and YouTube Shorts — hooks, storyboard, voice-over, captions, and MP4 export.",
      stack: [
        "Next.js",
        "TypeScript",
        "OpenAI",
        "Remotion",
        "Supabase",
        "Tailwind CSS",
        "Framer Motion",
      ],
      links: [
        { label: "Live App", href: "https://adgpt-nine.vercel.app" },
        {
          label: "Demo Video",
          href: "https://drive.google.com/file/d/1Rf_xi_1WSzJlnFbyzF6Ex_5h89rRi-zx/view?usp=drivesdk",
        },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/AdGPT" },
      ],
    },
    {
      title: "CyanideX",
      context: "Independent Project | Cyber Threat Intelligence",
      description:
        "AI-powered cyber threat forecasting and intelligence OS — OSINT collection, risk DNA analysis, attack-chain simulation, voice intelligence, and a global threat globe for SOC teams.",
      stack: [
        "Next.js",
        "TypeScript",
        "Three.js",
        "Java",
        "JavaScript",
        "Supabase",
        "Speechmatics",
        "Bright Data",
        "Tailwind CSS",
        "Framer Motion",
      ],
      links: [
        { label: "Live App", href: "https://cyanide-x.vercel.app/" },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/CyanideX" },
      ],
    },
    {
      title: "Sentra AI",
      context: "LabLab WebData | AI Applications - 17th of 294",
      description:
        "Live GTM intelligence OS — monitors competitors, verifies live-web evidence, and delivers executive briefings with risk scoring and action plans.",
      stack: ["Next.js", "Supabase", "Bright Data", "AI/ML API", "Speechmatics", "Featherless AI"],
      links: [
        { label: "Live App", href: "https://sentra-one-kappa.vercel.app/" },
        { label: "Demo Video", href: "https://drive.google.com/file/d/1_q3Q3MuH70ceXHjQGieHP0DulEJHHbTB/view?usp=drive_link" },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/Sentra-AI" },
      ],
    },
    {
      title: "SANTRA AI",
      context: "Independent Project | Founder & GTM intelligence",
      description:
        "Startup intelligence OS for founders — idea validation, competitor analysis, GTM execution, AI advisor, and watchlist with live market signals.",
      stack: ["Next.js 15", "React 19", "TypeScript", "Supabase", "Tailwind CSS", "Framer Motion"],
      links: [{ label: "GitHub", href: "https://github.com/AhamedAAHA" }],
    },
    {
      title: "SUZIE AI",
      context: "Independent Project",
      description:
        "Global intelligence OS that monitors world events, supply chains, and geopolitical risk — executive briefings, scenario simulations, and predictive risk assessments.",
      stack: [
        "Next.js",
        "TypeScript",
        "Supabase",
        "Bright Data",
        "AI/ML API",
        "Speechmatics",
        "Three.js",
        "React Three Fiber",
        "Framer Motion",
        "Mapbox",
        "Tailwind CSS",
      ],
      links: [
        { label: "Live App", href: "https://suzie-ashy.vercel.app/" },
        { label: "Demo Video", href: "https://drive.google.com/file/d/1aQW7sHbc9XWZSvKetBD39Lm66hgJDA_8/view?usp=sharing" },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/Suzie" },
      ],
    },
    {
      title: "Neural OPS",
      context: "Band of Agents Hackathon | Multi-agent crisis platform",
      description:
        "Enterprise risk and incident operations — 20+ AI agents, Band SDK collaboration, evidence chains, and human approval flows.",
      stack: ["Next.js", "TypeScript", "Prisma", "Supabase", "Docker", "GitHub Actions"],
      links: [{ label: "GitHub", href: "https://github.com/AhamedAAHA" }],
    },
    {
      title: "DeeBug",
      context: "Independent Project",
      description:
        "Digital twin quantity surveying — converts construction drawings into BOQs, 3D views, progress tracking, and cost prediction.",
      stack: [
        "Java",
        "Spring Boot",
        "JavaScript",
        "HTML5",
        "CSS3",
        "Three.js",
        "MySQL",
        "Chart.js",
        "OpenAI API",
      ],
      links: [
        { label: "Live App", href: "https://b398f333.deebug.pages.dev/" },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/DeeBug" },
      ],
    },
    {
      title: "Lumora",
      context: "Independent Project | Voice-first hiring",
      description:
        "Voice-first AI interview platform with PIN access, CV analysis, structured evaluations, and ElevenLabs voice delivery.",
      stack: [
        "React",
        "Node.js",
        "MongoDB",
        "OpenAI",
        "ElevenLabs",
        "JWT",
      ],
      links: [
        { label: "Live App", href: "https://5b37e66a.lumora-3a5.pages.dev/" },
        {
          label: "Demo Video",
          href: "https://drive.google.com/file/d/1Y_mORru-tXktTkl5IWs6BZTCag4xPVc8/view?usp=drivesdk",
        },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/Lumora" },
      ],
    },
    {
      title: "GestureMed",
      context: "Independent Project | Accessible healthcare communication",
      description:
        "Sign-to-speech healthcare platform with real-time gesture detection, multilingual medical output, urgency alerts, and doctor/patient portals.",
      stack: ["React", "MediaPipe", "WebAssembly", "OpenAI API", "ElevenLabs", "MongoDB"],
      links: [
        { label: "Live App", href: "https://15e26ddc.gesturemed.pages.dev/" },
        { label: "Demo Video", href: "https://drive.google.com/file/d/1EpwfBXJGRJYHHMX2I_pVY7PJl9G6dvsn/view?usp=sharing" },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/GestureMed" },
      ],
    },
    {
      title: "Smart Study Companion",
      context: "Cursor Buildathon | 7th place · ElevenLabs track",
      description:
        "AI learning platform for Sri Lankan students — PDFs to summaries, flashcards, Tamil voice lessons, and mock viva with student, lecturer, and admin roles.",
      stack: ["Next.js", "TypeScript", "Express", "MongoDB", "OpenAI", "ElevenLabs"],
      links: [
        { label: "Live App", href: "https://aaha1.netlify.app" },
        { label: "Demo Video", href: "https://drive.google.com/file/d/1HrzjFSAarvJ6aqFcmaZX5ySqt8OuVgFl/view?usp=sharing" },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/SmartStudyCompanionAAHA" },
      ],
    },
    {
      title: "Bismi",
      context: "Independent Project | SLIIT tuition management",
      description:
        "3D education hub with Admin, Student, and Parent portals — attendance, MCQ tests, fees, homework, QR check-in, and AI study assistant.",
      stack: ["Next.js 14", "TypeScript", "Prisma", "MongoDB", "Framer Motion", "Tailwind CSS"],
      links: [{ label: "GitHub", href: "https://github.com/AhamedAAHA" }],
    },
    {
      title: "AeroSpace",
      context: "Independent Project | Aviation command center",
      description:
        "Aviation intelligence OS with live flight tracking, seat scoring, delay prediction, 3D command globe, and CAPCOM-style AI copilot.",
      stack: ["Next.js 14", "TypeScript", "Three.js", "React Three Fiber", "Framer Motion", "Zod"],
      links: [{ label: "GitHub", href: "https://github.com/AhamedAAHA" }],
    },
    {
      title: "TorqueX AI",
      context: "Independent Project | Gesture-controlled 3D",
      description:
        "GestureDrive 3D car showroom — webcam hand tracking for pinch, swipe, zoom, environment switching, and part customization.",
      stack: ["React", "TypeScript", "Vite", "Three.js", "React Three Fiber", "MediaPipe"],
      links: [{ label: "GitHub", href: "https://github.com/AhamedAAHA" }],
    },
    {
      title: "Golden Fork",
      context: "Team Project | SLIIT · Year 2 Semester 2",
      description:
        "Multi-role restaurant management — orders, reservations, payments, menu management, and operational reporting for dine-in, delivery, and pickup.",
      stack: ["Node.js", "Express.js", "MongoDB", "JWT", "MVC"],
      links: [
        { label: "Live App", href: "https://restaurant-managment-system-webapp.onrender.com" },
        { label: "GitHub", href: "https://github.com/IT24101987/SE-23_Restaurant_managment_system_webapp" },
      ],
    },
    {
      title: "RailLink",
      context: "Year 2 Semester 1 | Train scheduling and booking",
      description:
        "Developed a booking system with passenger, staff, and admin roles; route and schedule management; transactional seat booking; PDF ticket support; and live schedule updates through server-sent events.",
      stack: ["Java 17", "Spring Boot", "Spring Security", "Thymeleaf", "MySQL", "SSE"],
      links: [{ label: "GitHub", href: "https://github.com/AhamedAAHA/RailLink" }],
    },
    {
      title: "InkSpire",
      context: "Team Project | SLIIT · Year 1 Semester 2",
      description:
        "Online bookstore with browsing, cart, orders, auth, and admin inventory — Java OOP and MVC with session-based persistence.",
      stack: ["Java", "Jakarta EE", "Servlets", "JSP", "JSTL", "Maven"],
      links: [{ label: "GitHub", href: "https://github.com/JayashanManodya/Inkspire_Bookstore" }],
    },
    {
      title: "Portfolio",
      context: "Personal brand site",
      description:
        "Personal developer portfolio with featured projects, journeys, skills matrix, live GitHub activity, and editable admin content.",
      stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
      links: [
        { label: "Live App", href: "https://ahamed-4e0q.onrender.com" },
        { label: "GitHub", href: "https://github.com/AhamedAAHA/Portfolio" },
      ],
    },
  ] satisfies Project[],

  experience: projectJourneys,

  education: [
    {
      qualification: "Software Engineering Undergraduate",
      institution: "Sri Lanka Institute of Information Technology (SLIIT)",
      period: "Year 3 Semester 1 | Expected graduation 2028",
    },
    {
      qualification: "G.C.E. Ordinary Level and Advanced Level Examinations",
      institution: "Zahira College",
      period: "Completed",
    },
  ] satisfies EducationItem[],

  certifications: [
    {
      qualification: "Advanced in Excel",
      institution: "ZIPS Campus",
      period: "Certification",
    },
    {
      qualification: "Diploma in English",
      institution: "Headway College",
      period: "Certification",
    },
    {
      qualification: "Quantity Surveying",
      institution: "IPHS",
      period: "In Progress",
    },
  ] satisfies EducationItem[],

  languages: [
    { name: "English", level: "Native" },
    { name: "Tamil", level: "Native" },
    { name: "Sinhala", level: "Conversational" },
  ] satisfies LanguageItem[],

  contact: {
    email: "hubaibahamedaaha@gmail.com",
    phoneDisplay: "+94 76 8282 767",
    phoneHref: "tel:+94768282767",
    address: "18, Sudharsi mawatha, Kalubowila, Sri Lanka",
  },
} as const;
