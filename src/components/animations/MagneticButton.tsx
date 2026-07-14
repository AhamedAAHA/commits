import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

/** Native handlers that conflict with framer-motion's re-typed drag/animation events. */
type MotionSafe<T> = Omit<
  T,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

function useMagnetic(strength: number) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  function onMouseMove(e: { currentTarget: HTMLElement; clientX: number; clientY: number }) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / rect.width) * strength);
    y.set((relY / rect.height) * strength);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return { springX, springY, onMouseMove, onMouseLeave };
}

interface MagneticExtra {
  strength?: number;
}

export function MagneticButton({
  strength = 16,
  className = "",
  children,
  ...rest
}: MagneticExtra & MotionSafe<ButtonHTMLAttributes<HTMLButtonElement>>) {
  const ref = useRef<HTMLButtonElement>(null);
  const { springX, springY, onMouseMove, onMouseLeave } = useMagnetic(strength);

  return (
    <motion.button
      ref={ref}
      className={`magnetic inline-flex ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.94 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function MagneticLink({
  strength = 16,
  className = "",
  children,
  ...rest
}: MagneticExtra & MotionSafe<AnchorHTMLAttributes<HTMLAnchorElement>>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { springX, springY, onMouseMove, onMouseLeave } = useMagnetic(strength);

  return (
    <motion.a
      ref={ref}
      className={`magnetic inline-flex ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.94 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
