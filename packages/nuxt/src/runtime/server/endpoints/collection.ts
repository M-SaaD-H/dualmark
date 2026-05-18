import { markdownResponse, type MarkdownResponseOptions } from "@dualmark/core";
import type { Converter, CollectionEntry } from "@dualmark/converters";

import { defineEventHandler, getRouterParam, type H3Event, type EventHandler } from "h3";

export interface CollectionEndpointArgs<TEntry extends CollectionEntry<unknown>> {
  collectionName: string;
  basePath: string;
  converter: Converter<TEntry>;
  getCollection: (
    event: H3Event,
    name: string,
    filter?: (entry: TEntry) => boolean,
  ) => Promise<TEntry[]>;
  filter?: (entry: TEntry) => boolean;
  responseOptions?: MarkdownResponseOptions;
}

export function makeCollectionDetailEndpoint<TEntry extends CollectionEntry<unknown>>(
  args: CollectionEndpointArgs<TEntry>,
): EventHandler<Response> {
  return defineEventHandler(async (event: H3Event) => {
    const path = event.path.split('?')[0];
    if (!path || !path.endsWith('.md')) return; // Fall-through for HTML requests
    
    // Extract slug by removing the basePath prefix and .md suffix
    // Example: path = "/blog/post-1.md", basePath = "/blog" -> slug = "post-1"
    const prefix = args.basePath.endsWith('/') ? args.basePath : args.basePath + '/';
    if (!path.startsWith(prefix)) return;
    
    const slug = path.slice(prefix.length, -3);
    if (!slug) return new Response("Not Found", { status: 404 });
    const entries = await args.getCollection(event, args.collectionName, args.filter);
    const entry = entries.find((e) => e.id === slug);
    if (!entry) {
      return new Response("Not Found", { status: 404 });
    }
    const md = args.converter(entry);
    return markdownResponse(md, args.responseOptions);
  })
}
