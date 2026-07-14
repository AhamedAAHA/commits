import type { ExperienceItem, Project, ProjectLink } from "../data/siteContent";

export const FEATURED_LIMIT = 3;

export function getFeaturedItems<T extends { featured?: boolean; featuredOrder?: number }>(
  items: readonly T[],
): T[] {
  return [...items]
    .filter((item) => item.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
    .slice(0, FEATURED_LIMIT);
}

export function getLinkByLabel(links: ProjectLink[], label: string): string {
  return (
    links.find((l) => l.label.toLowerCase() === label.toLowerCase())?.href ?? ""
  );
}

export function getExternalLinks(links: ProjectLink[]): ProjectLink[] {
  const internal = new Set(["project journey"]);
  return links.filter((l) => !internal.has(l.label.toLowerCase()) && l.href.trim());
}

export function findJourney(
  experience: readonly ExperienceItem[],
  journeyId?: string,
): ExperienceItem | undefined {
  if (!journeyId) return undefined;
  return experience.find((e) => e.id === journeyId);
}

export function projectSummary(project: Project): string {
  return project.summary?.trim() || project.description;
}

export function experienceSummary(item: ExperienceItem): string {
  return item.summary?.trim() || item.highlights[0] || "";
}

export function projectThumbnail(project: Project): string {
  return project.thumbnail?.trim() || "/thumbnails/default.png";
}

export function experienceThumbnail(item: ExperienceItem): string {
  return item.thumbnail?.trim() || "/thumbnails/default.png";
}

export function countFeatured<T extends { featured?: boolean }>(items: readonly T[]): number {
  return items.filter((i) => i.featured).length;
}

/** Keep modal/grid order aligned with the catalog array (A, then B, then C). */
export function orderByCatalog<T extends { id?: string; title?: string; role?: string }>(
  items: readonly T[],
  catalog: readonly T[],
): T[] {
  const indexFor = (item: T) => {
    const key = item.id ?? item.title ?? item.role ?? "";
    const idx = catalog.findIndex(
      (c) => (c.id ?? c.title ?? c.role) === key,
    );
    return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
  };
  return [...items].sort((a, b) => indexFor(a) - indexFor(b));
}
