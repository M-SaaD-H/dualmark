import { defineNitroPlugin } from 'nitropack/runtime';
import { toMarkdownPath } from '@dualmark/core';
import { getRequestURL } from 'h3';
import type { H3Event } from 'h3';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event: H3Event) => {
    if (!event.url) {
      try {
        event.url = getRequestURL(event);
      } catch (e) {
        // Ignore
      }
    }

    const req = event.node?.req || (event as any).req;
    if (req && req.headers && typeof req.headers.get !== 'function') {
      req.headers.get = (key: string) => {
        const val = req.headers[key.toLowerCase()];
        return Array.isArray(val) ? val.join(', ') : (val || null);
      };
    }
  });

  nitroApp.hooks.hook('render:response', (response, { event }) => {
    const contentType = response.headers?.['content-type'] || response.headers?.['Content-Type'];

    // Only inject for HTML responses
    if (typeof contentType === 'string' && contentType.toLowerCase().includes('text/html')) {
      const url = getRequestURL(event);

      // Don't inject on .md routes
      if (!url.pathname.endsWith('.md')) {
        const mdUrl = toMarkdownPath(url.pathname);
        const linkHeader = `<${mdUrl}>; rel="alternate"; type="text/markdown"`;

        const existingLink = response.headers?.['link'] || response.headers?.['Link'];
        if (!response.headers) response.headers = {};
        response.headers['link'] = existingLink ? `${existingLink}, ${linkHeader}` : linkHeader;

        const existingVary = response.headers?.['vary'] || response.headers?.['Vary'];
        if (!existingVary) {
          response.headers['vary'] = 'Accept';
        } else if (typeof existingVary === 'string' && !existingVary.split(',').map((s) => s.trim().toLowerCase()).includes('accept')) {
          response.headers['vary'] = `${existingVary}, Accept`;
        }
      }
    }
  });
});
