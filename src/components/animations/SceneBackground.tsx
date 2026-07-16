import { Suspense, lazy } from "react";
import { useTheme } from "../../context/ThemeContext";

const SceneCanvas = lazy(() =>
  import("../three/SceneCanvas").then((m) => ({ default: m.SceneCanvas })),
);

/**
 * Fixed ambient backdrop: a lightweight WebGL field of floating 3D shapes
 * (real lighting, gentle drift, scroll-linked camera) sitting under a soft
 * color grade and fine grain. Deliberately visible — and tuned separately —
 * in both light and dark themes.
 */
export function SceneBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* base color grade */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 90% 65% at 50% -8%, oklch(0.24 0.03 260 / 0.75), transparent), var(--void)"
            : "radial-gradient(ellipse 90% 65% at 50% -8%, oklch(0.9 0.015 260 / 0.8), transparent), var(--void)",
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
            ? "radial-gradient(ellipse 100% 85% at 50% 45%, transparent 35%, oklch(0.04 0.01 260 / 0.62) 100%)"
            : "radial-gradient(ellipse 100% 85% at 50% 45%, transparent 40%, oklch(0.98 0.004 260 / 0.7) 100%)",
        }}
      />
    </div>
  );
}
