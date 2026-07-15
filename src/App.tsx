import { useState, useCallback, useEffect, type CSSProperties } from "react";
import { AnimatePresence } from "framer-motion";
import { AboutSection } from "./components/AboutSection";
import { AdminButton } from "./components/admin/AdminButton";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminPanel } from "./components/admin/AdminPanel";
import { SceneBackground } from "./components/animations/SceneBackground";
import { CustomCursor } from "./components/animations/CustomCursor";
import { Preloader } from "./components/animations/Preloader";
import { ScrollReveal } from "./components/animations/ScrollReveal";
import { SmoothScroll } from "./components/animations/SmoothScroll";
import { StaggerReveal } from "./components/animations/StaggerReveal";
import { scrollToSection } from "./lib/smoothScroll";
import { Footer } from "./components/Footer";
import { GitHubActivity } from "./components/GitHubActivity";
import { HackathonCard } from "./components/HackathonCard";
import { Hero } from "./components/Hero";
import { JourneyModal } from "./components/JourneyModal";
import { Navbar } from "./components/Navbar";
import { ProjectCard } from "./components/ProjectCard";
import { Section } from "./components/Section";
import { ShowcaseModal } from "./components/ShowcaseModal";
import { SkillsSection } from "./components/SkillsSection";
import { SocialLinks } from "./components/SocialLinks";
import { TechMarquee } from "./components/TechMarquee";
import { TimelineCard } from "./components/TimelineCard";
import { useContent } from "./context/ContentContext";
import { findJourney, getFeaturedItems, orderByCatalog } from "./lib/showcaseHelpers";

