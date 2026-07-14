import { Menu, X } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NavItem } from "../data/siteContent";

interface NavbarProps {
  nav: readonly NavItem[];
  name: string;
}

export function Navbar({ nav, name }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  const scrollTo = useCallback((id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = nav.map((item) => item.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [nav]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const menu = menuRef.current;
    const focusable = menu?.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;

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
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] border-b transition-colors duration-500 ${
        scrolled
          ? "border-white/10 bg-[oklch(0.09_0.025_280_/0.72)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* Scroll progress rail */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px] origin-left"
        style={{
          scaleX: progress,
          background:
            "linear-gradient(90deg, var(--aurora-violet), var(--aurora-cyan), var(--aurora-magenta))",
        }}
      />

      <nav
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <a
          href="#top"
          data-cursor-text="TOP"
          className="focus-ring group flex items-center gap-2 font-display text-lg tracking-tight text-[var(--ink)] sm:text-xl"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("top");
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--aurora-cyan)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--aurora-cyan)]" />
          </span>
          {name}
        </a>

        <ul className="relative hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.id} className="relative">
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                aria-current={activeId === item.id ? "page" : undefined}
                className={`focus-ring font-mono-ui relative z-10 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition hover:text-[var(--ink)] ${
                  activeId === item.id ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"
                }`}
              >
                {item.label}
                {activeId === item.id ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-[oklch(0.72_0.19_290_/0.4)] bg-[oklch(0.72_0.19_290_/0.14)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
              </button>
            </li>
          ))}
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="focus-ring rounded-lg p-2 text-[var(--ink)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </nav>

      {open ? (
        <div
          ref={menuRef}
          id="mobile-nav"
          className="border-t border-[var(--line)] bg-[oklch(0.09_0.025_280_/0.85)] px-4 py-4 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  aria-current={activeId === item.id ? "page" : undefined}
                  className={`focus-ring font-mono-ui w-full rounded-lg px-3 py-3 text-left text-sm uppercase tracking-wider hover:bg-white/[0.06] hover:text-[var(--ink)] ${
                    activeId === item.id
                      ? "bg-white/[0.08] text-[var(--ink)]"
                      : "text-[var(--ink-faint)]"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
