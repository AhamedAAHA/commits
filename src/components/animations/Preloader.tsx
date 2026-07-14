import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface PreloaderProps {
  name: string;
  onDone: () => void;
}

const BOOT_LINES = [
  "mounting filesystem",
  "compiling experience layer",
  "warming up aurora field",
  "syncing agents",
];

export function Preloader({ name, onDone }: PreloaderProps) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      onDone();
      return;
    }

    const start = performance.now();
    const duration = 1500;
    let raf = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      setLineIndex(
        Math.min(BOOT_LINES.length - 1, Math.floor((pct / 100) * BOOT_LINES.length)),
      );
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(onDone, 380);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[var(--void)]"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        filter: "blur(12px)",
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, oklch(0.62 0.22 293 / 0.25), transparent 70%)",
        }}
      />

      <motion.p
        className="font-mono-ui relative mb-6 text-xs uppercase tracking-[0.3em] text-[var(--aurora-cyan)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        booting portfolio<span className="animate-pulse">_</span>
      </motion.p>

      <motion.h1
        className="font-display relative text-4xl tracking-tight text-[var(--ink)] sm:text-5xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {name}
      </motion.h1>

      <div className="relative mt-8 w-56 sm:w-64">
        <div className="h-px w-full overflow-hidden bg-white/10">
          <motion.div
            className="h-full"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, var(--aurora-violet), var(--aurora-cyan))",
            }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-mono-ui text-[10px] text-[var(--ink-faint)]">
          <span>{BOOT_LINES[lineIndex]}</span>
          <span>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}
