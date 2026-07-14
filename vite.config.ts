import process from "node:process";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sendGitHubActivityResponse } from "./server/githubActivity.js";

/**
 * Asset base URL.
 * - Netlify / Vercel at domain root: keep default "/".
 * - GitHub Pages project site: set env `VITE_BASE_PATH=/your-repo-name/` when building.
 * - Vercel always serves this project from the domain root; ignore any inherited
 *   VITE_BASE_PATH there so stale env vars cannot point assets at a subpath.
 * Avoid `base: "./"` here: with SPA `/* -> /index.html`, a page opened under a path
 * would resolve `./assets/*` incorrectly and load nothing (blank screen).
 */
function resolveBase(): string {
  if (process.env.VERCEL) return "/";

  const raw = process.env.VITE_BASE_PATH?.trim();
  if (!raw) return "/";
  if (raw === "/") return "/";
  return raw.endsWith("/") ? raw : `${raw}/`;
}

function resolveSiteUrl(base: string): string {
  const raw = process.env.VITE_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");
  }

  if (process.env.URL) {
    return process.env.URL.replace(/\/$/, "");
  }

  if (process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL.replace(/\/$/, "");
  }

  const basePath = base === "/" ? "" : base.replace(/\/$/, "");
  return basePath ? `https://example.com${basePath}` : "https://example.com";
}

function siteMetaPlugin(siteUrl: string): Plugin {
  const ogImage = `${siteUrl}/og-image.jpg`;

  return {
    name: "site-meta",
    transformIndexHtml(html) {
      return html
        .replaceAll("%SITE_URL%", siteUrl)
        .replaceAll("%OG_IMAGE%", ogImage);
    },
  };
}

function githubActivityDevApiPlugin(): Plugin {
  return {
    name: "github-activity-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/github-activity", async (request, response) => {
        try {
          const url = new URL(request.url ?? "", "http://localhost");
          const username = url.searchParams.get("username")?.trim() || "AhamedAAHA";
          const body = await sendGitHubActivityResponse(username);

          response.statusCode = 200;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify(body));
        } catch {
          response.statusCode = 502;
          response.setHeader("Content-Type", "application/json");
          response.end(
            JSON.stringify({
              commits: [],
              error: "Unable to load GitHub activity.",
            }),
          );
        }
      });
    },
  };
}

const base = resolveBase();
const siteUrl = resolveSiteUrl(base);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  for (const [key, value] of Object.entries(env)) {
    process.env[key] ??= value;
  }

  return {
    base,
    plugins: [githubActivityDevApiPlugin(), react(), tailwindcss(), siteMetaPlugin(siteUrl)],
    build: {
      target: "es2020",
      chunkSizeWarningLimit: 900,
    },
  };
});
