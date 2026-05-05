import { Adapters } from "./_components/adapters";
import { CaseStudy } from "./_components/case-study";
import { ConformanceDemo } from "./_components/conformance-demo";
import { CTA } from "./_components/cta";
import { Hero } from "./_components/hero";
import { PageRails } from "./_components/page-rails";
import { PlaygroundTeaser } from "./_components/playground-teaser";
import { Transform } from "./_components/transform";

export default function HomePage() {
  return (
    <main className="relative isolate">
      <PageRails />
      <Hero />
      <PlaygroundTeaser />
      <Transform />
      <CaseStudy />
      <ConformanceDemo />
      <Adapters />
      <CTA />
    </main>
  );
}
