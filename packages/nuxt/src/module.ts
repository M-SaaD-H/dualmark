import { defineNuxtModule, createResolver, addServerHandler, addServerPlugin, addTemplate } from '@nuxt/kit';
import { resolveConfig, DualmarkConfigError } from './config-validation.js';
import type { DualmarkNuxtConfig, ResolvedDualmarkConfig } from './types.js';

export default defineNuxtModule<DualmarkNuxtConfig>({
  meta: {
    name: '@dualmark/nuxt',
    configKey: 'dualmark',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    let resolved: ResolvedDualmarkConfig;
    try {
      resolved = resolveConfig(options);
    } catch (e) {
      if (nuxt.options._prepare) {
        console.warn('[@dualmark/nuxt] Skipping config validation during prepare.');
        return;
      }
      if (e instanceof DualmarkConfigError) console.error(e.message);
      throw e;
    }

    // Register the server plugin for Link + Vary header injection on HTML responses.
    if (resolved.middleware.injectLinkHeader) {
      addServerPlugin(resolver.resolve('./runtime/server/plugin'));
    }

    const dualmarkConfigStr = JSON.stringify({
      siteUrl: resolved.siteUrl,
      cacheControl: resolved.headers?.cacheControl,
      noindex: resolved.headers?.noindex,
    });

    const routesInjected: string[] = [];
    const prerenderRoutes: string[] = [];

    // Shared getCollection code (embedded in each generated file)
    const contentServerAlias = nuxt.options.alias['#content/server'] || '#content/server';
    const collectionCode = getCollectionCode(contentServerAlias);

    // Per-collection middleware + listing route
    for (const [collectionName, c] of Object.entries(resolved.collections)) {
      const route = c.route ?? collectionName;

      if (typeof c.converter !== 'string') {
        throw new DualmarkConfigError(
          `Dualmark config: collection '${collectionName}' uses an inline converter function, this isn't supported yet. Use a built-in converter name (e.g. 'blog').`
        );
      }

      // Nitro middleware (no route) for content negotiation + markdown serving
      // Mirrors Astro's middleware approach:
      //  - .md requests → serve markdown
      //  - Accept: text/markdown or bot UA → serve markdown at the HTML URL
      //  - Accept that excludes both → 406
      //  - Regular HTML requests → return undefined (pass-through to Nuxt SSR)
      // The beforeResponse plugin then injects Link + Vary on the SSR HTML response.
      const middlewareSource = getMiddlewareCode(
        resolver.resolve('./runtime/server/converter-registry'),
        collectionCode,
        dualmarkConfigStr,
        collectionName,
        '/' + route,
        c.converter as string,
        c.listingMetadata?.title ?? collectionName,
        c.listingMetadata?.description ?? ('All ' + collectionName + ' entries.'),
        c.compareOptions
      );

      const middlewareFile = addTemplate({
        filename: `dualmark/collection-${collectionName}-middleware.ts`,
        getContents: () => middlewareSource,
        write: true,
      });

      // Register WITHOUT a route -> Nitro treats it as middleware (can pass-through).
      addServerHandler({ handler: middlewareFile.dst });
      routesInjected.push(`middleware:/${route}/**`);

      // Listing route: /blog.md
      // Listing is a pure .md endpoint, no HTML twin, so a route handler is fine.
      if (c.emitListing !== false) {
        const listingSource = getListingCode(
          resolver.resolve('./runtime/server/endpoints/listing'),
          collectionCode,
          dualmarkConfigStr,
          collectionName,
          '/' + route,
          c.listingMetadata?.title ?? collectionName,
          c.listingMetadata?.description ?? ('All ' + collectionName + ' entries.')
        );
        const listingFile = addTemplate({
          filename: `dualmark/collection-${collectionName}-listing.ts`,
          getContents: () => listingSource,
          write: true,
        });

        const listingPattern = `/${route}.md`;
        addServerHandler({ route: listingPattern, handler: listingFile.dst });
        routesInjected.push(listingPattern);
        prerenderRoutes.push(listingPattern);
      }
    }

    // Static pages
    for (let i = 0; i < resolved.staticPages.length; i++) {
      const sp = resolved.staticPages[i];
      if (!sp) continue;
      const safe = sp.pattern.replace(/[^a-z0-9]/gi, '_');
      addTemplate({
        filename: `dualmark/static-${i}-${safe}-render.ts`,
        getContents: () => getExportDefaultCode(sp.render.toString()),
        write: true,
      });
      const source = getStaticPageCode(
        resolver.resolve('./runtime/server/endpoints/static'),
        dualmarkConfigStr,
        `./static-${i}-${safe}-render`
      );
      const mdPattern = sp.pattern === '/' ? '/index.md' : sp.pattern.replace(/\/$/, '') + '.md';
      const file = addTemplate({
        filename: `dualmark/static-${i}-${safe}.ts`,
        getContents: () => source,
        write: true,
      });
      addServerHandler({ route: mdPattern, handler: file.dst });
      routesInjected.push(mdPattern);
      prerenderRoutes.push(mdPattern);
    }

    // Parameterized routes
    for (let i = 0; i < resolved.parameterizedRoutes.length; i++) {
      const pr = resolved.parameterizedRoutes[i];
      if (!pr) continue;
      const safe = pr.pattern.replace(/[^a-z0-9]/gi, '_');
      addTemplate({
        filename: `dualmark/param-${i}-${safe}-render.ts`,
        getContents: () => getExportDefaultCode(pr.render.toString()),
        write: true,
      });
      addTemplate({
        filename: `dualmark/param-${i}-${safe}-paths.ts`,
        getContents: () => getExportDefaultCode(pr.getStaticPaths.toString()),
        write: true,
      });
      const source = getParameterizedRouteCode(
        resolver.resolve('./runtime/server/endpoints/parameterized'),
        dualmarkConfigStr,
        `./param-${i}-${safe}-render`,
        `./param-${i}-${safe}-paths`
      );
      const pattern = pr.pattern.startsWith('/') ? pr.pattern + '.md' : `/${pr.pattern}.md`;
      const file = addTemplate({
        filename: `dualmark/param-${i}-${safe}.ts`,
        getContents: () => source,
        write: true,
      });
      const nitroPattern = pattern.replace(/\[([^\]]+)\]/g, ':$1');
      addServerHandler({ route: nitroPattern, handler: file.dst });
      routesInjected.push(nitroPattern);
      prerenderRoutes.push(nitroPattern);
    }

    // llms.txt
    if (resolved.llmsTxt?.enabled) {
      const sections = resolved.llmsTxt.sections ?? [];
      const source = getLlmsTxtCode(
        resolver.resolve('./runtime/server/endpoints/llms-txt'),
        resolved.llmsTxt.brandName ?? 'Site',
        resolved.llmsTxt.description ?? '',
        sections
      );
      const llmsFile = addTemplate({
        filename: `dualmark/llms-txt.ts`,
        getContents: () => source,
        write: true,
      });
      addServerHandler({ route: '/llms.txt', handler: llmsFile.dst });
      routesInjected.push('/llms.txt');
      prerenderRoutes.push('/llms.txt');
    }

    const middlewareCount = Object.keys(resolved.collections).length;
    console.log(`[@dualmark/nuxt] Injected ${routesInjected.length} route(s)/middleware(s) (${middlewareCount} collection middleware(s) + 1 plugin)`);

    // Prerender listing and llms.txt endpoints at build time
    nuxt.hook('prerender:routes', ({ routes }) => {
      for (const route of prerenderRoutes) {
        routes.add(route);
      }
    });
  },
});

