import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { FloatingField } from "./FloatingField";

/**
 * Fixed, full-viewport WebGL backdrop: a field of low-poly shapes with real
 * lighting, drifting gently and easing along a scroll-linked camera dolly.
 * Capped pixel ratio + modest object count keep it light on the GPU.
 */
export function SceneCanvas() {
  const reduceMotion = Boolean(useReducedMotion());
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 30 }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <FloatingField isDark={isDark} reduceMotion={reduceMotion} />
      </Suspense>
    </Canvas>
  );
}