function App() {
  const { content } = useContent();
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllHackathons, setShowAllHackathons] = useState(false);
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    document.body.style.overflow = booting ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [booting]);

  const featuredProjects = getFeaturedItems(content.projects);
  const featuredHackathons = getFeaturedItems(content.hackathons);
  const activeJourney = activeJourneyId
    ? findJourney(content.experience, activeJourneyId)
    : undefined;

  const scrollToContact = useCallback(() => {
    scrollToSection("contact");
  }, []);

  const openJourney = useCallback((journeyId: string) => {
    setActiveJourneyId(journeyId);
  }, []);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {booting ? (
          <Preloader name={content.hero.name} onDone={() => setBooting(false)} />
        ) : null}
      </AnimatePresence>
      <CustomCursor />
      <SmoothScroll
        paused={
          booting ||
          showAllProjects ||
          showAllHackathons ||
          Boolean(activeJourney)
        }
      />
      <SceneBackground />
      <div className="relative z-10">
        <a className="skip-link focus-ring" href="#main-content">
          Skip to content
        </a>
        <Navbar nav={content.nav} name={content.hero.name} />
        <main id="main-content">
          <Hero
            name={content.hero.name}
            title={content.hero.title}
            tagline={content.hero.tagline}
            location={content.hero.location}
            profileImage={content.hero.profileImage}
            socials={content.socials}
            cvPdfPath={content.cvPdfPath}
            onContactClick={scrollToContact}
          />

          <TechMarquee items={content.skills.tools.map((tool) => tool.name)} />

          <Section id="about" title={content.sections.about.title}>
            <AboutSection
              summary={content.summary}
              stats={[
                { label: "Projects shipped", value: String(content.projects.length) },
                { label: "Hackathons", value: String(content.hackathons.length) },
                {
                  label: "Certifications",
                  value: String(content.certifications.length),
                },
                { label: "Tools & tech", value: String(content.skills.tools.length) },
              ]}
            />
          </Section>

          <Section
            id="projects"
            title={content.sections.projects.title}
            subtitle={content.sections.projects.subtitle}
          >
            <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id ?? project.title}
                  project={project}
                  onOpenJourney={openJourney}
                />
              ))}
            </StaggerReveal>
            {content.projects.length > featuredProjects.length ? (
              <ScrollReveal>
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllProjects(true)}
                    data-cursor-text="VIEW"
                    className="focus-ring font-mono-ui rounded-full border border-[var(--line)] bg-[var(--overlay-base)]/20 px-6 py-3 text-xs uppercase tracking-wider text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    View all projects ···
                  </button>
                </div>
              </ScrollReveal>
            ) : null}
          </Section>

          <SkillsSection />

          <Section
            id="hackathons"
            title={content.sections.hackathons.title}
            subtitle={content.sections.hackathons.subtitle}
          >
            <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredHackathons.map((entry) => (
                <HackathonCard key={entry.id ?? entry.role} entry={entry} compact />
              ))}
            </StaggerReveal>
            {content.hackathons.length > featuredHackathons.length ? (
              <ScrollReveal>
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllHackathons(true)}
                    data-cursor-text="VIEW"
                    className="focus-ring font-mono-ui rounded-full border border-[var(--line)] bg-[var(--overlay-base)]/20 px-6 py-3 text-xs uppercase tracking-wider text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    View all hackathons ···
                  </button>
                </div>
              </ScrollReveal>
            ) : null}
          </Section>

          <Section
            id="education"
            title={content.sections.education.title}
            subtitle={content.sections.education.subtitle}
          >
            <StaggerReveal className="flex flex-col gap-4">
              {content.education.map((edu) => (
                <TimelineCard
                  key={edu.qualification}
                  title={edu.qualification}
                  subtitle={edu.institution}
                  period={edu.period}
                />
              ))}
            </StaggerReveal>

            <ScrollReveal>
              <h3 className="mb-4 mt-12 font-mono-ui text-xs uppercase tracking-widest text-[var(--ink-faint)]">
                Certifications
              </h3>
            </ScrollReveal>
            <StaggerReveal className="flex flex-col gap-4">
              {content.certifications.map((certification) => (
                <TimelineCard
                  key={certification.qualification}
                  title={certification.qualification}
                  subtitle={certification.institution}
                  period={certification.period}
                />
              ))}
            </StaggerReveal>

            <ScrollReveal>
              <h3 className="mb-4 mt-12 font-mono-ui text-xs uppercase tracking-widest text-[var(--ink-faint)]">
                Languages
              </h3>
              <ul className="flex flex-wrap gap-2">
                {content.languages.map((language) => {
                  const fill =
                    language.level.toLowerCase() === "native"
                      ? "100%"
                      : language.level.toLowerCase() === "conversational"
                        ? "50%"
                        : "35%";
                  return (
                    <li
                      key={language.name}
                      className="group relative overflow-hidden rounded-full border border-[var(--line)] bg-[var(--overlay-base)]/20 transition-colors duration-300 hover:border-[oklch(0.81_0.15_258_/0.45)]"
                      style={{ ["--lang-fill" as string]: fill } as CSSProperties}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-[oklch(0.7_0.15_258_/0.32)] transition-[width] duration-500 ease-out group-hover:w-[var(--lang-fill)]"
                      />
                      <span className="relative z-10 inline-flex items-center px-4 py-1.5 text-sm text-[var(--ink-soft)]">
                        <span className="font-medium text-[var(--ink)]">{language.name}</span>
                        <span aria-hidden> · </span>
                        <span>{language.level}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </ScrollReveal>
          </Section>

          <Section
            id="activity"
            title={content.sections.activity.title}
            subtitle={content.sections.activity.subtitle}
          >
            <ScrollReveal>
              <GitHubActivity
                username={content.githubActivity.username}
                profileUrl={content.githubActivity.profileUrl}
              />
            </ScrollReveal>
          </Section>

          <Section
            id="contact"
            title={content.sections.contact.title}
            subtitle={content.sections.contact.subtitle}
          >
            <ScrollReveal>
              <div className="hud-frame glass grid gap-6 rounded-3xl p-6 sm:grid-cols-2 sm:p-8">
                <div>
                  <h3 className="font-mono-ui text-xs uppercase tracking-widest text-[var(--ink-faint)]">
                    Email
                  </h3>
                  <a
                    href={`mailto:${content.contact.email}`}
                    data-cursor-text="MAIL"
                    className="focus-ring mt-2 block text-lg font-medium text-[var(--accent)] hover:underline"
                  >
                    {content.contact.email}
                  </a>
                </div>
                <div>
                  <h3 className="font-mono-ui text-xs uppercase tracking-widest text-[var(--ink-faint)]">
                    Phone
                  </h3>
                  <a
                    href={content.contact.phoneHref}
                    data-cursor-text="CALL"
                    className="focus-ring mt-2 block text-lg font-medium text-[var(--ink)] hover:text-[var(--accent)]"
                  >
                    {content.contact.phoneDisplay}
                  </a>
                </div>
                <div className="sm:col-span-2">
                  <h3 className="font-mono-ui text-xs uppercase tracking-widest text-[var(--ink-faint)]">
                    Location
                  </h3>
                  <p className="mt-2 text-[var(--ink-soft)]">{content.contact.address}</p>
                </div>
                <div className="sm:col-span-2">
                  <SocialLinks links={content.socials} />
                </div>
              </div>
            </ScrollReveal>
          </Section>
        </main>

        <Footer name={content.hero.name} nav={content.nav} socials={content.socials} />
      </div>

      <AdminButton />
      <AdminLogin />
      <AdminPanel />

      {showAllProjects ? (
        <ShowcaseModal
          title="All Projects"
          subtitle={`${content.projects.length} builds across hackathons and independent work`}
          onClose={() => setShowAllProjects(false)}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orderByCatalog(content.projects, content.projects).map((project) => (
              <ProjectCard
                key={project.id ?? project.title}
                project={project}
                onOpenJourney={(id) => {
                  setShowAllProjects(false);
                  openJourney(id);
                }}
              />
            ))}
          </div>
        </ShowcaseModal>
      ) : null}

      {showAllHackathons ? (
        <ShowcaseModal
          title="All Hackathons & Community"
          subtitle={`${content.hackathons.length} entries`}
          onClose={() => setShowAllHackathons(false)}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orderByCatalog(content.hackathons, content.hackathons).map((entry) => (
              <HackathonCard key={entry.id ?? entry.role} entry={entry} />
            ))}
          </div>
        </ShowcaseModal>
      ) : null}

      {activeJourney ? (
        <JourneyModal
          journey={activeJourney}
          onClose={() => setActiveJourneyId(null)}
        />
      ) : null}
    </div>
  );
}

export default App;
