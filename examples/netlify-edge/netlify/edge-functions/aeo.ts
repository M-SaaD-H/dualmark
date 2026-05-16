/**
 * Netlify Edge Function — AEO adapter entrypoint.
 *
 * Architecture:
 *   - Astro builds to ./dist/ as static HTML + .md twins
 *   - Netlify serves the dist/ directory as static files
 *   - This edge function intercepts all requests before they reach the static files
 *   - AI bots and Accept: text/markdown clients receive markdown
 *   - All other traffic falls through via context.next() to the static site
 */
import { createAEOHandler } from "@dualmark/netlify";
import type { AIRequestInfo, MissInfo } from "@dualmark/netlify"

export default createAEOHandler({
  trailingSlash: "never",
  enableLinkHeader: true,
  hooks: {
    onAIRequest: (info: AIRequestInfo) => {
      // Hooks run inside the request lifecycle — keep them cheap.
      console.log(
        `[dualmark] ai-hit bot=${info.botName ?? "?"} path=${info.pathname} cache=${info.cacheStatus} tokens=${info.tokens}`,
      );
    },
    onMiss: (info: MissInfo) => {
      console.warn(`[dualmark] miss bot=${info.botName ?? "?"} path=${info.pathname}`);
    },
  },
});

export const config = { 
  path: "/*",
  excludedPath: [
    "/*.md",
    "/_astro/*",
    "/favicon.*"
  ]
};
