import { injectMarkdownAlternateLink, toMarkdownPath } from "@dualmark/core";

interface MiddlewareContext {
  url: URL;
  request: Request;
}

type Next = () => Promise<Response>;

export async function dualmarkOnRequest(
  context: MiddlewareContext,
  next: Next,
): Promise<Response> {
  const response = await next();
  const ct = response.headers.get("content-type") ?? "";
  if (!ct.toLowerCase().includes("text/html")) return response;
  if (context.url.pathname.endsWith(".md")) return response;
  return injectMarkdownAlternateLink(
    response,
    context.url.pathname,
    toMarkdownPath(context.url.pathname),
  );
}

export const onRequest = dualmarkOnRequest;
