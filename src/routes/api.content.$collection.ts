import { createFileRoute } from "@tanstack/react-router";
import { apiResponse, ApiError, readJson } from "@/lib/api.server";
import { getAdminFromRequest, hasSameOrigin } from "@/lib/auth.server";
import {
  createContent,
  isCollectionName,
  listAdminContent,
  listPublicContent,
} from "@/lib/cms.server";

export const Route = createFileRoute("/api/content/$collection")({
  server: {
    handlers: {
      GET: ({ request, params }) =>
        apiResponse(async () => {
          if (!isCollectionName(params.collection))
            throw new ApiError("Unknown content collection.", 404);
          if (new URL(request.url).searchParams.get("admin") === "1") {
            if (!(await getAdminFromRequest(request)))
              throw new ApiError("Sign in to access the content dashboard.", 401);
            return Response.json(await listAdminContent(params.collection));
          }
          return Response.json(await listPublicContent(params.collection));
        }),
      POST: ({ request, params }) =>
        apiResponse(async () => {
          if (!isCollectionName(params.collection))
            throw new ApiError("Unknown content collection.", 404);
          if (!hasSameOrigin(request)) throw new ApiError("Cross-origin request rejected.", 403);
          if (!(await getAdminFromRequest(request)))
            throw new ApiError("Sign in to manage content.", 401);
          return Response.json(await createContent(params.collection, await readJson(request)), {
            status: 201,
          });
        }),
    },
  },
});
