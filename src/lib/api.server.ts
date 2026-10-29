import { ConfigurationError } from "./errors";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function apiResponse(operation: () => Promise<Response>): Promise<Response> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof ConfigurationError) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    if (
      error != null &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "MongoParseError"
    ) {
      return Response.json(
        {
          error:
            "MONGODB_URI is not a valid MongoDB connection string. It must start with mongodb:// or mongodb+srv://.",
        },
        { status: 503 },
      );
    }
    if (
      error != null &&
      typeof error === "object" &&
      "name" in error &&
      typeof error.name === "string" &&
      [
        "MongooseServerSelectionError",
        "MongoServerSelectionError",
        "MongoNetworkError",
        "MongoParseError",
      ].includes(error.name)
    ) {
      console.error("MongoDB request failed:", error);
      return Response.json(
        {
          error:
            "Could not connect to MongoDB. Check MONGODB_URI, the database user's credentials, and Atlas network access.",
        },
        { status: 503 },
      );
    }
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    if (
      error != null &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ZodError"
    ) {
      return Response.json(
        {
          error: "The submitted data is invalid.",
          details: "issues" in error ? error.issues : undefined,
        },
        { status: 400 },
      );
    }
    console.error("API request failed:", error);
    return Response.json({ error: "The request could not be completed." }, { status: 500 });
  }
}

export async function readJson(request: Request): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 1_000_000) throw new ApiError("Request body exceeds the 1 MB limit.", 413);
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > 1_000_000) {
    throw new ApiError("Request body exceeds the 1 MB limit.", 413);
  }
  return JSON.parse(body) as unknown;
}
