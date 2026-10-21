/**
 * All site copy lives here so it can be edited in one place.
 * Anything tagged `PLACEHOLDER` must be replaced with real data before launch.
 */

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Insights", href: "#insights" },
] as const;

// PLACEHOLDER: replace with real, verified numbers.
export const STATS = [
  { value: 120, suffix: "+", label: "Websites launched and ranking" },
  { value: 3.4, suffix: "x", decimals: 1, label: "Average organic traffic lift in year one" },
  { value: 95, suffix: "%", label: "Clients who stay after their first project" },
];

// PLACEHOLDER: swap for real client logos (with permission).
export const CLIENT_LOGOS = [
  "Northwind Co.",
  "Harbor & Pine",
  "Kestrel Labs",
  "Maple Ridge",
  "Brightfield",
  "Oakline Studio",
  "Fernway",
  "Lumen Dental",
];

export const SERVICES = [
  {
    key: "design",
    title: "Web Design",
    body: "Clear, confident interfaces that make visitors trust you in seconds and know exactly what to do next.",
    points: ["Conversion-led layouts", "Brand-true design systems"],
  },
  {
    key: "dev",
    title: "Web Development",
    body: "Fast, accessible websites and web apps built on modern stacks that are easy for your team to grow.",
    points: ["90+ Lighthouse scores", "Headless CMS & integrations"],
  },
  {
    key: "seo",
    title: "SEO",
    body: "Technical foundations, content and links that move you up Google for the searches that bring customers.",
    points: ["Technical audits & fixes", "Content that ranks"],
  },
  {
    key: "geo",
    title: "AI Search Ranking",
    body: "GEO and AEO that get your brand cited in ChatGPT, Perplexity and Google AI Overviews.",
    points: ["Entity & schema strategy", "AI citation tracking"],
  },
] as const;

export const PROCESS = [
  {
    title: "Audit",
    body: "We review your site, search visibility, competitors and AI presence, then show you exactly where the growth is hiding.",
  },
  {
    title: "Strategy",
    body: "A focused plan: the pages to build, the keywords and questions to own, and the numbers we will hold ourselves to.",
  },
  {
    title: "Design",
    body: "We design around how your customers decide, with clear messaging and layouts built to convert.",
  },
  {
    title: "Build",
    body: "Clean, fast, accessible code with structured data baked in, so search engines and AI models understand you.",
  },
  {
    title: "Launch & Rank",
    body: "We launch, monitor and keep improving. Monthly reports show traffic, leads and AI citations in plain language.",
  },
];

// PLACEHOLDER: replace with real projects and screenshots.
export const PROJECTS = [
  { name: "Harbor & Pine", category: "E-commerce redesign", tone: "forest" },
  { name: "Kestrel Labs", category: "SaaS marketing site", tone: "lime" },
  { name: "Lumen Dental", category: "Local SEO + website", tone: "ink" },
  { name: "Fernway", category: "Web app", tone: "trivon" },
  { name: "Oakline Studio", category: "Brand site", tone: "sage" },
] as const;

// PLACEHOLDER: replace with real case study data.
export const CASE_STUDIES = [
  {
    client: "Regional law firm, UK",
    problem: "Invisible for high-intent local searches and losing enquiries to directories.",
    did: "Rebuilt the site around practice-area pages, fixed technical SEO and added local schema.",
    metric: { value: 212, suffix: "%", label: "organic traffic" },
    sub: [
      { value: 64, suffix: "%", label: "more leads" },
      { value: 9, suffix: "mo", label: "timeframe" },
    ],
  },
  {
    client: "B2B SaaS, Germany",
    problem: "Strong product, but competitors were the ones AI tools recommended.",
    did: "Entity strategy, comparison content and structured FAQs designed to be quoted.",
    metric: { value: 38, suffix: "", label: "AI citations / month" },
    sub: [
      { value: 2.1, suffix: "x", decimals: 1, label: "demo requests" },
      { value: 6, suffix: "mo", label: "timeframe" },
    ],
  },
  {
    client: "Home services, Canada",
    problem: "Slow, dated website with a 4% mobile conversion rate.",
    did: "New design system, a 0.9s load time and booking flows built for phones.",
    metric: { value: 3.2, suffix: "x", decimals: 1, label: "booked jobs" },
    sub: [
      { value: 98, suffix: "", label: "PageSpeed" },
      { value: 4, suffix: "mo", label: "timeframe" },
    ],
  },
];

