import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/invite/"],
    },
    sitemap: "https://rentcot.com/sitemap.xml",
  };
}
