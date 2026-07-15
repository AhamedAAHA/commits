import { MousePointer2, MousePointerClick } from "lucide-react";
import { useCursorSetting } from "../context/CursorContext";
import { MagneticButton } from "./animations/MagneticButton";

/**
 * Lets visitors opt out of the custom cursor if they'd rather use their
 * system pointer. Only meaningful on fine-pointer devices, so it's hidden
 * on touch screens via the `hidden sm:inline-flex` treatment at call sites.
 */
export function CursorToggle() {
  const { cursorEnabled, toggleCursor } = useCursorSetting();

  return (
    <MagneticButton
      type="button"
      onClick={toggleCursor}
      strength={10}
      data-cursor-text={cursorEnabled ? "OFF" : "ON"}
      aria-label={cursorEnabled ? "Turn off custom cursor" : "Turn on custom cursor"}
      aria-pressed={cursorEnabled}
      className="focus-ring hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink-soft)] transition hover:border-[var(--accent-soft)] hover:text-[var(--ink)] sm:inline-flex"
    >
      {cursorEnabled ? (
        <MousePointerClick className="h-4 w-4" aria-hidden />
      ) : (
        <MousePointer2 className="h-4 w-4" aria-hidden />
      )}
    </MagneticButton>
  );
}
