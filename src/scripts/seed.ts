import "dotenv/config";
import { connectDatabase } from "../lib/database.server";
import { cmsModels, collectionNames } from "../lib/cms.server";
import { FAQS, INSIGHTS, PLANS, PROJECTS, SERVICES } from "../content/site";
import { slugify } from "../lib/cms.server";

const records = {
  services: SERVICES.map((item, order) => ({
    title: item.title,
    slug: item.key,
    status: "published",
    order,
    data: { body: item.body, points: item.points },
  })),
  projects: PROJECTS.map((item, order) => ({
    title: item.name,
    slug: slugify(item.name),
    status: "published",
    order,
    data: {
      category: item.category,
      tone: item.tone,
      summary: `${item.category} designed to help the business grow.`,
      challenge:
        "The business needed a clearer digital presence and a more effective path from search to enquiry.",
      solution:
        "We combined clear messaging, responsive design, and a technical foundation built for discovery.",
      results: "A faster, more useful experience built around the needs of its customers.",
      client: item.name,
      timeline: "Project sample",
      role: "Strategy, design, development",
    },
  })),
  pricing: PLANS.map((item, order) => ({
    title: item.name,
    slug: slugify(item.name),
    status: "published",
    order,
    data: {
      description: item.for,
      price: item.price,
      cadence: item.cadence,
      featured: item.featured ?? false,
      features: item.features,
    },
  })),
  articles: INSIGHTS.map((item, order) => ({
    title: item.title,
    slug: slugify(item.title),
    status: "published",
    order,
    data: {
      date: item.date,
      category: item.tag,
      author: "Trivon team",
      readTime: "5 min",
      excerpt: `Practical guidance on ${item.tag.toLowerCase()} from the Trivon team.`,
      content: `${item.title}\n\nThis guide explains practical steps your team can take to improve visibility, performance, and conversion. Start with a clear picture of what customers are searching for, then make it easy for both people and search systems to understand what you offer.\n\nMeasure progress against useful outcomes such as qualified enquiries, relevant organic visits, and customer experience. Small, consistent improvements to technical foundations and useful content compound over time.`,
    },
  })),
  faqs: FAQS.map((item, order) => ({
    title: item.q,
    slug: slugify(item.q),
    status: "published",
    order,
    data: { answer: item.a },
  })),
};

async function seed() {
  await connectDatabase();
  for (const collection of collectionNames) {
    const documents = records[collection];
    for (const document of documents) {
      await cmsModels[collection].updateOne(
        { slug: document.slug },
        { $setOnInsert: document },
        { upsert: true },
      );
    }
    console.info(
      `Ensured ${documents.length} starter ${collection} records (existing content was kept).`,
    );
  }
}

seed().catch((error: unknown) => {
  console.error("Could not seed MongoDB content:", error);
  process.exitCode = 1;
});
