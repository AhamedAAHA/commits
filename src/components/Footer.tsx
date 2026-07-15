import { ArrowUp } from "lucide-react";
import type { NavItem, SocialLink } from "../data/siteContent";
import { scrollToSection } from "../lib/smoothScroll";
import { MagneticButton } from "./animations/MagneticButton";
import { SocialLinks } from "./SocialLinks";

interface FooterProps {
  name: string;
  nav: readonly NavItem[];
  socials: readonly SocialLink[];
}

export function Footer({ name, nav, socials }: FooterProps) {
  const year = new Date().getFullYear();

  function scrollTo(id: string) {
    scrollToSection(id);
  }

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--void)]/45 px-4 py-12 backdrop-blur-xl sm:px-6 lg:px-8">
      <span
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
        }}
        aria-hidden
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-display text-xl text-[var(--ink)]">{name}</p>
          <p className="font-mono-ui mt-1 text-xs text-[var(--ink-faint)]">
            &copy; {year} {name} — built with React + Vite
          </p>
          <div className="mt-6">
            <SocialLinks links={socials} />
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="font-mono-ui mb-3 text-xs uppercase tracking-widest text-[var(--ink-faint)]">
            // sections
          </p>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
            {nav.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="focus-ring text-sm text-[var(--ink-soft)] transition hover:text-[var(--accent)]"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <MagneticButton
        type="button"
        onClick={() => scrollTo("top")}
        data-cursor-text="UP"
        aria-label="Back to top"
        className="focus-ring glass glass-hover absolute -top-6 right-4 h-12 w-12 items-center justify-center rounded-full text-[var(--ink)] sm:right-6 lg:right-8"
      >
        <ArrowUp className="h-5 w-5" aria-hidden />
      </MagneticButton>
    </footer>
  );
}
