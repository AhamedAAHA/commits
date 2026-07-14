import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const item: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.95, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

type StaggerRevealProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
};

export function StaggerReveal({
  children,
  className = "",
  itemClassName = "",
}: StaggerRevealProps) {
  const reduceMotion = useReducedMotion();

  const childArray = Array.isArray(children) ? children : children != null ? [children] : [];

  if (reduceMotion) {
    return (
      <div className={className}>
        {childArray.map((child, index) => (
          <div key={index} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      {childArray.map((child, index) => (
        <motion.div key={index} className={itemClassName} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
