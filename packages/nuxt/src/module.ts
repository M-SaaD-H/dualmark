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

    for (const [collectionName, c] of Object.entries(resolved.collections)) {
      const route = c.route ?? collectionName;
      
      if (typeof c.converter !== 'string') {
        console.warn(`[@dualmark/nuxt] Collection '${collectionName}' uses an inline converter function. Use a built-in converter name (e.g. 'blog').`);
        continue;
      }

      const getCollectionCode = `
import { serverQueryContent } from '#content/server';
const getCollection = async (event, name, filter) => {
  const docs = await serverQueryContent(event, name).find();
  let entries = docs.map(doc => {
    // Attempt to extract slug from _path
    const id = doc._path ? doc._path.replace(new RegExp('^/' + name + '/?'), '') : doc.title || '';
    
    // Normalize date fields into Date objects for converters
    const rawDate = doc.publishedDate || doc.pubDate || doc.date;
    if (rawDate) {
      doc.publishedDate = new Date(rawDate);
    }
    if (doc.modifiedDate) {
      doc.modifiedDate = new Date(doc.modifiedDate);
    }

    return {
      id,
      data: doc,
      body: ''
    };
  });
  if (filter) entries = entries.filter(filter);
  return entries;
};
`;

      const detailSource = `
import { resolveBuiltInConverter } from ${JSON.stringify(resolver.resolve('./runtime/server/converter-registry'))};
import { makeCollectionDetailEndpoint } from ${JSON.stringify(resolver.resolve('./runtime/server/endpoints/collection'))};
${getCollectionCode}
const dualmarkConfig = ${dualmarkConfigStr};

const converter = resolveBuiltInConverter({
  name: ${JSON.stringify(c.converter)},
  collectionName: ${JSON.stringify(collectionName)},
  baseConfig: { siteUrl: dualmarkConfig.siteUrl },
});

export default makeCollectionDetailEndpoint({
  collectionName: ${JSON.stringify(collectionName)},
  basePath: ${JSON.stringify("/" + route)},
  converter,
  getCollection,
  responseOptions: { cacheControl: dualmarkConfig.cacheControl, noindex: dualmarkConfig.noindex },
});
`;

      const detailFile = addTemplate({
        filename: `dualmark/collection-${collectionName}-detail.ts`,
        getContents: () => detailSource,
        write: true,
      });

      // Nitro supports /** for catch-all routes
      const slugSeg = c.slugStrategy === "single" ? "/:slug" : "/**";
      const detailPattern = `/${route}${slugSeg}`;
      addServerHandler({
        route: detailPattern,
        handler: detailFile.dst,
      });
      routesInjected.push(detailPattern);

      if (c.emitListing !== false) {
        const listingSource = `
import { makeListingEndpoint } from ${JSON.stringify(resolver.resolve('./runtime/server/endpoints/listing'))};
${getCollectionCode}
const dualmarkConfig = ${dualmarkConfigStr};

export default makeListingEndpoint({
  collectionName: ${JSON.stringify(collectionName)},
  siteUrl: dualmarkConfig.siteUrl,
  basePath: ${JSON.stringify("/" + route)},
  title: ${JSON.stringify(c.listingMetadata?.title ?? collectionName)},
  description: ${JSON.stringify(c.listingMetadata?.description ?? ("All " + collectionName + " entries."))},
  getCollection,
  responseOptions: { cacheControl: dualmarkConfig.cacheControl, noindex: dualmarkConfig.noindex },
});
`;
        const listingFile = addTemplate({
          filename: `dualmark/collection-${collectionName}-listing.ts`,
          getContents: () => listingSource,
          write: true,
        });

        const listingPattern = `/${route}.md`;
        addServerHandler({
          route: listingPattern,
          handler: listingFile.dst,
        });
        routesInjected.push(listingPattern);
        prerenderRoutes.push(listingPattern);
      }
    }

    for (let i = 0; i < resolved.staticPages.length; i++) {
      const sp = resolved.staticPages[i];
      if (!sp) continue;
      const safe = sp.pattern.replace(/[^a-z0-9]/gi, '_');
      const renderModulePath = addTemplate({
        filename: `dualmark/static-${i}-${safe}-render.ts`,
        getContents: () => `export default ${sp.render.toString()};\n`,
        write: true,
      });
      const source = `
import { makeStaticEndpoint } from ${JSON.stringify(resolver.resolve('./runtime/server/endpoints/static'))};
const dualmarkConfig = ${dualmarkConfigStr};
import render from "./static-${i}-${safe}-render";

export default makeStaticEndpoint({
  render,
  responseOptions: { cacheControl: dualmarkConfig.cacheControl, noindex: dualmarkConfig.noindex },
});
`;
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

    for (let i = 0; i < resolved.parameterizedRoutes.length; i++) {
      const pr = resolved.parameterizedRoutes[i];
      if (!pr) continue;
      const safe = pr.pattern.replace(/[^a-z0-9]/gi, '_');
      const renderModulePath = addTemplate({
        filename: `dualmark/param-${i}-${safe}-render.ts`,
        getContents: () => `export default ${pr.render.toString()};\n`,
        write: true,
      });
      const pathsModulePath = addTemplate({
        filename: `dualmark/param-${i}-${safe}-paths.ts`,
        getContents: () => `export default ${pr.getStaticPaths.toString()};\n`,
        write: true,
      });
      const source = `
import { makeParameterizedEndpoint } from ${JSON.stringify(resolver.resolve('./runtime/server/endpoints/parameterized'))};
const dualmarkConfig = ${dualmarkConfigStr};
import render from "./param-${i}-${safe}-render";
import getStaticPaths from "./param-${i}-${safe}-paths";

export default makeParameterizedEndpoint({
  getStaticPaths: () => getStaticPaths(),
  render,
  responseOptions: { cacheControl: dualmarkConfig.cacheControl, noindex: dualmarkConfig.noindex },
});
`;
      const pattern = pr.pattern.startsWith('/') ? pr.pattern + '.md' : `/${pr.pattern}.md`;
      const file = addTemplate({
        filename: `dualmark/param-${i}-${safe}.ts`,
        getContents: () => source,
        write: true,
      });
      
      // Convert /a/[b]/c to /a/:b/c for Nitro
      const nitroPattern = pattern.replace(/\[([^\]]+)\]/g, ':$1');
      addServerHandler({ route: nitroPattern, handler: file.dst });
      routesInjected.push(nitroPattern);
      prerenderRoutes.push(nitroPattern);
    }

    if (resolved.llmsTxt?.enabled) {
      const sections = resolved.llmsTxt.sections ?? [];
      const source = `
import { makeLlmsTxtEndpoint } from ${JSON.stringify(resolver.resolve('./runtime/server/endpoints/llms-txt'))};

export default makeLlmsTxtEndpoint({
  brandName: ${JSON.stringify(resolved.llmsTxt.brandName ?? "Site")},
  description: ${JSON.stringify(resolved.llmsTxt.description ?? "")},
  sections: ${JSON.stringify(sections)},
});
`;
      const llmsFile = addTemplate({
        filename: `dualmark/llms-txt.ts`,
        getContents: () => source,
        write: true,
      });
      addServerHandler({
        route: '/llms.txt',
        handler: llmsFile.dst,
      });
      routesInjected.push('/llms.txt');
      prerenderRoutes.push('/llms.txt');
    }

    console.log(`[@dualmark/nuxt] Injected ${routesInjected.length} route(s) and ${resolved.middleware.injectLinkHeader ? "1" : "0"} middleware`);
    
    // Automatically prerender listing and llms.txt endpoints
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.prerender = nitroConfig.prerender || {};
      nitroConfig.prerender.routes = nitroConfig.prerender.routes || [];
      nitroConfig.prerender.routes.push(...prerenderRoutes);
    });
  },
});
