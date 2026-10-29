import mongoose, { type Model } from "mongoose";
import { z } from "zod";
import { FAQS, INSIGHTS, PLANS, PROJECTS, SERVICES } from "@/content/site";
import type { JsonValue } from "./cms-types";
import { connectDatabase } from "./database.server";

export const collectionNames = ["services", "projects", "pricing", "articles", "faqs"] as const;
export type CollectionName = (typeof collectionNames)[number];
export type ContentRecord = {
  _id?: unknown;
  title: string;
  slug: string;
  status: "draft" | "published";
  order: number;
  data: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};

const recordSchema = new mongoose.Schema<ContentRecord>(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    status: { type: String, enum: ["draft", "published"], default: "published", index: true },
    order: { type: Number, default: 0 },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
);
recordSchema.index({ slug: 1 }, { unique: true });

const getModel = (name: string): Model<ContentRecord> =>
  (mongoose.models[name] as Model<ContentRecord> | undefined) ??
  mongoose.model<ContentRecord>(name, recordSchema);

export const cmsModels: Record<CollectionName, Model<ContentRecord>> = {
  services: getModel("Service"),
  projects: getModel("Project"),
  pricing: getModel("PricingPlan"),
  articles: getModel("Article"),
  faqs: getModel("FAQ"),
};

const defaults: Record<CollectionName, Array<Omit<ContentRecord, "_id">>> = {
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
      excerpt: `${item.title}. Practical guidance from the Trivon team.`,
      content: `<p>${item.title}. This guide explains practical steps your team can take to improve visibility, performance, and conversion.</p>`,
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
let missingDatabaseWarningShown = false;
let databaseOutageWarningShown = false;
let usePreviewUntil = 0;
const previewRetryDelayMs = 15_000;

function isTransientDatabaseError(error: unknown): boolean {
  if (error == null || typeof error !== "object" || !("name" in error)) return false;
  const name = error.name;
  if (
    typeof name !== "string" ||
    ![
      "MongooseServerSelectionError",
      "MongoServerSelectionError",
      "MongoNetworkError",
      "MongoNetworkTimeoutError",
      "MongoWaitQueueTimeoutError",
      "MongoTopologyClosedError",
    ].includes(name)
  ) {
    return false;
  }
  if (
    ("code" in error && error.code === 18) ||
    ("codeName" in error && error.codeName === "AuthenticationFailed")
  ) {
    return false;
  }
  return !(
    "message" in error &&
    typeof error.message === "string" &&
    /authentication failed|bad auth|authentication error/i.test(error.message)
  );
}

async function readPublicContent<T>(read: () => Promise<T>, fallback: () => T): Promise<T> {
  if (!process.env["MONGODB_URI"]) {
    if (!missingDatabaseWarningShown) {
      console.warn(
        "MONGODB_URI is not configured; serving preview content. Configure MongoDB and run `npm run seed` for CMS data.",
      );
      missingDatabaseWarningShown = true;
    }
    return fallback();
  }

  if (Date.now() < usePreviewUntil) return fallback();

  try {
    const result = await read();
    usePreviewUntil = 0;
    databaseOutageWarningShown = false;
    return result;
  } catch (error) {
    if (!isTransientDatabaseError(error)) throw error;

    usePreviewUntil = Date.now() + previewRetryDelayMs;
    if (!databaseOutageWarningShown) {
      const errorName =
        error != null &&
        typeof error === "object" &&
        "name" in error &&
        typeof error.name === "string"
          ? error.name
          : "unknown";
      console.warn(
        `MongoDB is temporarily unavailable (${errorName}); serving preview content for public reads. Admin and write operations still require the database.`,
      );
      databaseOutageWarningShown = true;
    }
    return fallback();
  }
}

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

const recordInput = z.object({
  title: z.string().trim().min(1).max(180),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(["draft", "published"]),
  order: z.number().int().min(0).max(100_000),
  data: z.record(z.string(), jsonValueSchema).default({}),
});
export type RecordInput = z.infer<typeof recordInput>;

export function isCollectionName(value: string): value is CollectionName {
  return collectionNames.some((name) => name === value);
}

export function validateRecord(value: unknown): RecordInput {
  return recordInput.parse(value);
}

export async function listPublicContent(collection: CollectionName): Promise<ContentRecord[]> {
  return readPublicContent(
    async () => {
      await connectDatabase();
      const records = await cmsModels[collection]
        .find({ status: "published" })
        .sort({ order: 1, createdAt: -1 })
        .lean<ContentRecord[]>();
      return records.length > 0 ? records : defaults[collection];
    },
    () => defaults[collection],
  );
}

export async function listAdminContent(collection: CollectionName): Promise<ContentRecord[]> {
  await connectDatabase();
  return cmsModels[collection].find().sort({ order: 1, createdAt: -1 }).lean<ContentRecord[]>();
}

export async function getPublicRecord(
  collection: CollectionName,
  slug: string,
): Promise<ContentRecord | null> {
  const records = await listPublicContent(collection);
  return records.find((record) => record.slug === slug) ?? null;
}

export async function createContent(
  collection: CollectionName,
  value: unknown,
): Promise<ContentRecord> {
  await connectDatabase();
  const parsed = validateRecord(value);
  return (await cmsModels[collection].create(parsed)).toObject() as ContentRecord;
}

export async function updateContent(
  collection: CollectionName,
  id: string,
  value: unknown,
): Promise<ContentRecord | null> {
  await connectDatabase();
  const parsed = validateRecord(value);
  return cmsModels[collection]
    .findByIdAndUpdate(id, parsed, { new: true, runValidators: true })
    .lean<ContentRecord>();
}

export async function deleteContent(collection: CollectionName, id: string): Promise<boolean> {
  await connectDatabase();
  const result = await cmsModels[collection].findByIdAndDelete(id);
  return result !== null;
}

export async function reorderContent(collection: CollectionName, ids: string[]): Promise<void> {
  await connectDatabase();
  await Promise.all(
    ids.map((id, order) => cmsModels[collection].updateOne({ _id: id }, { $set: { order } })),
  );
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
