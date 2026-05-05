import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/docs/:path*.md", destination: "/raw/docs/:path*" },
      { source: "/docs.md", destination: "/raw/docs" },
      { source: "/index.md", destination: "/raw/index.md" },
      { source: "/play.md", destination: "/raw/play.md" },
    ];
  },
};

export default withMDX(config);
