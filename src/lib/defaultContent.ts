import {
  coreCategories,
  expertiseAreas,
  skillsSectionMeta,
  tools,
} from "../data/skillsData";
import {
  enrichHackathons,
  enrichJourneys,
  enrichProjects,
} from "../data/showcaseMeta";
import { siteContent } from "../data/siteContent";
import type {
  CoreCategory,
  ExpertiseArea,
  ToolItem,
} from "../data/skillsData";
import type {
  EducationItem,
  ExperienceItem,
  GitHubActivity,
  LanguageItem,
  NavItem,
  Project,
  SocialLink,
} from "../data/siteContent";

export interface SectionHeading {
  title: string;
  subtitle?: string;
}

export interface PortfolioContent {
  nav: NavItem[];
  hero: {
    name: string;
    title: string;
    tagline: string;
    location: string;
    profileImage: string;
  };
  summary: string;
  socials: SocialLink[];
  githubActivity: GitHubActivity;
  hackathons: ExperienceItem[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: EducationItem[];
  languages: LanguageItem[];
  contact: {
    email: string;
    phoneDisplay: string;
    phoneHref: string;
    address: string;
  };
  sections: {
    about: SectionHeading;
    hackathons: SectionHeading;
    projects: SectionHeading;
    experience: SectionHeading;
    education: SectionHeading;
    activity: SectionHeading;
    contact: SectionHeading;
  };
  skills: {
    title: string;
    subtitle: string;
    coreCategories: CoreCategory[];
    expertiseAreas: ExpertiseArea[];
    tools: ToolItem[];
  };
  cvPdfPath: string;
}

export const STORAGE_KEY = "portfolio-content-v14";

function itemKey(item: { id?: string; title?: string; role?: string }): string {
  return (item.id ?? item.title ?? item.role ?? "").trim().toLowerCase();
}

/** Keep catalog text from defaults; overlay admin featured flags only. */
function mergeCatalogItems<
  T extends {
    id?: string;
    title?: string;
    role?: string;
    featured?: boolean;
    featuredOrder?: number;
    thumbnail?: string;
    journeyId?: string;
  },
>(defaults: T[], saved: T[] | undefined): T[] {
  if (!saved?.length) return defaults;

  const byId = new Map(
    saved.filter((item) => item.id).map((item) => [item.id!, item]),
  );
  const byKey = new Map(saved.map((item) => [itemKey(item), item]));

  return defaults.map((item) => {
    const match =
      (item.id ? byId.get(item.id) : undefined) ?? byKey.get(itemKey(item));
    if (!match) return item;
    return {
      ...item,
      featured: match.featured,
      featuredOrder: match.featuredOrder,
      thumbnail: match.thumbnail?.trim() ? match.thumbnail : item.thumbnail,
      journeyId: match.journeyId?.trim() ? match.journeyId : item.journeyId,
    };
  });
}

export function getDefaultContent(): PortfolioContent {
  return {
    nav: siteContent.nav.map((item) => ({ ...item })),
    hero: {
      name: siteContent.hero.name,
      title: siteContent.hero.title,
      tagline: siteContent.hero.tagline,
      location: siteContent.hero.location,
      profileImage: siteContent.hero.profileImage,
    },
    summary: siteContent.summary,
    socials: siteContent.socials.map((s) => ({ ...s })),
    githubActivity: { ...siteContent.githubActivity },
    hackathons: enrichHackathons(
      siteContent.hackathons.map((e) => ({
        ...e,
        highlights: [...e.highlights],
      })),
    ),
    projects: enrichProjects(
      siteContent.projects.map((p) => ({
        ...p,
        stack: [...p.stack],
        links: p.links.map((l) => ({ ...l })),
      })),
    ),
    experience: enrichJourneys(
      siteContent.experience.map((e) => ({
        ...e,
        highlights: [...e.highlights],
      })),
    ),
    education: siteContent.education.map((e) => ({ ...e })),
    certifications: siteContent.certifications.map((e) => ({ ...e })),
    languages: siteContent.languages.map((l) => ({ ...l })),
    contact: { ...siteContent.contact },
    sections: {
      about: { title: "About" },
      hackathons: {
        title: "Hackathons & Community",
        subtitle:
          "Neuroloom at AMD ACT II, Aria at Hack the Zero Stack, KAgent for Kapruka, and competitive builds across international hackathons.",
      },
      projects: {
        title: "Featured Projects",
        subtitle:
          "Neuroloom, Aria, and KAgent lead the showcase — click a thumbnail for the full image, or view all projects.",
      },
      experience: {
        title: "Project Journey",
        subtitle:
          "Aria's architecture first — pipelines, AWS data layer, and technical decisions behind flagship builds.",
      },
      education: {
        title: "Education",
        subtitle: "Formal study and additional learning shown in my CV.",
      },
      activity: {
        title: "Live Commit Activity",
        subtitle:
          "Recent public GitHub pushes and contribution activity, synced live when the portfolio loads.",
      },
      contact: {
        title: "Contact",
        subtitle:
          "Reach out for software engineering internships, collaborations, or project opportunities.",
      },
    },
    skills: {
      title: skillsSectionMeta.title,
      subtitle: skillsSectionMeta.subtitle,
      coreCategories: coreCategories.map((c) => ({
        ...c,
        skills: [...c.skills],
      })),
      expertiseAreas: expertiseAreas.map((e) => ({ ...e })),
      tools: tools.map((t) => ({
        ...t,
        projects: [...t.projects],
      })),
    },
    cvPdfPath: siteContent.cvPdfPath,
  };
}

export function loadStoredContent(): PortfolioContent {
  try {
    localStorage.removeItem("portfolio-content-v1");
    localStorage.removeItem("portfolio-content-v2");
    localStorage.removeItem("portfolio-content-v3");
    localStorage.removeItem("portfolio-content-v8");
    localStorage.removeItem("portfolio-content-v9");
    localStorage.removeItem("portfolio-content-v10");
    localStorage.removeItem("portfolio-content-v11");

    const defaults = getDefaultContent();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw) as PortfolioContent;
    return {
      ...defaults,
      ...parsed,
      hero: { ...defaults.hero, ...parsed.hero },
      contact: { ...defaults.contact, ...parsed.contact },
      githubActivity: { ...defaults.githubActivity, ...parsed.githubActivity },
      sections: { ...defaults.sections, ...parsed.sections },
      skills: { ...defaults.skills, ...parsed.skills },
      // Catalog stays current from repo; admin homepage order / card edits persist.
      hackathons: mergeCatalogItems(defaults.hackathons, parsed.hackathons),
      projects: mergeCatalogItems(defaults.projects, parsed.projects),
      experience: defaults.experience,
    };
  } catch {
    return getDefaultContent();
  }
}
