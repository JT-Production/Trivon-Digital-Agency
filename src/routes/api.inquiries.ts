import { createFileRoute } from "@tanstack/react-router";
import { apiResponse, ApiError, readJson } from "@/lib/api.server";
import { getAdminFromRequest, hasSameOrigin } from "@/lib/auth.server";
import { createInquiry, listInquiries, parseInquiry } from "@/lib/inquiries.server";

export const Route = createFileRoute("/api/inquiries")({
  server: {
    handlers: {
      GET: ({ request }) =>
        apiResponse(async () => {
          if (!(await getAdminFromRequest(request)))
            throw new ApiError("Sign in to view inquiries.", 401);
          return Response.json(await listInquiries(), { headers: { "Cache-Control": "no-store" } });
        }),
      POST: ({ request }) =>
        apiResponse(async () => {
          if (!hasSameOrigin(request)) throw new ApiError("Cross-origin request rejected.", 403);
          let inquiry;
          try {
            inquiry = parseInquiry(await readJson(request));
          } catch (error) {
            if (error instanceof Error && error.message === "Spam submission rejected.") {
              return Response.json({ submitted: true }, { status: 201 });
            }
            throw error;
          }
          const created = await createInquiry(inquiry);
          return Response.json({ submitted: true, id: created._id }, { status: 201 });
        }),
    },
  },
});
