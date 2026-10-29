import { createFileRoute } from "@tanstack/react-router";
import { apiResponse, ApiError } from "@/lib/api.server";
import { clearedSessionCookie, hasSameOrigin } from "@/lib/auth.server";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: ({ request }) =>
        apiResponse(async () => {
          if (!hasSameOrigin(request)) throw new ApiError("Cross-origin request rejected.", 403);
          return Response.json(
            { authenticated: false },
            { headers: { "Set-Cookie": clearedSessionCookie(), "Cache-Control": "no-store" } },
          );
        }),
    },
  },
});
