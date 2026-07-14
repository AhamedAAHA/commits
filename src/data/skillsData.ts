export type SkillsTabId = "core" | "expertise" | "tools";

export type CoreCategoryIcon =
  | "frontend"
  | "backend"
  | "ai"
  | "engineering";

export interface CoreCategory {
  id: string;
  title: string;
  icon: CoreCategoryIcon;
  skills: readonly string[];
}

export interface ExpertiseArea {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  level: string;
  projects: readonly string[];
}

export const skillsSectionMeta = {
  title: "Skills & Expertise",
  subtitle:
    "Technologies, tools, and expertise developed through academic projects, hackathons, and real-world AI products.",
} as const;

export const skillsTabs: readonly { id: SkillsTabId; label: string }[] = [
  { id: "core", label: "Core" },
  { id: "expertise", label: "Expertise" },
  { id: "tools", label: "Tools" },
];

export const coreCategories: readonly CoreCategory[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    icon: "frontend",
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML/CSS",
      "Responsive UI Design",
      "Dashboard Development",
      "3D UI & Animations",
      "Three.js",
      "Framer Motion",
      "React Three Fiber",
      "Data Visualization",
      "Component-Based Architecture",
      "User Experience (UX) Design",
    ],
  },
  {
    id: "backend",
    title: "Backend & Database",
    icon: "backend",
    skills: [
      "Node.js",
      "Express.js",
      "Spring Boot",
      "MongoDB",
      "MySQL",
      "PostgreSQL",
      "Supabase",
      "Prisma ORM",
      "Authentication Systems",
      "Real-Time Data Management",
      "Database Modeling",
      "CRUD Operations",
      "Server-Side Development",
      "Cloud Deployment",
    ],
  },
  {
    id: "ai",
    title: "AI & Intelligence",
    icon: "ai",
    skills: [
      "OpenAI",
      "ElevenLabs",
      "Speechmatics",
      "Bright Data",
      "MediaPipe",
      "Prompt Engineering",
      "AI Agent Development",
      "Multi-Agent Systems",
      "Large Language Models (LLMs)",
      "Voice AI Systems",
      "Speech-to-Text (STT)",
      "Text-to-Speech (TTS)",
      "Retrieval-Augmented Generation (RAG)",
      "Intelligent Chatbots",
      "AI Workflow Automation",
      "Computer Vision",
      "Image Intelligence",
      "Predictive Analytics",
      "AI Decision Systems",
    ],
  },
  {
    id: "engineering",
    title: "Software Engineering",
    icon: "engineering",
    skills: [
      "RESTful API Development",
      "API Integration",
      "Third-Party API Integration",
      "API Authentication",
      "Request/Response Handling",
      "Webhook Integration",
      "JWT Authentication",
      "Role-Based Access Control (RBAC)",
      "Session Management",
      "Protected Routes",
      "User Authorization",
      "Secure Login Systems",
      "Git Version Control",
      "GitHub Collaboration",
      "Branch Management",
      "Pull Requests",
      "Merge Conflict Resolution",
      "CI/CD Workflows",
      "Relational Database Design",
      "ER Diagram Design",
      "Schema Design",
      "Data Modeling",
      "Query Optimization",
      "Database Normalization",
      "Relationships & Constraints",
      "Indexing Strategies",
      "System Architecture",
    ],
  },
];

export const expertiseAreas: readonly ExpertiseArea[] = [
  {
    id: "ai-engineering",
    emoji: "🧠",
    title: "AI Engineering",
    description:
      "Building AI-powered products using LLMs, Voice AI, Computer Vision, and Intelligent Automation.",
  },
  {
    id: "full-stack",
    emoji: "🌐",
    title: "Full Stack Development",
    description:
      "Developing scalable web applications using modern frontend and backend technologies.",
  },
  {
    id: "voice-ai",
    emoji: "🎙",
    title: "Voice AI Systems",
    description:
      "Real-time speech recognition, voice assistants, multilingual AI interaction, and conversational interfaces.",
  },
  {
    id: "enterprise-intelligence",
    emoji: "📊",
    title: "Enterprise Intelligence",
    description:
      "Building GTM intelligence systems, competitor monitoring, market analytics, and business intelligence platforms.",
  },
  {
    id: "automation",
    emoji: "⚡",
    title: "Automation",
    description:
      "Workflow automation, AI agents, integrations, and productivity systems.",
  },
  {
    id: "product-development",
    emoji: "🚀",
    title: "Product Development",
    description:
      "Turning ideas into production-ready applications through rapid prototyping and iteration.",
  },
];

