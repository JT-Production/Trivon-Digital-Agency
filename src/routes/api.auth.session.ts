import { createFileRoute } from "@tanstack/react-router";
import { apiResponse } from "@/lib/api.server";
import { getAdminFromRequest } from "@/lib/auth.server";

export const Route = createFileRoute("/api/auth/session")({
  server: {
    handlers: {
      GET: ({ request }) =>
        apiResponse(async () => {
          const admin = await getAdminFromRequest(request);
          return Response.json(
            { authenticated: Boolean(admin), email: admin?.email ?? null },
            { headers: { "Cache-Control": "no-store" } },
          );
        }),
    },
  },
});
