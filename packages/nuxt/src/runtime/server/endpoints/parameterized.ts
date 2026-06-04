import { markdownResponse, type MarkdownResponseOptions } from "@dualmark/core";

import { defineEventHandler, getRouterParams, type H3Event, type EventHandler } from "h3";

export interface ParameterizedEndpointArgs {
  getStaticPaths: () =>
    | Promise<Array<{ params: Record<string, string> }>>
    | Array<{ params: Record<string, string> }>;
  render: (args: { params: Record<string, string> }, event: H3Event) => string | Promise<string>;
  responseOptions?: MarkdownResponseOptions;
}

export function makeParameterizedEndpoint(
  args: ParameterizedEndpointArgs,
) {
  return defineEventHandler(async (event: H3Event) => {
    const params = getRouterParams(event);
    const body = await args.render({ params }, event);
    return markdownResponse(body, args.responseOptions);
  });
}