// PLACEHOLDER: replace with real, approved testimonials.
export const TESTIMONIALS = [
  {
    quote: "Trivon made SEO make sense. Within six months we went from page three to the top results for the services that actually pay our bills.",
    name: "Client Name",
    role: "Founder, Professional Services (US)",
  },
  {
    quote: "The new site is fast, clear and our sales team finally sends people to it with pride. Leads are up and the quality is better.",
    name: "Client Name",
    role: "Head of Marketing, SaaS (Germany)",
  },
  {
    quote: "We started showing up in ChatGPT answers for our niche. Customers now tell us that's how they found us.",
    name: "Client Name",
    role: "Owner, E-commerce (Canada)",
  },
];

// PLACEHOLDER: prices.
export const PLANS = [
  {
    name: "Launch",
    for: "For new businesses that need a site that works from day one.",
    price: "$3,900",
    cadence: "one-time",
    features: ["Up to 6 custom pages", "Mobile-first design", "Technical SEO setup", "Schema & analytics", "30 days of support"],
  },
  {
    name: "Growth",
    for: "For businesses ready to turn search into a steady lead channel.",
    price: "$1,800",
    cadence: "/ month",
    featured: true,
    features: [
      "Everything in Launch",
      "Monthly SEO content",
      "AI search optimization (GEO)",
      "Conversion testing",
      "Monthly growth report",
    ],
  },
  {
    name: "Authority",
    for: "For brands that want to own their category on Google and in AI.",
    price: "$4,500",
    cadence: "/ month",
    features: [
      "Everything in Growth",
      "Web app & custom features",
      "Digital PR & link building",
      "AI citation tracking",
      "Dedicated strategist",
    ],
  },
];

export const FAQS = [
  {
    q: "How long does SEO take to show results?",
    a: "Most clients see early movement in 6 to 12 weeks and meaningful traffic growth in 4 to 6 months. Technical fixes can show impact within days. We report progress monthly so you always know where you stand.",
  },
  {
    q: "What is AI search ranking (GEO / AEO)?",
    a: "It's the work of making your business the source AI tools trust and quote. We structure your content, strengthen your brand entity and add schema so ChatGPT, Perplexity and Google AI Overviews can cite you.",
  },
  {
    q: "How long does a new website take?",
    a: "A focused marketing site usually takes 4 to 6 weeks from kickoff to launch. Larger sites and web apps take 8 to 14 weeks. You'll get a clear timeline before we start.",
  },
  {
    q: "How much does it cost?",
    a: "Projects start with one-time website builds and move to monthly growth plans. Every plan is scoped after a free audit, so you only pay for what will move your numbers.",
  },
  {
    q: "Do you work with businesses outside the US?",
    a: "Yes. We work with clients across the US, UK, Canada and Germany, including multilingual and multi-region SEO.",
  },
  {
    q: "What happens after launch?",
    a: "We keep going. Growth plans include ongoing content, technical monitoring, conversion improvements and a monthly report in plain language.",
  },
];

// PLACEHOLDER: link to real articles once published.
export const INSIGHTS = [
  { date: "Oct 8, 2026", title: "How to get your business cited in ChatGPT answers", tag: "AI Search" },
  { date: "Sep 22, 2026", title: "The 9 technical SEO fixes that move rankings fastest", tag: "SEO" },
  { date: "Sep 4, 2026", title: "Why your website is fast in tests but slow for customers", tag: "Performance" },
  { date: "Aug 18, 2026", title: "Writing service pages that rank and convert", tag: "Content" },
];
