import type { Project, ProjectLink } from "../../data/siteContent";
import { FEATURED_LIMIT } from "../../lib/showcaseHelpers";

export function getLinkByLabel(
  links: ProjectLink[],
  label: string,
): string {
  return links.find((l) => l.label.toLowerCase() === label.toLowerCase())?.href ?? "";
}

export function setProjectLinks(
  live: string,
  demo: string,
  github: string,
  extra: ProjectLink[],
): ProjectLink[] {
  const links: ProjectLink[] = [];
  if (live.trim()) links.push({ label: "Live App", href: live.trim() });
  if (demo.trim()) links.push({ label: "Demo Video", href: demo.trim() });
  if (github.trim()) links.push({ label: "GitHub", href: github.trim() });
  for (const link of extra) {
    if (link.label.trim() && link.href.trim()) {
      links.push({ label: link.label.trim(), href: link.href.trim() });
    }
  }
  return links;
}

export function getExtraLinks(links: ProjectLink[]): ProjectLink[] {
  const known = new Set(["live app", "demo video", "github"]);
  return links.filter((l) => !known.has(l.label.toLowerCase()));
}

export function emptyProject(): Project {
  return {
    id: "",
    title: "",
    context: "",
    description: "",
    summary: "",
    thumbnail: "",
    featured: false,
    featuredOrder: undefined,
    journeyId: "",
    stack: [],
    links: [],
  };
}

export function toggleFeatured<T extends { featured?: boolean; featuredOrder?: number }>(
  items: T[],
  index: number,
  checked: boolean,
): T[] {
  const next = [...items];
  const item = { ...next[index], featured: checked };
  if (!checked) {
    delete item.featuredOrder;
  } else if (!item.featuredOrder) {
    const used = new Set(
      next
        .filter((_, i) => i !== index && next[i].featured)
        .map((e) => e.featuredOrder)
        .filter(Boolean),
    );
    for (let order = 1; order <= FEATURED_LIMIT; order++) {
      if (!used.has(order)) {
        item.featuredOrder = order;
        break;
      }
    }
  }
  next[index] = item;
  return next;
}

/** Set homepage order and swap with whoever already holds that slot. */
export function setFeaturedOrder<T extends { featured?: boolean; featuredOrder?: number }>(
  items: T[],
  index: number,
  order: number | undefined,
): T[] {
  const next = items.map((item) => ({ ...item }));
  const current = next[index];
  if (!current?.featured) return items;

  if (order === undefined || !Number.isFinite(order) || order < 1) {
    next[index] = { ...current, featuredOrder: undefined };
    return next;
  }

  const clamped = Math.min(FEATURED_LIMIT, Math.max(1, Math.trunc(order)));
  const previous = current.featuredOrder;
  const occupant = next.findIndex(
    (item, i) => i !== index && item.featured && item.featuredOrder === clamped,
  );

  next[index] = { ...current, featuredOrder: clamped };
  if (occupant !== -1) {
    next[occupant] = {
      ...next[occupant],
      featuredOrder: previous,
    };
  }
  return next;
}
