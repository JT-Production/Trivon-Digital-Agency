export const collectionNames = ["services", "projects", "pricing", "articles", "faqs"] as const;
export type CollectionName = (typeof collectionNames)[number];
export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type CmsItem = {
  _id?: string | undefined;
  title: string;
  slug: string;
  status: "draft" | "published";
  order: number;
  data: Record<string, JsonValue>;
};
export type HomepageContent = {
  services: CmsItem[];
  projects: CmsItem[];
  pricing: CmsItem[];
  faqs: CmsItem[];
  articles: CmsItem[];
};
