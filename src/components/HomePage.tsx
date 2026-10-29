import { Cursor, Intro, ScrollProgress, SmoothScroll, StickyCTA } from "@/components/site/effects";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Stats, LogoMarquee } from "@/components/sections/StatsMarquee";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Portfolio } from "@/components/sections/Portfolio";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Audit } from "@/components/sections/Audit";
import { FAQ, Insights } from "@/components/sections/FaqInsights";
import { FinalCta, Footer } from "@/components/sections/FinalCta";
import type { HomepageContent } from "@/lib/cms-types";

export function HomePage({ content }: { content: HomepageContent }) {
  return (
    <>
      <Intro />
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <LogoMarquee />
        <About />
        <Services items={content.services} />
        <Process />
        <Portfolio items={content.projects} />
        <CaseStudies />
        <Testimonials />
        <Pricing items={content.pricing} />
        <Audit />
        <FAQ items={content.faqs} />
        <Insights items={content.articles} />
        <FinalCta />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
