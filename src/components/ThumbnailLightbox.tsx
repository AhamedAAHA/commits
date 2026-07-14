import { X, ZoomIn } from "lucide-react";
import { useEffect } from "react";

interface ThumbnailLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ThumbnailLightbox({ src, alt, onClose }: ThumbnailLightboxProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#070b08]/92 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Full image: ${alt}`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="focus-ring absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-black/60 text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        aria-label="Close image preview"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      <figure
        className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-[var(--line)] bg-black/40 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[85vh] w-full object-contain"
          decoding="async"
        />
        <figcaption className="flex items-center gap-2 border-t border-[var(--line)] px-4 py-3 text-sm text-[var(--ink-soft)]">
          <ZoomIn className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
          {alt}
        </figcaption>
      </figure>
    </div>
  );
}
