import { Component, type ErrorInfo, type ReactNode } from "react";
import { siteContent } from "../data/siteContent";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Portfolio render failed", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center px-4 py-16">
          <div className="glass max-w-xl rounded-3xl p-6 text-center sm:p-8">
            <p className="font-display text-3xl text-[var(--ink)]">
              {siteContent.hero.name}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
              The portfolio hit a rendering issue. Please refresh the page, or
              contact me directly at{" "}
              <a
                className="focus-ring text-[var(--accent)] underline underline-offset-4"
                href={`mailto:${siteContent.contact.email}`}
              >
                {siteContent.contact.email}
              </a>
              .
            </p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
