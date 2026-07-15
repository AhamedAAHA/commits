import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCursorSetting } from "../../context/CursorContext";

/**
 * Reticle-style cursor. Replaces the native pointer on fine-pointer,
 * non-touch devices only — touch, reduced-motion, and opted-out users
 * keep the system cursor.
 */
export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const { cursorEnabled } = useCursorSetting();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { damping: 28, stiffness: 320, mass: 0.5 });
  const ringY = useSpring(dotY, { damping: 28, stiffness: 320, mass: 0.5 });

  useEffect(() => {
    const supportsFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (!supportsFinePointer || reduceMotion || !cursorEnabled) {
      document.documentElement.classList.remove("has-custom-cursor");
      setEnabled(false);
      return;
    }

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    function onMove(e: MouseEvent) {
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      const target = (e.target as HTMLElement)?.closest?.(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]',
      );
      setHovering(Boolean(target));
      setLabel(target?.getAttribute("data-cursor-text") ?? null);
    }

    function onDown() {
      setPressed(true);
    }
    function onUp() {
      setPressed(false);
    }
    function onLeave() {
      dotX.set(-100);
      dotY.set(-100);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [dotX, dotY, reduceMotion, cursorEnabled]);

  if (!enabled) return null;

  const ringSize = hovering ? 52 : 34;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      {/* Precision dot */}
      <motion.div
        className="fixed left-0 top-0 rounded-full bg-[var(--accent)]"
        style={{
          x: dotX,
          y: dotY,
          width: 5,
          height: 5,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: pressed ? 0.4 : hovering ? 0 : 1 }}
        transition={{ duration: 0.18 }}
      />

      {/* Trailing reticle ring */}
      <motion.div
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: hovering ? "var(--accent)" : "oklch(0.7 0.01 260 / 0.45)",
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          scale: pressed ? 0.85 : 1,
          backgroundColor: hovering ? "var(--accent-soft)" : "oklch(1 0 0 / 0)",
        }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
      >
        {/* Reticle ticks */}
        {!hovering && (
          <>
            <span className="absolute -top-1.5 left-1/2 h-1.5 w-px -translate-x-1/2 bg-[var(--ink-faint)]" />
            <span className="absolute -bottom-1.5 left-1/2 h-1.5 w-px -translate-x-1/2 bg-[var(--ink-faint)]" />
            <span className="absolute left-1.5 top-1/2 h-px w-1.5 -translate-y-1/2 bg-[var(--ink-faint)]" />
            <span className="absolute right-1.5 top-1/2 h-px w-1.5 -translate-y-1/2 bg-[var(--ink-faint)]" />
          </>
        )}
        {label ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-mono-ui whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-[var(--ink)]"
          >
            {label}
          </motion.span>
        ) : null}
      </motion.div>
    </div>
  );
}
