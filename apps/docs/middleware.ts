import { NextResponse, type NextRequest } from "next/server";
import { detectAIBot, negotiateFormat, toMarkdownPath } from "@dualmark/core";

export const config = {
  matcher: ["/", "/play", "/docs/:path*"],
};

const MARKDOWN_ELIGIBLE_PREFIXES = ["/docs", "/play"];
const MARKDOWN_ELIGIBLE_EXACT = ["/", "/play"];

export function middleware(req: NextRequest) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (pathname.endsWith(".md")) return NextResponse.next();
  if (pathname.startsWith("/raw/")) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.next();

  const accept = req.headers.get("accept") ?? "";
  const ua = req.headers.get("user-agent") ?? "";
  const fmt = negotiateFormat(accept);
  const bot = detectAIBot(ua);

  if (fmt === null) {
    return new NextResponse("Not Acceptable\n", {
      status: 406,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        Vary: "Accept",
      },
    });
  }

  const wantsMarkdown = bot.isBot || fmt === "markdown";
  const eligible =
    MARKDOWN_ELIGIBLE_PREFIXES.some((p) => pathname.startsWith(p)) ||
    MARKDOWN_ELIGIBLE_EXACT.includes(pathname);

  if (wantsMarkdown && eligible) {
    const url = req.nextUrl.clone();
    url.pathname = toMarkdownPath(pathname);
    const rewrite = NextResponse.rewrite(url);
    rewrite.headers.set("Vary", "Accept, User-Agent");
    return rewrite;
  }

  const response = NextResponse.next();

  if (eligible) {
    const mdPath = toMarkdownPath(pathname);
    const linkValue = `<${mdPath}>; rel="alternate"; type="text/markdown"`;
    response.headers.append("Link", linkValue);
  }

  return response;
}
