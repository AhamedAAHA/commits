import { useState } from "react";
import { Code2, ExternalLink, Map, Play, Rocket } from "lucide-react";
import type { Project, ProjectLink } from "../data/siteContent";
import {
  getLinkByLabel,
  projectSummary,
  projectThumbnail,
} from "../lib/showcaseHelpers";
import { useTilt } from "../lib/useTilt";
import { ShowcaseThumbnail } from "./ShowcaseThumbnail";
import { ThumbnailLightbox } from "./ThumbnailLightbox";

interface ProjectCardProps {
  project: Project;
  onOpenJourney?: (journeyId: string) => void;
}

const secondaryBtn =
  "focus-ring inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--line)] bg-black/20 px-3 py-2 text-xs font-semibold text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]";

const primaryBtn =
  "focus-ring inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-[oklch(0.81_0.15_290_/0.46)] bg-[var(--accent-soft)] px-3 py-2 text-xs font-semibold text-[var(--accent)] transition hover:bg-[oklch(0.7_0.15_290_/0.18)]";

function linkIcon(label: string) {
  const key = label.toLowerCase();
  if (key.includes("github") || key === "code") return Code2;
  if (key.includes("demo")) return Play;
  if (key.includes("devpost") || key.includes("challenge") || key.includes("lablab"))
    return Rocket;
  return ExternalLink;
}

function extraLinks(links: ProjectLink[]): ProjectLink[] {
  const known = new Set(["live app", "demo video", "github"]);
  return links.filter(
    (l) => l.href.trim() && !known.has(l.label.toLowerCase()),
  );
}

function contextLine(context: string): string {
  const first = context.split("|")[0]?.trim() ?? context.trim();
  return first.replace(/^Devpost ·\s*/i, "").slice(0, 48);
}

export function ProjectCard({ project, onOpenJourney }: ProjectCardProps) {
  const [showLightbox, setShowLightbox] = useState(false);
  const tilt = useTilt(5);
  const liveApp = getLinkByLabel(project.links, "Live App");
  const demo = getLinkByLabel(project.links, "Demo Video");
  const github = getLinkByLabel(project.links, "GitHub");
  const others = extraLinks(project.links);
  const hasJourney = Boolean(project.journeyId && onOpenJourney);
  const visibleStack = project.stack.slice(0, 5);
  const extraStack = project.stack.length - visibleStack.length;
  const thumb = projectThumbnail(project);
  const context = contextLine(project.context);

  const primaryActions: {
    key: string;
    href: string;
    label: string;
    primary?: boolean;
    Icon: typeof ExternalLink;
  }[] = [];

  if (liveApp) {
    primaryActions.push({
      key: "live",
      href: liveApp,
      label: "Live App",
      primary: true,
      Icon: ExternalLink,
    });
  }
  if (demo) {
    primaryActions.push({
      key: "demo",
      href: demo,
      label: "Demo",
      Icon: Play,
    });
  }
  if (github) {
    primaryActions.push({
      key: "code",
      href: github,
      label: "Code",
      Icon: Code2,
    });
  }
  others.forEach((link, i) => {
    primaryActions.push({
      key: `${link.href}-${i}`,
      href: link.href,
      label: link.label,
      Icon: linkIcon(link.label),
    });
  });

  return (
    <>
      <article
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="showcase-card showcase-card-hover spotlight-card hud-frame flex h-full flex-col overflow-hidden rounded-3xl [transform-style:preserve-3d]"
      >
        <ShowcaseThumbnail
          src={thumb}
          label={project.title}
          onClick={() => setShowLightbox(true)}
        />

        <div className="showcase-card__body flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="text-lg font-semibold leading-snug text-[var(--ink)]">
            {project.title}
          </h3>
          {context ? (
            <p className="mt-1 text-xs leading-snug text-[oklch(0.78_0.11_290)]">
              {context}
            </p>
          ) : null}
          <p className="mt-2 min-h-[2.75rem] text-sm leading-relaxed text-[var(--ink-soft)]">
            {projectSummary(project)}
          </p>

          <ul className="mb-5 mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {visibleStack.map((technology) => (
              <li
                key={technology}
                className="rounded-md border border-[var(--line)] bg-black/25 px-2 py-0.5 text-xs font-medium text-[var(--ink-soft)]"
              >
                {technology}
              </li>
            ))}
            {extraStack > 0 ? (
              <li className="rounded-md px-1 py-0.5 text-xs text-[var(--ink-faint)]">
                +{extraStack}
              </li>
            ) : null}
          </ul>

          <div className="mt-auto space-y-2">
            {primaryActions.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {primaryActions.map(({ key, href, label, primary, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={primary ? primaryBtn : secondaryBtn}
                  >
                    {label}
                    <Icon className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  </a>
                ))}
              </div>
            ) : null}
            {hasJourney ? (
              <button
                type="button"
                onClick={() => onOpenJourney!(project.journeyId!)}
                className={secondaryBtn}
              >
                Journey
                <Map className="h-3.5 w-3.5 opacity-80" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>
      </article>

      {showLightbox ? (
        <ThumbnailLightbox
          src={thumb}
          alt={project.title}
          onClose={() => setShowLightbox(false)}
        />
      ) : null}
    </>
  );
}
