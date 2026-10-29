import { createFileRoute } from "@tanstack/react-router";
import { apiResponse, ApiError } from "@/lib/api.server";
import { getAdminFromRequest } from "@/lib/auth.server";
import { connectDatabase } from "@/lib/database.server";
import { cmsModels } from "@/lib/cms.server";
import { listInquiries } from "@/lib/inquiries.server";

export const Route = createFileRoute("/api/admin/stats")({
  server: {
    handlers: {
      GET: ({ request }) =>
        apiResponse(async () => {
          if (!(await getAdminFromRequest(request)))
            throw new ApiError("Sign in to view dashboard statistics.", 401);
          await connectDatabase();
          const [services, projects, articles, inquiries] = await Promise.all([
            cmsModels.services.countDocuments(),
            cmsModels.projects.countDocuments(),
            cmsModels.articles.countDocuments(),
            listInquiries(),
          ]);
          return Response.json({
            services,
            projects,
            articles,
            inquiries: inquiries.length,
            unread: inquiries.filter((item) => !item.read).length,
            recent: inquiries.slice(0, 5),
          });
        }),
    },
  },
});
