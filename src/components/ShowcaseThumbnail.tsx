interface ShowcaseThumbnailProps {
  src: string;
  label?: string;
  onClick?: () => void;
}

export function ShowcaseThumbnail({ src, label = "", onClick }: ShowcaseThumbnailProps) {
  const clickable = Boolean(onClick);

  return (
    <div className="showcase-card__media relative aspect-video w-full overflow-hidden bg-[oklch(0.08_0.01_140)]">
      <button
        type="button"
        onClick={onClick}
        disabled={!clickable}
        className={`group relative block h-full w-full ${clickable ? "cursor-zoom-in focus-ring" : "cursor-default"}`}
        aria-label={clickable ? `View full image for ${label}` : undefined}
      >
        <img
          src={src}
          alt={label}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
        />
        {clickable ? (
          <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
        ) : null}
      </button>
    </div>
  );
}
