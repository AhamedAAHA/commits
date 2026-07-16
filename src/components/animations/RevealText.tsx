import { motion, useReducedMotion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: "100%" },
  show: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

interface RevealTextProps {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  wordClassName?: string;
  delay?: number;
}

function Words({ text, wordClassName }: { text: string; wordClassName: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="mr-[0.28em] inline-block overflow-hidden pb-[0.1em] align-bottom last:mr-0"
        >
          <motion.span className={`inline-block ${wordClassName}`} variants={word}>
            {w}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export function RevealText({
  text,
  as = "span",
  className = "",
  wordClassName = "",
  delay = 0,
}: RevealTextProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    if (as === "h1") return <h1 className={className}>{text}</h1>;
    if (as === "h2") return <h2 className={className}>{text}</h2>;
    if (as === "p") return <p className={className}>{text}</p>;
    return <span className={className}>{text}</span>;
  }

  const common = {
    variants: container,
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.4 },
    transition: { delayChildren: delay },
    className,
  };

  if (as === "h1")
    return (
      <motion.h1 {...common}>
        <Words text={text} wordClassName={wordClassName} />
      </motion.h1>
    );
  if (as === "h2")
    return (
      <motion.h2 {...common}>
        <Words text={text} wordClassName={wordClassName} />
      </motion.h2>
    );
  if (as === "p")
    return (
      <motion.p {...common}>
        <Words text={text} wordClassName={wordClassName} />
      </motion.p>
    );
  return (
    <motion.span {...common}>
      <Words text={text} wordClassName={wordClassName} />
    </motion.span>
  );
}
