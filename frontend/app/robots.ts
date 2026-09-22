import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",      // Admin panel tidak untuk di-index
          "/api/",        // API routes tidak perlu di-index
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}