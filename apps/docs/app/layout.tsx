import "./globals.css";
import { RootProvider } from "fumadocs-ui/provider";
import {
  Darker_Grotesque,
  Geist,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import type { ReactNode } from "react";
import { UnifiedNav } from "./_components/unified-nav";
import {
  JsonLd,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "@/components/json-ld";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-darker-grotesque",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Dualmark — AEO infrastructure for marketing sites",
    template: "%s · Dualmark",
  },
  description:
    "Open-source AEO (Answer Engine Optimization) infrastructure. Every page, dual-marked. Same URL, two formats — picked by HTTP content negotiation. Drop into Astro, Next.js, or Cloudflare in 30 seconds.",
  metadataBase: new URL("https://dualmark.dev"),
  applicationName: "Dualmark",
  authors: [{ name: "Dodo Payments", url: "https://dodopayments.com" }],
  creator: "Dodo Payments",
  publisher: "Dodo Payments",
  keywords: [
    "AEO",
    "Answer Engine Optimization",
    "GEO",
    "Generative Engine Optimization",
    "AI SEO",
    "ChatGPT SEO",
    "Perplexity SEO",
    "llms.txt",
    "markdown twin",
    "content negotiation",
    "AI bot detection",
    "GPTBot",
    "ClaudeBot",
    "Astro AEO",
    "Next.js AEO",
    "Cloudflare Workers AEO",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
    types: {
      "text/markdown": "/index.md",
    },
  },
  openGraph: {
    title: "Dualmark — AEO infrastructure for marketing sites",
    description:
      "Your blog ranks #1 on Google. ChatGPT cites your competitor. That's an infrastructure problem. Dualmark fixes it.",
    url: "https://dualmark.dev",
    siteName: "Dualmark",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dualmark — AEO infrastructure for marketing sites",
    description:
      "Open-source AEO infrastructure. Every page, dual-marked. Drop into Astro, Next.js, or Cloudflare in 30 seconds.",
    creator: "@dodopayments",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
  },
} as const;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${inter.variable} ${darkerGrotesque.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)] antialiased">
        <JsonLd data={[organizationSchema, websiteSchema, softwareApplicationSchema]} />
        <RootProvider theme={{ forcedTheme: "dark", defaultTheme: "dark" }}>
          <UnifiedNav />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
