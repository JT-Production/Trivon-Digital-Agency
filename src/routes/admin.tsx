import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
  head: () => ({
    meta: [{ title: "Admin | Trivon" }, { name: "robots", content: "noindex, nofollow" }],
  }),
});
