import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { apiResponse, ApiError, readJson } from "@/lib/api.server";
import { authenticateAdmin, bootstrapAdmin, hasSameOrigin, sessionCookie } from "@/lib/auth.server";

const credentialsSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200),
});

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: ({ request }) =>
        apiResponse(async () => {
          if (!hasSameOrigin(request)) throw new ApiError("Cross-origin request rejected.", 403);
          await bootstrapAdmin();
          const credentials = credentialsSchema.parse(await readJson(request));
          const token = await authenticateAdmin(credentials.email, credentials.password);
          if (!token)
            throw new ApiError(
              "Email or password is incorrect, or the account is temporarily locked.",
              401,
            );
          return Response.json(
            { authenticated: true },
            { headers: { "Set-Cookie": sessionCookie(token), "Cache-Control": "no-store" } },
          );
        }),
    },
  },
});
