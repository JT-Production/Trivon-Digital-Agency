import { createFileRoute } from "@tanstack/react-router";
import { apiResponse, ApiError, readJson } from "@/lib/api.server";
import { hasSameOrigin } from "@/lib/auth.server";
import { createNewsletterSignup } from "@/lib/inquiries.server";

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: ({ request }) =>
        apiResponse(async () => {
          if (!hasSameOrigin(request)) throw new ApiError("Cross-origin request rejected.", 403);
          await createNewsletterSignup(await readJson(request));
          return Response.json({ subscribed: true }, { status: 201 });
        }),
    },
  },
});
