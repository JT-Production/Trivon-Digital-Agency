import { createFileRoute } from "@tanstack/react-router";
import { apiResponse, ApiError, readJson } from "@/lib/api.server";
import { getAdminFromRequest, hasSameOrigin } from "@/lib/auth.server";
import { deleteContent, getPublicRecord, isCollectionName, updateContent } from "@/lib/cms.server";

export const Route = createFileRoute("/api/content/$collection/$slug")({
  server: {
    handlers: {
      GET: ({ params }) =>
        apiResponse(async () => {
          if (!isCollectionName(params.collection))
            throw new ApiError("Unknown content collection.", 404);
          const record = await getPublicRecord(params.collection, params.slug);
          if (!record) throw new ApiError("Content not found.", 404);
          return Response.json(record);
        }),
      PUT: ({ request, params }) =>
        apiResponse(async () => {
          if (!isCollectionName(params.collection))
            throw new ApiError("Unknown content collection.", 404);
          if (!hasSameOrigin(request)) throw new ApiError("Cross-origin request rejected.", 403);
          if (!(await getAdminFromRequest(request)))
            throw new ApiError("Sign in to manage content.", 401);
          const record = await updateContent(
            params.collection,
            params.slug,
            await readJson(request),
          );
          if (!record) throw new ApiError("Content not found.", 404);
          return Response.json(record);
        }),
      DELETE: ({ request, params }) =>
        apiResponse(async () => {
          if (!isCollectionName(params.collection))
            throw new ApiError("Unknown content collection.", 404);
          if (!hasSameOrigin(request)) throw new ApiError("Cross-origin request rejected.", 403);
          if (!(await getAdminFromRequest(request)))
            throw new ApiError("Sign in to manage content.", 401);
          if (!(await deleteContent(params.collection, params.slug)))
            throw new ApiError("Content not found.", 404);
          return new Response(null, { status: 204 });
        }),
    },
  },
});
