import { createHash } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { apiResponse, ApiError } from "@/lib/api.server";
import { getAdminFromRequest, hasSameOrigin } from "@/lib/auth.server";

const maxUploadBytes = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: ({ request }) =>
        apiResponse(async () => {
          if (!hasSameOrigin(request)) throw new ApiError("Cross-origin request rejected.", 403);
          if (!(await getAdminFromRequest(request)))
            throw new ApiError("Sign in to upload images.", 401);

          const cloudName = process.env["CLOUDINARY_CLOUD_NAME"];
          const apiKey = process.env["CLOUDINARY_API_KEY"];
          const apiSecret = process.env["CLOUDINARY_API_SECRET"];
          if (!cloudName || !apiKey || !apiSecret) {
            throw new ApiError(
              "Image uploads are not configured. Add Cloudinary credentials to the server environment.",
              503,
            );
          }

          const declaredLength = Number(request.headers.get("content-length") ?? 0);
          if (declaredLength > maxUploadBytes + 100_000)
            throw new ApiError("Image exceeds the 8 MB upload limit.", 413);
          const form = await request.formData();
          const file = form.get("file");
          if (!(file instanceof File)) throw new ApiError("Choose an image to upload.", 400);
          if (!allowedTypes.has(file.type))
            throw new ApiError("Use a JPEG, PNG, WebP, or AVIF image.", 415);
          if (file.size > maxUploadBytes)
            throw new ApiError("Image exceeds the 8 MB upload limit.", 413);

          const timestamp = Math.floor(Date.now() / 1000).toString();
          const signature = createHash("sha1")
            .update(`folder=trivon&timestamp=${timestamp}${apiSecret}`)
            .digest("hex");
          const payload = new FormData();
          payload.set("file", new Blob([await file.arrayBuffer()], { type: file.type }), file.name);
          payload.set("api_key", apiKey);
          payload.set("timestamp", timestamp);
          payload.set("folder", "trivon");
          payload.set("signature", signature);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
            {
              method: "POST",
              body: payload,
            },
          );
          const result: unknown = await response.json();
          if (
            !response.ok ||
            result == null ||
            typeof result !== "object" ||
            !("secure_url" in result) ||
            typeof result.secure_url !== "string"
          ) {
            console.error("Cloudinary image upload failed:", result);
            throw new ApiError(
              "The image could not be uploaded. Check the Cloudinary configuration and try again.",
              502,
            );
          }
          return Response.json({ url: result.secure_url });
        }),
    },
  },
});