export const tools: readonly ToolItem[] = [
  {
    id: "react",
    name: "React",
    description:
      "Component-driven UI development with hooks, server/client patterns, and modern React 19 features.",
    level: "Advanced",
    projects: [
      "GestureMed",
      "Lumora",
      "Golden Fork Restaurant System",
      "Multiple full-stack projects",
    ],
  },
  {
    id: "nextjs",
    name: "Next.js",
    description:
      "Full-stack React framework for production apps with App Router, API routes, and edge deployment.",
    level: "Advanced",
    projects: ["SUZIE AI", "Sentra AI", "Smart Study Companion", "Aria", "KAgent", "AdGPT"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    description:
      "Type-safe application development across frontend and backend with strict interfaces and schemas.",
    level: "Advanced",
    projects: ["SUZIE AI", "Sentra AI", "Smart Study Companion", "Aria", "KAgent", "AdGPT"],
  },
  {
    id: "javascript",
    name: "JavaScript",
    description:
      "Core language for web apps, APIs, automation scripts, and interactive client-side experiences.",
    level: "Advanced",
    projects: ["DeeBug", "Lumora", "Golden Fork Restaurant System", "RailLink UI layers"],
  },
  {
    id: "nodejs",
    name: "Node.js",
    description:
      "Server-side JavaScript runtime for REST APIs, real-time features, and full-stack product backends.",
    level: "Advanced",
    projects: ["Smart Study Companion", "Lumora", "Golden Fork Restaurant System"],
  },
  {
    id: "express",
    name: "Express.js",
    description:
      "Lightweight Node.js framework for routing, middleware, auth, and API design.",
    level: "Advanced",
    projects: ["Smart Study Companion", "Lumora", "Golden Fork Restaurant System"],
  },
  {
    id: "spring-boot",
    name: "Spring Boot",
    description:
      "Enterprise Java backend with security, data access, and RESTful service architecture.",
    level: "Proficient",
    projects: ["DeeBug", "RailLink", "InkSpire BookStore"],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description:
      "Document database for flexible schemas in AI products, booking systems, and interview platforms.",
    level: "Advanced",
    projects: ["Smart Study Companion", "Lumora", "GestureMed", "Golden Fork Restaurant System"],
  },
  {
    id: "supabase",
    name: "Supabase",
    description:
      "Postgres-backed platform for auth, storage, RLS policies, and real-time intelligence pipelines.",
    level: "Advanced",
    projects: ["SUZIE AI", "Sentra AI", "AdGPT"],
  },
  {
    id: "openai",
    name: "OpenAI",
    description:
      "LLM integration for reasoning, content generation, resume analysis, and agentic workflows.",
    level: "Advanced",
    projects: ["SUZIE AI", "Sentra AI", "Smart Study Companion", "Lumora", "GestureMed", "DeeBug", "Aria", "KAgent", "AdGPT"],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description:
      "Voice synthesis for multilingual lessons, interview responses, and accessible healthcare output.",
    level: "Advanced",
    projects: ["Smart Study Companion", "Lumora", "GestureMed"],
  },
  {
    id: "speechmatics",
    name: "Speechmatics",
    description:
      "Speech-to-text and voice briefing pipelines for executive intelligence products.",
    level: "Proficient",
    projects: ["Sentra AI", "SUZIE AI", "Aria"],
  },
  {
    id: "bright-data",
    name: "Bright Data",
    description:
      "Live web data collection for SERP research, competitor monitoring, and verified GTM intelligence.",
    level: "Advanced",
    projects: ["Sentra AI", "SUZIE AI", "Aria"],
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "Version control, collaboration, CI workflows, and open-source project hosting.",
    level: "Advanced",
    projects: ["All portfolio projects"],
  },
  {
    id: "vercel",
    name: "Vercel",
    description:
      "Edge deployment for Next.js apps with preview environments and production hosting.",
    level: "Proficient",
    projects: ["SUZIE AI", "Sentra AI", "Aria", "KAgent", "AdGPT"],
  },
  {
    id: "figma",
    name: "Figma",
    description:
      "UI design, prototyping, and design-system exploration for product interfaces.",
    level: "Proficient",
    projects: ["Portfolio UI", "Product wireframes across independent builds"],
  },
];
