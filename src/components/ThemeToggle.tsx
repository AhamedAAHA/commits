import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { MagneticButton } from "./animations/MagneticButton";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <MagneticButton
      type="button"
      onClick={toggleTheme}
      strength={10}
      data-cursor-text="THEME"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="focus-ring relative h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--line)] text-[var(--ink-soft)] transition hover:border-[var(--accent-soft)] hover:text-[var(--ink)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-4 w-4" aria-hidden />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-4 w-4" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </MagneticButton>
  );
}
