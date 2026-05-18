import { defineNitroPlugin } from 'nitropack/runtime';
import { toMarkdownPath, renderLinkAlternateHeader } from '@dualmark/core';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    const contentType = response.headers?.['content-type'] || response.headers?.['Content-Type'];
    
    // Only inject for HTML responses
    if (typeof contentType === 'string' && contentType.toLowerCase().includes('text/html')) {
      const url = new URL(event.node.req.url || '/', `http://${event.node.req.headers.host || 'localhost'}`);
      
      // Don't inject on .md routes
      if (!url.pathname.endsWith('.md')) {
        const mdUrl = toMarkdownPath(url.pathname);
        const linkHeader = renderLinkAlternateHeader(url.pathname, mdUrl);
        
        const existingLink = response.headers?.['link'] || response.headers?.['Link'];
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
