import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { CmsItem, JsonValue } from "./cms-types";

const serializableValue: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(serializableValue),
    z.record(z.string(), serializableValue),
  ]),
);

const collectionInput = z.object({
  collection: z.enum(["services", "projects", "pricing", "articles", "faqs"]),
});
const recordInput = collectionInput.extend({ slug: z.string().min(1) });

export const getHomeContent = createServerFn({ method: "GET" }).handler(async () => {
  const { listPublicContent } = await import("./cms.server");
  const [services, projects, pricing, faqs, articles] = await Promise.all([
    listPublicContent("services"),
    listPublicContent("projects"),
    listPublicContent("pricing"),
    listPublicContent("faqs"),
    listPublicContent("articles"),
  ]);
  return {
    services: serialize(services),
    projects: serialize(projects),
    pricing: serialize(pricing),
    faqs: serialize(faqs),
    articles: serialize(articles),
  };
});

export const getPublicCollection = createServerFn({ method: "GET" })
  .validator((input: unknown) => collectionInput.parse(input))
  .handler(async ({ data }) => {
    const { listPublicContent } = await import("./cms.server");
    return serialize(await listPublicContent(data.collection));
  });

export const getPublicRecord = createServerFn({ method: "GET" })
  .validator((input: unknown) => recordInput.parse(input))
  .handler(async ({ data }) => {
    const { getPublicRecord: getRecord } = await import("./cms.server");
    const record = await getRecord(data.collection, data.slug);
    return record ? serializeOne(record) : null;
  });

function serialize(
  records: Array<{
    _id?: unknown;
    title: string;
    slug: string;
    status: "draft" | "published";
    order: number;
    data: Record<string, unknown>;
  }>,
): CmsItem[] {
  return records.map(serializeOne);
}

function serializeOne(record: {
  _id?: unknown;
  title: string;
  slug: string;
  status: "draft" | "published";
  order: number;
  data: Record<string, unknown>;
}): CmsItem {
  const encoded = JSON.stringify(record.data);
  if (!encoded) throw new Error("CMS content data is not serializable.");
  const data = z.record(z.string(), serializableValue).parse(JSON.parse(encoded));
  return {
    ...(record._id == null ? {} : { _id: String(record._id) }),
    title: record.title,
    slug: record.slug,
    status: record.status,
    order: record.order,
    data,
  };
}