function getCollectionCode(contentServerAlias: string) {
  return `
import { serverQueryContent } from ${JSON.stringify(contentServerAlias)};
const getCollection = async (event, name, filter) => {
  const docs = await serverQueryContent(event, name).find();
  let entries = docs.map(doc => {
    const id = doc._path ? doc._path.replace(new RegExp('^/' + name + '/?'), '') : doc.title || '';
    const rawDate = doc.publishedDate || doc.pubDate || doc.date;
    if (rawDate) doc.publishedDate = new Date(rawDate);
    if (doc.modifiedDate) doc.modifiedDate = new Date(doc.modifiedDate);
    return { id, data: doc, body: '' };
  });
  if (filter) entries = entries.filter(filter);
  return entries;
};
`;
}

function getMiddlewareCode(
  resolverPath: string,
  collectionCode: string,
  dualmarkConfigStr: string,
  collectionName: string,
  basePath: string,
  converterName: string,
  listingTitle: string,
  listingDescription: string,
  compareOptions?: { ourBrandColumn?: string }
) {
  return `
import { defineEventHandler } from 'h3';
import { negotiateFormat, detectAIBot, toMarkdownPath, markdownResponse, listingToMarkdown } from '@dualmark/core';
import { resolveBuiltInConverter } from ${JSON.stringify(resolverPath)};
${collectionCode}
const dualmarkConfig = ${dualmarkConfigStr};
const COLLECTION_NAME = ${JSON.stringify(collectionName)};
const BASE_PATH = ${JSON.stringify(basePath)};
const CONVERTER_NAME = ${JSON.stringify(converterName)};
const LISTING_TITLE = ${JSON.stringify(listingTitle)};
const LISTING_DESCRIPTION = ${JSON.stringify(listingDescription)};
const COMPARE_OPTIONS = ${JSON.stringify(compareOptions)};

export default defineEventHandler(async (event) => {
  const path = (event.path ?? '/').split('?')[0];

  // Quickly bail out for paths that don't belong to this collection.
  const isListing = path === BASE_PATH + '.md';
  const isUnderBase = path.startsWith(BASE_PATH + '/');
  if (!isListing && !isUnderBase) return;

  const isMd = path.endsWith('.md');
  // h3 v2: event.req is a Web Fetch Request (headers.get); h3 v1: event.node.req.headers is a plain object
  const accept = (event.req?.headers?.get?.('accept') ?? event.node?.req?.headers?.['accept']) || '';
  const ua = (event.req?.headers?.get?.('user-agent') ?? event.node?.req?.headers?.['user-agent']) || '';
  const botInfo = detectAIBot(ua);
  const format = negotiateFormat(accept);

  // 406: client's Accept explicitly excludes both text/html and text/markdown
  if (!isMd && format === null && !botInfo.isBot) {
    return new Response('Not Acceptable', { status: 406 });
  }

  const serveMarkdown = isMd || botInfo.isBot || format === 'markdown';

  if (!serveMarkdown) {
    // Regular HTML request — pass through to Nuxt SSR.
    // The beforeResponse plugin will inject Link + Vary on the rendered response.
    return;
  }

  const responseOpts = {
    cacheControl: dualmarkConfig.cacheControl,
    noindex: dualmarkConfig.noindex,
  };

  // Listing: /blog.md
  if (isListing) {
    const entries = await getCollection(event, COLLECTION_NAME);
    const items = entries.map(entry => {
      const data = entry.data;
      return {
        title: data.title ?? entry.id,
        href: BASE_PATH + '/' + entry.id,
        description: data.description,
      };
    });
    const md = listingToMarkdown({
      title: LISTING_TITLE,
      description: LISTING_DESCRIPTION,
      url: dualmarkConfig.siteUrl + BASE_PATH,
      items,
    });
    return markdownResponse(md, responseOpts);
  }

  // Detail: /blog/post-1.md or /blog/post-1 (negotiate)
  const prefix = BASE_PATH + '/';
  const rawSlug = isMd
    ? path.slice(prefix.length, -3)   // strip prefix + .md suffix
    : path.slice(prefix.length);       // strip prefix only
  if (!rawSlug) return new Response('Not Found', { status: 404 });

  const converter = resolveBuiltInConverter({
    name: CONVERTER_NAME,
    collectionName: COLLECTION_NAME,
    baseConfig: { siteUrl: dualmarkConfig.siteUrl },
    compareOptions: COMPARE_OPTIONS,
  });

  const entries = await getCollection(event, COLLECTION_NAME);
  const entry = entries.find(e => e.id === rawSlug);
  if (!entry) return new Response('Not Found', { status: 404 });

  return markdownResponse(converter(entry), responseOpts);
});
`;
}

