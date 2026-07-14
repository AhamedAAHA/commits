import { useState } from "react";
import { createPortal } from "react-dom";
import { Download, LogOut, RotateCcw, Save, X } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { useContent } from "../../context/ContentContext";
import type { ExperienceItem, Project } from "../../data/siteContent";
import type { CoreCategory } from "../../data/skillsData";
import { EditorCard, Field, StringList, TextArea } from "./AdminFields";
import {
  emptyProject,
  getExtraLinks,
  getLinkByLabel,
  setFeaturedOrder,
  setProjectLinks,
  toggleFeatured,
} from "./adminHelpers";
import { FEATURED_LIMIT } from "../../lib/showcaseHelpers";

type AdminTab =
  | "profile"
  | "projects"
  | "hackathons"
  | "journey"
  | "education"
  | "skills"
  | "sections";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "projects", label: "Projects" },
  { id: "hackathons", label: "Hackathons" },
  { id: "journey", label: "Journey" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "sections", label: "Sections" },
];

function TimelineEditor({
  label,
  items,
  onChange,
  featuredHint,
}: {
  label: string;
  items: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
  featuredHint?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)]">{label}</h3>
          {featuredHint ? (
            <p className="text-xs text-[var(--ink-faint)]">
              Mark up to {FEATURED_LIMIT} entries to show on the homepage.
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...items,
              { role: "", company: "", period: "", highlights: [] },
            ])
          }
          className="focus-ring text-xs text-[var(--accent)] hover:underline"
        >
          + Add entry
        </button>
      </div>
      {items.map((item, index) => (
        <EditorCard
          key={index}
          title={item.role || `Entry ${index + 1}`}
          onRemove={() => onChange(items.filter((_, i) => i !== index))}
        >
          <Field
            label="Title / Role"
            value={item.role}
            onChange={(role) => {
              const next = [...items];
              next[index] = { ...item, role };
              onChange(next);
            }}
          />
          <Field
            label="Subtitle / Company"
            value={item.company}
            onChange={(company) => {
              const next = [...items];
              next[index] = { ...item, company };
              onChange(next);
            }}
          />
          <Field
            label="Period"
            value={item.period}
            onChange={(period) => {
              const next = [...items];
              next[index] = { ...item, period };
              onChange(next);
            }}
          />
          <StringList
            label="Highlights"
            items={item.highlights}
            onChange={(highlights) => {
              const next = [...items];
              next[index] = { ...item, highlights };
              onChange(next);
            }}
          />
          {featuredHint ? (
            <>
              <Field
                label="Short summary (card preview)"
                value={item.summary ?? ""}
                onChange={(summary) => {
                  const next = [...items];
                  next[index] = { ...item, summary };
                  onChange(next);
                }}
              />
              <Field
                label="Thumbnail path"
                value={item.thumbnail ?? ""}
                onChange={(thumbnail) => {
                  const next = [...items];
                  next[index] = { ...item, thumbnail };
                  onChange(next);
                }}
                placeholder="/thumbnails/aria.jpg"
              />
              <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                <input
                  type="checkbox"
                  checked={Boolean(item.featured)}
                  onChange={(event) =>
                    onChange(toggleFeatured(items, index, event.target.checked))
                  }
                  className="rounded border-[var(--line)]"
                />
                Show on homepage (max {FEATURED_LIMIT})
              </label>
              {item.featured ? (
                <Field
                  label="Homepage order (1–3)"
                  value={String(item.featuredOrder ?? "")}
                  onChange={(raw) => {
                    const order = Number.parseInt(raw, 10);
                    onChange(
                      setFeaturedOrder(
                        items,
                        index,
                        Number.isFinite(order) ? order : undefined,
                      ),
                    );
                  }}
                  type="text"
                />
              ) : null}
            </>
          ) : null}
        </EditorCard>
      ))}
    </div>
  );
}

