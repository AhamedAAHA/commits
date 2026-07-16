import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  Code2,
  Database,
  Layers,
  type LucideIcon,
  X,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  skillsTabs,
  type CoreCategory,
  type CoreCategoryIcon,
  type ExpertiseArea,
  type SkillsTabId,
  type ToolItem,
} from "../data/skillsData";
import { useContent } from "../context/ContentContext";
import { useTilt } from "../lib/useTilt";
import { Section } from "./Section";

const CORE_ICONS: Record<CoreCategoryIcon, LucideIcon> = {
  frontend: Code2,
  backend: Database,
  ai: Brain,
  engineering: Layers,
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function CoreCategoryCard({
  category,
  index,
  isExpanded,
  onToggle,
}: {
  category: CoreCategory;
  index: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const tilt = useTilt<HTMLDivElement>(4);
  const PREVIEW_COUNT = 6;
  const Icon = CORE_ICONS[category.icon];
  const hasMore = category.skills.length > PREVIEW_COUNT;
  const visibleSkills = isExpanded
    ? category.skills
    : category.skills.slice(0, PREVIEW_COUNT);
  const hiddenCount = category.skills.length - PREVIEW_COUNT;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: reduceMotion ? 0 : index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="skills-core-card group relative"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-[1.65rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.7 0.15 258 / 0.4), transparent, oklch(0.7 0.15 258 / 0.2))",
        }}
        aria-hidden
      />
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="glass glass-hover spotlight-card relative h-full overflow-hidden rounded-[1.6rem] p-5 [transform-style:preserve-3d] sm:p-6"
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
          style={{ background: "oklch(0.7 0.15 258 / 0.3)" }}
          aria-hidden
        />
        <div className="relative mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_0_24px_oklch(0.7_0.15_258/0.12)]">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="text-base font-semibold text-[var(--ink)] sm:text-lg">
            {category.title}
          </h3>
        </div>
        <ul className="relative flex flex-wrap gap-2">
          {visibleSkills.map((skill) => (
            <li key={skill}>
              <span className="skills-pill inline-block rounded-full border border-[var(--line)] bg-[var(--overlay-base)]/25 px-3 py-1.5 text-xs font-medium text-[var(--ink-soft)] transition-colors duration-200 group-hover:border-[oklch(0.7_0.15_258/0.3)] group-hover:text-[var(--ink)]">
                {skill}
              </span>
            </li>
          ))}
          {hasMore ? (
            <li>
              <button
                type="button"
                onClick={() => onToggle(category.id)}
                aria-expanded={isExpanded}
                className="focus-ring skills-pill inline-block rounded-full border border-[oklch(0.7_0.15_258/0.35)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition-colors duration-200 hover:bg-[oklch(0.7_0.15_258_/0.2)]"
              >
                {isExpanded ? "Show less" : `+${hiddenCount} more`}
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </motion.article>
  );
}

function CoreTab({ categories }: { categories: CoreCategory[] }) {
  const reduceMotion = useReducedMotion();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <motion.div
      key="core"
      variants={tabContentVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-4 sm:grid-cols-2"
    >
      {categories.map((category, index) => (
        <CoreCategoryCard
          key={category.id}
          category={category}
          index={index}
          isExpanded={expandedIds.has(category.id)}
          onToggle={toggleExpanded}
        />
      ))}
    </motion.div>
  );
}

