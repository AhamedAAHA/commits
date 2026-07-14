import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  depth?: "subtle" | "strong";
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  depth = "subtle",
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const y = depth === "strong" ? 36 : 22;
  const scale = depth === "strong" ? 0.94 : 0.97;

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
