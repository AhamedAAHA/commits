import { Suspense, lazy } from "react";
import { useTheme } from "../../context/ThemeContext";

const SceneCanvas = lazy(() =>
  import("../three/SceneCanvas").then((m) => ({ default: m.SceneCanvas })),
);

/**
 * Fixed ambient backdrop: portrait-matched sage / silver / warm-beige lighting
 * on the floating 3D field, plus soft grade, grain, and vignette so glass UI
 * stays readable in both themes.
 */
export function SceneBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* base color grade — warm olive tint from the portrait */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 90% 65% at 50% -8%, oklch(0.22 0.025 130 / 0.55), transparent), radial-gradient(ellipse 55% 45% at 85% 15%, oklch(0.28 0.02 70 / 0.22), transparent), var(--void)"
            : "radial-gradient(ellipse 90% 65% at 50% -8%, oklch(0.92 0.02 95 / 0.7), transparent), radial-gradient(ellipse 55% 45% at 85% 15%, oklch(0.9 0.02 70 / 0.35), transparent), var(--void)",
        }}
      />

      <Suspense fallback={null}>
        <SceneCanvas />
      </Suspense>

      <div className="grain-overlay" />

      {/* edge vignette so text stays readable over the 3D field */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 100% 85% at 50% 45%, transparent 35%, oklch(0.06 0.01 130 / 0.62) 100%)"
            : "radial-gradient(ellipse 100% 85% at 50% 45%, transparent 40%, oklch(0.97 0.008 95 / 0.72) 100%)",
        }}
      />
    </div>
  );
}