function getListingCode(
  resolverPath: string,
  collectionCode: string,
  dualmarkConfigStr: string,
  collectionName: string,
  basePath: string,
  listingTitle: string,
  listingDescription: string
) {
  return `
import { makeListingEndpoint } from ${JSON.stringify(resolverPath)};
${collectionCode}
const dualmarkConfig = ${dualmarkConfigStr};

export default makeListingEndpoint({
  collectionName: ${JSON.stringify(collectionName)},
  siteUrl: dualmarkConfig.siteUrl,
  basePath: ${JSON.stringify(basePath)},
  title: ${JSON.stringify(listingTitle)},
  description: ${JSON.stringify(listingDescription)},
  getCollection,
  responseOptions: { cacheControl: dualmarkConfig.cacheControl, noindex: dualmarkConfig.noindex },
});
`;
}

function getStaticPageCode(
  resolverPath: string,
  dualmarkConfigStr: string,
  renderPath: string
) {
  return `
import { makeStaticEndpoint } from ${JSON.stringify(resolverPath)};
const dualmarkConfig = ${dualmarkConfigStr};
import render from "${renderPath}";

export default makeStaticEndpoint({
  render,
  responseOptions: { cacheControl: dualmarkConfig.cacheControl, noindex: dualmarkConfig.noindex },
});
`;
}

function getParameterizedRouteCode(
  resolverPath: string,
  dualmarkConfigStr: string,
  renderPath: string,
  pathsPath: string
) {
  return `
import { makeParameterizedEndpoint } from ${JSON.stringify(resolverPath)};
const dualmarkConfig = ${dualmarkConfigStr};
import render from "${renderPath}";
import getStaticPaths from "${pathsPath}";

export default makeParameterizedEndpoint({
  getStaticPaths: () => getStaticPaths(),
  render,
  responseOptions: { cacheControl: dualmarkConfig.cacheControl, noindex: dualmarkConfig.noindex },
});
`;
}

function getLlmsTxtCode(
  resolverPath: string,
  brandName: string,
  description: string,
  sections: any[]
) {
  return `
import { makeLlmsTxtEndpoint } from ${JSON.stringify(resolverPath)};

export default makeLlmsTxtEndpoint({
  brandName: ${JSON.stringify(brandName)},
  description: ${JSON.stringify(description)},
  sections: ${JSON.stringify(sections)},
});
`;
}

function getExportDefaultCode(content: string) {
  return `export default ${content};\n`;
}