function ProjectEditor({
  project,
  index,
  onChange,
  onFeaturedToggle,
  onFeaturedOrder,
  onRemove,
}: {
  project: Project;
  index: number;
  onChange: (project: Project) => void;
  onFeaturedToggle: (checked: boolean) => void;
  onFeaturedOrder: (order: number | undefined) => void;
  onRemove: () => void;
}) {
  const extra = getExtraLinks(project.links);

  return (
    <EditorCard
      title={project.title || `Project ${index + 1}`}
      onRemove={onRemove}
    >
      <Field
        label="Title"
        value={project.title}
        onChange={(title) => onChange({ ...project, title })}
      />
      <Field
        label="Project ID"
        value={project.id ?? ""}
        onChange={(id) => onChange({ ...project, id })}
        placeholder="aria"
      />
      <Field
        label="Context"
        value={project.context}
        onChange={(context) => onChange({ ...project, context })}
      />
      <Field
        label="Short summary (card preview)"
        value={project.summary ?? ""}
        onChange={(summary) => onChange({ ...project, summary })}
      />
      <TextArea
        label="Full description"
        value={project.description}
        onChange={(description) => onChange({ ...project, description })}
        rows={4}
      />
      <Field
        label="Thumbnail path"
        value={project.thumbnail ?? ""}
        onChange={(thumbnail) => onChange({ ...project, thumbnail })}
        placeholder="/thumbnails/aria.jpg"
      />
      <Field
        label="Journey ID"
        value={project.journeyId ?? ""}
        onChange={(journeyId) => onChange({ ...project, journeyId })}
        placeholder="aria"
      />
      <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
        <input
          type="checkbox"
          checked={Boolean(project.featured)}
          onChange={(event) => onFeaturedToggle(event.target.checked)}
          className="rounded border-[var(--line)]"
        />
        Show on homepage (max {FEATURED_LIMIT})
      </label>
      {project.featured ? (
        <Field
          label="Homepage order (1–3)"
          value={String(project.featuredOrder ?? "")}
          onChange={(raw) => {
            const order = Number.parseInt(raw, 10);
            onFeaturedOrder(Number.isFinite(order) ? order : undefined);
          }}
          type="text"
        />
      ) : null}
      <Field
        label="Stack (comma-separated)"
        value={project.stack.join(", ")}
        onChange={(raw) =>
          onChange({
            ...project,
            stack: raw
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
      />
      <Field
        label="Live App URL"
        value={getLinkByLabel(project.links, "Live App")}
        onChange={(live) =>
          onChange({
            ...project,
            links: setProjectLinks(
              live,
              getLinkByLabel(project.links, "Demo Video"),
              getLinkByLabel(project.links, "GitHub"),
              extra,
            ),
          })
        }
        type="url"
      />
      <Field
        label="Demo Video URL"
        value={getLinkByLabel(project.links, "Demo Video")}
        onChange={(demo) =>
          onChange({
            ...project,
            links: setProjectLinks(
              getLinkByLabel(project.links, "Live App"),
              demo,
              getLinkByLabel(project.links, "GitHub"),
              extra,
            ),
          })
        }
        type="url"
      />
      <Field
        label="GitHub URL"
        value={getLinkByLabel(project.links, "GitHub")}
        onChange={(github) =>
          onChange({
            ...project,
            links: setProjectLinks(
              getLinkByLabel(project.links, "Live App"),
              getLinkByLabel(project.links, "Demo Video"),
              github,
              extra,
            ),
          })
        }
        type="url"
      />
      {extra.map((link, linkIndex) => (
        <div key={linkIndex} className="grid gap-2 sm:grid-cols-2">
          <Field
            label="Extra link label"
            value={link.label}
            onChange={(label) => {
              const nextExtra = [...extra];
              nextExtra[linkIndex] = { ...link, label };
              onChange({
                ...project,
                links: setProjectLinks(
                  getLinkByLabel(project.links, "Live App"),
                  getLinkByLabel(project.links, "Demo Video"),
                  getLinkByLabel(project.links, "GitHub"),
                  nextExtra,
                ),
              });
            }}
          />
          <Field
            label="Extra link URL"
            value={link.href}
            onChange={(href) => {
              const nextExtra = [...extra];
              nextExtra[linkIndex] = { ...link, href };
              onChange({
                ...project,
                links: setProjectLinks(
                  getLinkByLabel(project.links, "Live App"),
                  getLinkByLabel(project.links, "Demo Video"),
                  getLinkByLabel(project.links, "GitHub"),
                  nextExtra,
                ),
              });
            }}
            type="url"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange({
            ...project,
            links: setProjectLinks(
              getLinkByLabel(project.links, "Live App"),
              getLinkByLabel(project.links, "Demo Video"),
              getLinkByLabel(project.links, "GitHub"),
              [...extra, { label: "", href: "" }],
            ),
          })
        }
        className="focus-ring self-start text-xs text-[var(--accent)] hover:underline"
      >
        + Add extra link
      </button>
    </EditorCard>
  );
}

export function AdminPanel() {
  const { showPanel, closePanel, logout, isAuthenticated } = useAdmin();
  const { content, setContent, saveContent, resetContent } = useContent();
  const [tab, setTab] = useState<AdminTab>("profile");
  const [saved, setSaved] = useState(false);

  if (!showPanel || !isAuthenticated) return null;

  function patch<K extends keyof typeof content>(
    key: K,
    value: (typeof content)[K],
  ) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveContent();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-content.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return createPortal(
    <div className="fixed inset-0 z-[190] flex flex-col bg-[#070b08]/95 backdrop-blur-md">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--line)] px-4 py-3 sm:px-6">
        <div>
          <h1 className="font-display text-xl text-[var(--ink)]">Admin editor</h1>
          <p className="text-xs text-[var(--ink-faint)]">
            Edit projects, skills, links, and all portfolio content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="focus-ring flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[#0b0716]"
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? "Saved!" : "Save"}
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="focus-ring flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-3 py-2 text-xs text-[var(--ink-soft)]"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset all content to defaults? This cannot be undone.")) {
                resetContent();
              }
            }}
            className="focus-ring hidden items-center gap-1.5 rounded-lg border border-[var(--line)] px-3 py-2 text-xs text-[var(--ink-soft)] sm:flex"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={logout}
            className="focus-ring flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-3 py-2 text-xs text-[var(--ink-soft)]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
          <button
            type="button"
            onClick={closePanel}
            className="focus-ring rounded-lg p-2 text-[var(--ink-faint)] hover:text-[var(--ink)]"
            aria-label="Close admin panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--line)] p-2 sm:w-44 sm:flex-col sm:border-b-0 sm:border-r">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`focus-ring shrink-0 rounded-lg px-3 py-2 text-left text-sm transition ${
                tab === t.id
                  ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent)]"
                  : "text-[var(--ink-soft)] hover:bg-black/30"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {tab === "profile" ? (
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              <h3 className="text-sm font-semibold text-[var(--ink)]">Hero</h3>
              <Field
                label="Name"
                value={content.hero.name}
                onChange={(name) =>
                  patch("hero", { ...content.hero, name })
                }
              />
              <TextArea
                label="Title"
                value={content.hero.title}
                onChange={(title) =>
                  patch("hero", { ...content.hero, title })
                }
                rows={2}
              />
              <Field
                label="Tagline"
                value={content.hero.tagline}
                onChange={(tagline) =>
                  patch("hero", { ...content.hero, tagline })
                }
              />
              <Field
                label="Location"
                value={content.hero.location}
                onChange={(location) =>
                  patch("hero", { ...content.hero, location })
                }
              />
              <Field
                label="Profile image URL"
                value={content.hero.profileImage}
                onChange={(profileImage) =>
                  patch("hero", { ...content.hero, profileImage })
                }
                type="url"
              />
              <TextArea
                label="About summary"
                value={content.summary}
                onChange={(summary) => patch("summary", summary)}
                rows={8}
              />
              <h3 className="mt-4 text-sm font-semibold text-[var(--ink)]">
                Contact
              </h3>
              <Field
                label="Email"
                value={content.contact.email}
                onChange={(email) =>
                  patch("contact", { ...content.contact, email })
                }
                type="email"
              />
              <Field
                label="Phone display"
                value={content.contact.phoneDisplay}
                onChange={(phoneDisplay) =>
                  patch("contact", { ...content.contact, phoneDisplay })
                }
              />
              <Field
                label="Phone link (tel:)"
                value={content.contact.phoneHref}
                onChange={(phoneHref) =>
                  patch("contact", { ...content.contact, phoneHref })
                }
                type="tel"
              />
              <TextArea
                label="Address"
                value={content.contact.address}
                onChange={(address) =>
                  patch("contact", { ...content.contact, address })
                }
                rows={2}
              />
              <h3 className="mt-4 text-sm font-semibold text-[var(--ink)]">
                Social links
              </h3>
              {content.socials.map((social, index) => (
                <EditorCard key={index} title={social.label || `Social ${index + 1}`}>
                  <Field
                    label="Label"
                    value={social.label}
                    onChange={(label) => {
                      const next = [...content.socials];
                      next[index] = { ...social, label };
                      patch("socials", next);
                    }}
                  />
                  <Field
                    label="URL"
                    value={social.href}
                    onChange={(href) => {
                      const next = [...content.socials];
                      next[index] = { ...social, href };
                      patch("socials", next);
                    }}
                    type="url"
                  />
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-[var(--ink-faint)]">
                      Icon
                    </span>
                    <select
                      value={social.icon}
                      onChange={(e) => {
                        const next = [...content.socials];
                        next[index] = {
                          ...social,
                          icon: e.target.value as "linkedin" | "github",
                        };
                        patch("socials", next);
                      }}
                      className="focus-ring w-full rounded-lg border border-[var(--line)] bg-black/30 px-3 py-2 text-sm text-[var(--ink)]"
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="github">GitHub</option>
                    </select>
                  </label>
                </EditorCard>
              ))}
              <h3 className="mt-4 text-sm font-semibold text-[var(--ink)]">
                GitHub activity
              </h3>
              <Field
                label="Username"
                value={content.githubActivity.username}
                onChange={(username) =>
                  patch("githubActivity", { ...content.githubActivity, username })
                }
              />
              <Field
                label="Profile URL"
                value={content.githubActivity.profileUrl}
                onChange={(profileUrl) =>
                  patch("githubActivity", {
                    ...content.githubActivity,
                    profileUrl,
                  })
                }
                type="url"
              />
            </div>
          ) : null}

          {tab === "projects" ? (
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--ink)]">
                    Projects ({content.projects.length})
                  </h3>
                  <p className="text-xs text-[var(--ink-faint)]">
                    Mark up to {FEATURED_LIMIT} projects for the homepage grid.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    patch("projects", [...content.projects, emptyProject()])
                  }
                  className="focus-ring text-xs text-[var(--accent)] hover:underline"
                >
                  + Add project
                </button>
              </div>
              {content.projects.map((project, index) => (
                <ProjectEditor
                  key={project.id ?? project.title ?? index}
                  project={project}
                  index={index}
                  onChange={(updated) => {
                    const next = [...content.projects];
                    next[index] = updated;
                    patch("projects", next);
                  }}
                  onFeaturedToggle={(checked) =>
                    patch("projects", toggleFeatured(content.projects, index, checked))
                  }
                  onFeaturedOrder={(order) =>
                    patch("projects", setFeaturedOrder(content.projects, index, order))
                  }
                  onRemove={() =>
                    patch(
                      "projects",
                      content.projects.filter((_, i) => i !== index),
                    )
                  }
                />
              ))}
            </div>
          ) : null}

          {tab === "hackathons" ? (
            <div className="mx-auto max-w-2xl">
              <TimelineEditor
                label="Hackathons & community"
                items={content.hackathons}
                onChange={(hackathons) => patch("hackathons", hackathons)}
                featuredHint
              />
            </div>
          ) : null}

          {tab === "journey" ? (
            <div className="mx-auto max-w-2xl">
              <TimelineEditor
                label="Project journey"
                items={content.experience}
                onChange={(experience) => patch("experience", experience)}
              />
            </div>
          ) : null}

          {tab === "education" ? (
            <div className="mx-auto flex max-w-2xl flex-col gap-8">
              <TimelineEditor
                label="Education"
                items={content.education.map((e) => ({
                  role: e.qualification,
                  company: e.institution,
                  period: e.period,
                  highlights: [] as string[],
                }))}
                onChange={(items) =>
                  patch(
                    "education",
                    items.map((e) => ({
                      qualification: e.role,
                      institution: e.company,
                      period: e.period,
                    })),
                  )
                }
              />
              <TimelineEditor
                label="Certifications"
                items={content.certifications.map((e) => ({
                  role: e.qualification,
                  company: e.institution,
                  period: e.period,
                  highlights: [] as string[],
                }))}
                onChange={(items) =>
                  patch(
                    "certifications",
                    items.map((e) => ({
                      qualification: e.role,
                      institution: e.company,
                      period: e.period,
                    })),
                  )
                }
              />
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">
                    Languages
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      patch("languages", [
                        ...content.languages,
                        { name: "", level: "" },
                      ])
                    }
                    className="focus-ring text-xs text-[var(--accent)] hover:underline"
                  >
                    + Add language
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {content.languages.map((lang, index) => (
                    <EditorCard
                      key={index}
                      title={lang.name || `Language ${index + 1}`}
                      onRemove={() =>
                        patch(
                          "languages",
                          content.languages.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <Field
                        label="Language"
                        value={lang.name}
                        onChange={(name) => {
                          const next = [...content.languages];
                          next[index] = { ...lang, name };
                          patch("languages", next);
                        }}
                      />
                      <Field
                        label="Level"
                        value={lang.level}
                        onChange={(level) => {
                          const next = [...content.languages];
                          next[index] = { ...lang, level };
                          patch("languages", next);
                        }}
                      />
                    </EditorCard>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {tab === "skills" ? (
            <div className="mx-auto flex max-w-2xl flex-col gap-6">
              <Field
                label="Section title"
                value={content.skills.title}
                onChange={(title) =>
                  patch("skills", { ...content.skills, title })
                }
              />
              <TextArea
                label="Section subtitle"
                value={content.skills.subtitle}
                onChange={(subtitle) =>
                  patch("skills", { ...content.skills, subtitle })
                }
                rows={2}
              />

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">
                    Core categories
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      patch("skills", {
                        ...content.skills,
                        coreCategories: [
                          ...content.skills.coreCategories,
                          {
                            id: `cat-${Date.now()}`,
                            title: "",
                            icon: "frontend" as const,
                            skills: [],
                          },
                        ],
                      })
                    }
                    className="focus-ring text-xs text-[var(--accent)] hover:underline"
                  >
                    + Add category
                  </button>
                </div>
                {content.skills.coreCategories.map((cat, index) => (
                  <EditorCard
                    key={cat.id}
                    title={cat.title || `Category ${index + 1}`}
                    onRemove={() =>
                      patch("skills", {
                        ...content.skills,
                        coreCategories: content.skills.coreCategories.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                  >
                    <Field
                      label="Title"
                      value={cat.title}
                      onChange={(title) => {
                        const next = [...content.skills.coreCategories];
                        next[index] = { ...cat, title };
                        patch("skills", {
                          ...content.skills,
                          coreCategories: next,
                        });
                      }}
                    />
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-[var(--ink-faint)]">
                        Icon
                      </span>
                      <select
                        value={cat.icon}
                        onChange={(e) => {
                          const next = [...content.skills.coreCategories];
                          next[index] = {
                            ...cat,
                            icon: e.target.value as CoreCategory["icon"],
                          };
                          patch("skills", {
                            ...content.skills,
                            coreCategories: next,
                          });
                        }}
                        className="focus-ring w-full rounded-lg border border-[var(--line)] bg-black/30 px-3 py-2 text-sm text-[var(--ink)]"
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="ai">AI</option>
                        <option value="engineering">Engineering</option>
                      </select>
                    </label>
                    <StringList
                      label="Skills"
                      items={[...cat.skills]}
                      onChange={(skills) => {
                        const next = [...content.skills.coreCategories];
                        next[index] = { ...cat, skills };
                        patch("skills", {
                          ...content.skills,
                          coreCategories: next,
                        });
                      }}
                    />
                  </EditorCard>
                ))}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">
                    Expertise areas
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      patch("skills", {
                        ...content.skills,
                        expertiseAreas: [
                          ...content.skills.expertiseAreas,
                          {
                            id: `exp-${Date.now()}`,
                            emoji: "",
                            title: "",
                            description: "",
                          },
                        ],
                      })
                    }
                    className="focus-ring text-xs text-[var(--accent)] hover:underline"
                  >
                    + Add area
                  </button>
                </div>
                {content.skills.expertiseAreas.map((area, index) => (
                  <EditorCard
                    key={area.id}
                    title={area.title || `Area ${index + 1}`}
                    onRemove={() =>
                      patch("skills", {
                        ...content.skills,
                        expertiseAreas: content.skills.expertiseAreas.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                  >
                    <Field
                      label="Emoji"
                      value={area.emoji}
                      onChange={(emoji) => {
                        const next = [...content.skills.expertiseAreas];
                        next[index] = { ...area, emoji };
                        patch("skills", {
                          ...content.skills,
                          expertiseAreas: next,
                        });
                      }}
                    />
                    <Field
                      label="Title"
                      value={area.title}
                      onChange={(title) => {
                        const next = [...content.skills.expertiseAreas];
                        next[index] = { ...area, title };
                        patch("skills", {
                          ...content.skills,
                          expertiseAreas: next,
                        });
                      }}
                    />
                    <TextArea
                      label="Description"
                      value={area.description}
                      onChange={(description) => {
                        const next = [...content.skills.expertiseAreas];
                        next[index] = { ...area, description };
                        patch("skills", {
                          ...content.skills,
                          expertiseAreas: next,
                        });
                      }}
                    />
                  </EditorCard>
                ))}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">Tools</h3>
                  <button
                    type="button"
                    onClick={() =>
                      patch("skills", {
                        ...content.skills,
                        tools: [
                          ...content.skills.tools,
                          {
                            id: `tool-${Date.now()}`,
                            name: "",
                            description: "",
                            level: "",
                            projects: [],
                          },
                        ],
                      })
                    }
                    className="focus-ring text-xs text-[var(--accent)] hover:underline"
                  >
                    + Add tool
                  </button>
                </div>
                {content.skills.tools.map((tool, index) => (
                  <EditorCard
                    key={tool.id}
                    title={tool.name || `Tool ${index + 1}`}
                    onRemove={() =>
                      patch("skills", {
                        ...content.skills,
                        tools: content.skills.tools.filter((_, i) => i !== index),
                      })
                    }
                  >
                    <Field
                      label="Name"
                      value={tool.name}
                      onChange={(name) => {
                        const next = [...content.skills.tools];
                        next[index] = { ...tool, name };
                        patch("skills", { ...content.skills, tools: next });
                      }}
                    />
                    <Field
                      label="Level"
                      value={tool.level}
                      onChange={(level) => {
                        const next = [...content.skills.tools];
                        next[index] = { ...tool, level };
                        patch("skills", { ...content.skills, tools: next });
                      }}
                    />
                    <TextArea
                      label="Description"
                      value={tool.description}
                      onChange={(description) => {
                        const next = [...content.skills.tools];
                        next[index] = { ...tool, description };
                        patch("skills", { ...content.skills, tools: next });
                      }}
                    />
                    <StringList
                      label="Used in projects"
                      items={[...tool.projects]}
                      onChange={(projects) => {
                        const next = [...content.skills.tools];
                        next[index] = { ...tool, projects };
                        patch("skills", { ...content.skills, tools: next });
                      }}
                    />
                  </EditorCard>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "sections" ? (
            <div className="mx-auto flex max-w-2xl flex-col gap-4">
              <p className="text-sm text-[var(--ink-soft)]">
                Edit section headings shown on the portfolio page.
              </p>
              {(
                Object.keys(content.sections) as Array<keyof typeof content.sections>
              ).map((key) => (
                <EditorCard key={key} title={key}>
                  <Field
                    label="Title"
                    value={content.sections[key].title}
                    onChange={(title) =>
                      patch("sections", {
                        ...content.sections,
                        [key]: { ...content.sections[key], title },
                      })
                    }
                  />
                  {"subtitle" in content.sections[key] ? (
                    <TextArea
                      label="Subtitle"
                      value={content.sections[key].subtitle ?? ""}
                      onChange={(subtitle) =>
                        patch("sections", {
                          ...content.sections,
                          [key]: { ...content.sections[key], subtitle },
                        })
                      }
                      rows={2}
                    />
                  ) : null}
                </EditorCard>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
