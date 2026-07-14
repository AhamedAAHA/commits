#!/usr/bin/env bash
# Generate / refresh project thumbnails at 1280x720
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TH="$ROOT/public/thumbnails"
SRC="$ROOT/Thumbnail"
mkdir -p "$TH"

resize_jpg() {
  convert "$1" -resize 1280x720^ -gravity center -extent 1280x720 -strip -quality 88 "$2"
}

brand_thumb() {
  local name="$1" accent="$2" out="$3"
  convert -size 1280x720 \
    "gradient:#0a100b-#141f16" \
    -fill "$accent" -font DejaVu-Sans-Bold -pointsize 72 -gravity center \
    -annotate +0-40 "$name" \
    -fill '#b8c4bc' -font DejaVu-Sans -pointsize 28 -gravity center \
    -annotate +0+60 "Ahamed AAH · Portfolio" \
    -strip -quality 88 "$out"
}

screenshot() {
  google-chrome --headless --disable-gpu --hide-scrollbars \
    --screenshot="$2" --window-size=1280,720 "$1" 2>/dev/null
  convert "$2" -resize 1280x720^ -gravity center -extent 1280x720 -strip -quality 88 "$2"
}

# Branded sources
resize_jpg "$SRC/cover-image.png" "$TH/neuroloom.jpg"
curl -sL -o /tmp/aria-thumb.png "https://aria-zeta-virid.vercel.app/aria-thumbnail.png"
resize_jpg /tmp/aria-thumb.png "$TH/aria.jpg"

# Live app screenshots
for pair in \
  "https://kagent-nine.vercel.app/|$TH/kagent.jpg" \
  "https://adgpt-nine.vercel.app/|$TH/adgpt.jpg" \
  "https://cyanide-x.vercel.app/|$TH/cyanidex.jpg" \
  "https://sentra-one-kappa.vercel.app/|$TH/sentra.jpg" \
  "https://suzie-ashy.vercel.app/|$TH/suzie.jpg" \
  "https://5b37e66a.lumora-3a5.pages.dev/|$TH/lumora.jpg" \
  "https://15e26ddc.gesturemed.pages.dev/|$TH/gesturemed.jpg" \
  "https://aaha1.netlify.app/|$TH/smart-study-companion.jpg" \
  "https://b398f333.deebug.pages.dev/|$TH/deebug.jpg"; do
  url="${pair%%|*}"
  out="${pair##*|}"
  screenshot "$url" "$out" || brand_thumb "$(basename "$out" .jpg)" "#6ee7a8" "$out"
done

# Photo assets where available
if [[ -f "$SRC/photo_2_2026-07-10_05-25-30.jpg" ]]; then
  resize_jpg "$SRC/photo_2_2026-07-10_05-25-30.jpg" "$TH/gesturemed.jpg"
fi

# Branded placeholders for projects without dedicated art
brand_thumb "SANTRA AI" "#a78bfa" "$TH/santra.jpg"
brand_thumb "Neural OPS" "#f97316" "$TH/neural-ops.jpg"
brand_thumb "Bismi" "#38bdf8" "$TH/bismi.jpg"
brand_thumb "AERIS X" "#94a3b8" "$TH/aerospace.jpg"
brand_thumb "TorqueX AI" "#ef4444" "$TH/torquex.jpg"
brand_thumb "Golden Fork" "#eab308" "$TH/golden-fork.jpg"
brand_thumb "RailLink" "#22d3ee" "$TH/raillink.jpg"
brand_thumb "InkSpire" "#c084fc" "$TH/inkspire.jpg"
brand_thumb "Portfolio" "#34d399" "$TH/portfolio.jpg"

echo "Thumbnails written to $TH"
