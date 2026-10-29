import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/database.server", () => ({
  connectDatabase: vi.fn(),
}));

import { connectDatabase } from "../lib/database.server";
import { cmsModels, createContent, getPublicRecord, listPublicContent } from "../lib/cms.server";

describe("public CMS database fallback", () => {
  const originalMongoUri = process.env["MONGODB_URI"];

  beforeEach(() => {
    process.env["MONGODB_URI"] = "mongodb://example.test/trivon";
    vi.mocked(connectDatabase).mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalMongoUri === undefined) delete process.env["MONGODB_URI"];
    else process.env["MONGODB_URI"] = originalMongoUri;
  });

  it("does not hide database authentication errors behind preview content", async () => {
    const authenticationError = Object.assign(new Error("Authentication failed"), {
      name: "MongoServerError",
      code: 18,
    });
    vi.mocked(connectDatabase).mockRejectedValue(authenticationError);

    await expect(listPublicContent("services")).rejects.toBe(authenticationError);
  });

  it("uses placeholder content when a connected collection has no published records", async () => {
    const query = {
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([]),
    };
    vi.spyOn(cmsModels.services, "find").mockReturnValue(query as never);

    const services = await listPublicContent("services");
    const service = await getPublicRecord("services", "design");

    expect(services.length).toBeGreaterThan(0);
    expect(service?.title).toBe("Web Design");
  });

  it("uses preview content during a transient outage but keeps writes unavailable", async () => {
    const unavailable = Object.assign(new Error("Database unavailable"), {
      name: "MongooseServerSelectionError",
    });
    vi.mocked(connectDatabase).mockRejectedValue(unavailable);

    const services = await listPublicContent("services");
    const service = await getPublicRecord("services", "design");

    expect(services.length).toBeGreaterThan(0);
    expect(service?.slug).toBe("design");
    expect(connectDatabase).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(1);

    await expect(
      createContent("services", {
        title: "Test service",
        slug: "test-service",
        status: "draft",
        order: 0,
        data: {},
      }),
    ).rejects.toBe(unavailable);
  });
});