function ExpertiseAreaCard({ area, index }: { area: ExpertiseArea; index: number }) {
  const reduceMotion = useReducedMotion();
  const tilt = useTilt<HTMLDivElement>(4);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: reduceMotion ? 0 : index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="glass glass-hover spotlight-card relative h-full overflow-hidden rounded-[1.6rem] p-6 [transform-style:preserve-3d] sm:p-7"
      >
        <div
          className="pointer-events-none absolute -left-6 bottom-0 h-24 w-24 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-50"
          style={{ background: "oklch(0.7 0.15 258 / 0.28)" }}
          aria-hidden
        />
        <div className="relative flex items-start gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--overlay-base)]/30 text-2xl"
            aria-hidden
          >
            {area.emoji}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-[var(--ink)]">{area.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
              {area.description}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ExpertiseTab({ areas }: { areas: ExpertiseArea[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key="expertise"
      variants={tabContentVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-4 sm:grid-cols-2"
    >
      {areas.map((area, index) => (
        <ExpertiseAreaCard key={area.id} area={area} index={index} />
      ))}
    </motion.div>
  );
}

type ToolModalProps = {
  tool: ToolItem;
  onClose: () => void;
};

function ToolModal({ tool, onClose }: ToolModalProps) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center sm:p-6"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      role="presentation"
      onClick={onClose}
    >
      <motion.div
        className="absolute inset-0 bg-[oklch(0.04_0.01_260/0.72)] backdrop-blur-md"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        aria-hidden
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="glass relative w-full max-w-lg overflow-hidden rounded-[1.75rem] p-6 shadow-[0_40px_100px_-24px_oklch(0_0_0/0.85)] sm:p-8"
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl"
          style={{ background: "oklch(0.81 0.15 258 / 0.22)" }}
          aria-hidden
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              Technology
            </p>
            <h3 id={titleId} className="mt-1 font-display text-3xl text-[var(--ink)]">
              {tool.name}
            </h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="focus-ring rounded-xl border border-[var(--line)] bg-[var(--overlay-base)]/25 p-2 text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
            aria-label={`Close ${tool.name} details`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="relative mt-5 text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
          {tool.description}
        </p>

        <div className="relative mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-faint)]">
            Experience Level
          </p>
          <span className="mt-2 inline-flex rounded-full border border-[oklch(0.81_0.15_258/0.35)] bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
            {tool.level}
          </span>
        </div>

        <div className="relative mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-faint)]">
            Projects Used In
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {tool.projects.map((project) => (
              <li
                key={project}
                className="rounded-xl border border-[var(--line)] bg-[var(--overlay-base)]/20 px-3 py-2 text-sm text-[var(--ink-soft)]"
              >
                {project}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function ToolsTab({
  tools,
  onSelectTool,
}: {
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key="tools"
      variants={tabContentVariants}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      {tools.map((tool, index) => (
        <motion.button
          key={tool.id}
          type="button"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.35,
            delay: reduceMotion ? 0 : index * 0.025,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          onClick={() => onSelectTool(tool)}
          className="skills-tool-card focus-ring group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--overlay-base)]/20 p-4 text-left transition-colors hover:border-[oklch(0.81_0.15_258/0.34)] sm:p-5"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, oklch(0.81 0.15 258 / 0.14), transparent 70%)",
            }}
            aria-hidden
          />
          <span className="relative block text-sm font-semibold text-[var(--ink)] sm:text-base">
            {tool.name}
          </span>
          <span className="relative mt-1 block text-xs text-[var(--ink-faint)]">
            {tool.level}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

export function SkillsSection() {
  const { content } = useContent();
  const { coreCategories, expertiseAreas, tools, title, subtitle } =
    content.skills;
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<SkillsTabId>("core");
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => setSelectedTool(null), []);

  return (
    <Section id="skills" title={title} subtitle={subtitle}>
      <div className="skills-showcase">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Skills categories"
          className="relative mb-8 inline-flex w-full max-w-full flex-wrap gap-1 rounded-2xl border border-[var(--line)] bg-[var(--overlay-base)]/25 p-1.5 sm:w-auto"
        >
          {skillsTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`skills-panel-${tab.id}`}
                id={`skills-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`focus-ring relative z-10 min-h-11 flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none sm:px-6 ${
                  isActive ? "text-[var(--accent-ink)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="skills-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-[var(--accent)] shadow-[0_0_28px_oklch(0.81_0.15_258/0.35)]"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                ) : null}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`skills-panel-${activeTab}`}
          aria-labelledby={`skills-tab-${activeTab}`}
        >
          <AnimatePresence mode="wait">
            {activeTab === "core" ? (
              <CoreTab key="core-panel" categories={coreCategories} />
            ) : null}
            {activeTab === "expertise" ? (
              <ExpertiseTab key="expertise-panel" areas={expertiseAreas} />
            ) : null}
            {activeTab === "tools" ? (
              <ToolsTab
                key="tools-panel"
                tools={tools}
                onSelectTool={setSelectedTool}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedTool ? <ToolModal tool={selectedTool} onClose={closeModal} /> : null}
      </AnimatePresence>
    </Section>
  );
}
