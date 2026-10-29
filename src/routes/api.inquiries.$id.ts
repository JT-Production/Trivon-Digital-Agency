import { createFileRoute } from "@tanstack/react-router";
import { apiResponse, ApiError } from "@/lib/api.server";
import { getAdminFromRequest, hasSameOrigin } from "@/lib/auth.server";
import { markInquiryRead, removeInquiry } from "@/lib/inquiries.server";

export const Route = createFileRoute("/api/inquiries/$id")({
  server: {
    handlers: {
      PATCH: ({ request, params }) =>
        apiResponse(async () => {
          if (!hasSameOrigin(request)) throw new ApiError("Cross-origin request rejected.", 403);
          if (!(await getAdminFromRequest(request)))
            throw new ApiError("Sign in to manage inquiries.", 401);
          const body: unknown = await request.json();
          if (
            body == null ||
            typeof body !== "object" ||
            !("read" in body) ||
            typeof body.read !== "boolean"
          ) {
            throw new ApiError("Provide a boolean read status.", 400);
          }
          const inquiry = await markInquiryRead(params.id, body.read);
          if (!inquiry) throw new ApiError("Inquiry not found.", 404);
          return Response.json(inquiry);
        }),
      DELETE: ({ request, params }) =>
        apiResponse(async () => {
          if (!hasSameOrigin(request)) throw new ApiError("Cross-origin request rejected.", 403);
          if (!(await getAdminFromRequest(request)))
            throw new ApiError("Sign in to manage inquiries.", 401);
          if (!(await removeInquiry(params.id))) throw new ApiError("Inquiry not found.", 404);
          return new Response(null, { status: 204 });
        }),
    },
  },
});
