# Trivon Search Spark

ROLE
Act as a senior design engineer with 15 years of experience building award-level agency websites with React, TypeScript, Tailwind CSS, Framer Motion and React Three Fiber (Three.js). You obsess over UX, motion design, performance and craft. Build a premium, production-ready marketing website.

PROJECT
Website for "Trivon Digital Agency", a digital agency that designs and builds high-performing websites and web apps, and gets them ranked on Google and in AI search answers (ChatGPT, Perplexity, Google AI Overviews). Audience: growth-minded businesses in the US, UK, Canada and Germany. Core promise: "More Traffic. More Customers. More Growth."

ATTACHED ASSETS
1. Trivon logo (green radial burst symbol + black "Trivon" wordmark). Extract and use it exactly as is. Do not redraw or alter it.
2. Trivon brand identity board. Follow its colors, typography, shape language and voice strictly.
3. Reference website (long screenshot). Replicate its structure, layout rhythm, spacing, card style, pill buttons, mono-style section labels, alternating light/dark sections, pinned "How we work" scroll section, pricing cards, blog list and giant footer wordmark. Match its clean, minimal feel and make it better: more polished, more motion, more depth. Take the layout and style only. Do not copy its name, copy, images or branding.

STACK
React + TypeScript, Tailwind CSS, Framer Motion, React Three Fiber + drei for 3D, Lenis for smooth scrolling, Lucide icons, shadcn/ui primitives where useful. Organize components so they can migrate to Next.js App Router later (one component per section, no logic in the page file).

DESIGN SYSTEM (from the brand identity)
- Trivon Green #79B83F (primary), Forest Green #315B2B (secondary), Electric Lime #A2E64A (accent), Soft Ivory #F5F7F2 (light background), Ink #141714 (dark and text)
- Define all as Tailwind theme tokens. Light sections use Soft Ivory with pale-green tinted cards. Dark sections use Ink and Forest Green with Electric Lime accents.
- Accessibility rule from the brand board: use Ink text on Trivon Green and Electric Lime. Never use white text on Trivon Green.
- Fonts: Plus Jakarta Sans (headings, weights 500/600/700), Inter (body, 400/500/600). Load from Google Fonts. Use a small mono or uppercase tracking label for section tags like "• SERVICES".
- Shape language: 12 to 16px card radius, fully rounded pill buttons, 2px icon strokes, subtle organic shapes derived from the logo symbol, generous whitespace.
- Tone: confident, approachable, forward-thinking. No jargon.

PAGE STRUCTURE (in this order)
1. Navbar: floating pill nav that blurs on scroll, logo, links (Services, Work, Process, Pricing, Insights), CTA "Get a Free Audit". Mobile full-screen menu with staggered links.
2. Hero (dark Ink/Forest gradient): headline "More Traffic. More Customers. More Growth." Subline about websites that rank on Google and in AI answers. CTAs: "Get a Free Audit" (Electric Lime) and "View Our Work" (ghost). Centerpiece is a 3D scene: the Trivon logo symbol extruded as a floating, slowly rotating 3D object with soft lighting, reacting to mouse movement and scroll. Around it, floating glass chips like "Ranking #1", "Cited by AI", "98 PageSpeed" with gentle parallax.
3. Stats strip: "A digital agency built to be found." Three count-up stats (clearly marked as placeholder values).
4. Logo marquee: "Trusted by businesses in the US, UK, Canada and Germany." Infinite marquee that slows on hover (placeholder logos).
5. About: "We help businesses get found and grow." Short copy, "Learn more" button, and a floating dashboard-style performance card with an animated growth number.
6. Services: 4 cards: Web Design, Web Development, SEO, AI Search Ranking (GEO/AEO). 3D tilt on hover, icon animation, short benefit lines, "View services" button.
7. How we work (pinned scroll, dark): 5 steps with a "1/5" counter and a visual that changes per step: Audit, Strategy, Design, Build, Launch & Rank. The section pins while scroll drives the steps.
8. Portfolio: large project cards in a horizontal scroll-driven gallery. Hover reveals project name, category and an animated arrow cursor. Use placeholder project mockups.
9. Case studies: 3 cards, each with the problem, what we did, and big animated result metrics (traffic, leads, AI citations). Placeholder data.
10. Testimonials: large quote slider with avatar, name, role, prev/next controls and a smooth transition.
11. Pricing (dark): 3 packages (Launch, Growth, Authority) with feature checklists and "Get Started" buttons. Highlight the middle plan. Use placeholder prices.
12. Free AI Visibility Audit (my addition): URL input that triggers an animated scanning sequence and a sample score card (SEO, speed, AI readiness), followed by an email capture. Front-end only for now.
13. FAQ: accordion with 6 questions about SEO, AI ranking, timelines, pricing and process.
14. Insights: 4 blog cards in the reference's list style.
15. Final CTA: "Ready to grow your business?" with a moody dark-green background, a subtle 3D or particle effect, and "Book a Call" and "Get a Free Audit" buttons.
16. Footer: link columns, social icons, newsletter input, and a giant Electric Lime "Trivon" wordmark that fills the bottom and reveals on scroll.

MOTION AND 3D (premium, not gimmicky)
- Lenis smooth scroll site-wide
- Split-text headline reveals (word by word, masked), scroll-triggered fade and rise on all sections
- Scroll-linked parallax, pinned sections, and a scroll progress bar
- Magnetic buttons, custom cursor that changes on hover, smooth hover states on every card
- React Three Fiber hero object with mouse and scroll reaction; use a lighter 3D tilt or particle effect in the CTA
- Page-load intro animation with the logo symbol
- 60fps target. Lazy-load the 3D canvas, cap pixel ratio, show a static fallback on low-power devices, and respect prefers-reduced-motion.

UX DETAILS
Mobile-first and fully responsive, sticky CTA that appears after the hero, clear visual hierarchy, big tap targets, subtle micro-interactions, skeleton and loading states, and a consistent 8px spacing scale.

SEO, PERFORMANCE, ACCESSIBILITY (we sell SEO, so this site must be flawless)
Semantic HTML with one H1, proper meta titles and descriptions, Open Graph tags, JSON-LD schema (Organization, Service, FAQPage), alt text on all images, descriptive link text, lazy-loaded images, optimized fonts, WCAG AA contrast, visible focus states and keyboard navigation. Target 90+ on every Lighthouse score.

CONTENT RULES
Write real, specific copy in the brand voice. Anything that is a placeholder (clients, stats, projects, testimonials, prices) must be clearly marked in the code so I can replace it. Do not invent fake famous client names.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://trivon-search-spark.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f769826f-19c4-4e6d-94ba-17ecb19a07b5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
