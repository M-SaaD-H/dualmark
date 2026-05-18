import { markdownResponse, type MarkdownResponseOptions } from "@dualmark/core";
import type { Converter, CollectionEntry } from "@dualmark/converters";

import { defineEventHandler, getRouterParam, type H3Event, type EventHandler } from "h3";

export interface CollectionEndpointArgs<TEntry extends CollectionEntry<unknown>> {
  collectionName: string;
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
    const slug = getRouterParam(event, "slug") || getRouterParam(event, "_");
    if (!slug) return new Response("Not Found", { status: 404 });
    const entries = await args.getCollection(event, args.collectionName, args.filter);
    const entry = entries.find((e) => e.id === slug);
    if (!entry) {
      return new Response("Not Found", { status: 404 });
    }
    const md = args.converter(entry);
    return markdownResponse(md, args.responseOptions);
  };
}
