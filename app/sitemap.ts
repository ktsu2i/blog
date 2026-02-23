import type { MetadataRoute } from "next";
import { listLocalPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || "https://example.com";
  const posts = await listLocalPosts();
  const staticPages = [
    "/",
    "/blog",
    "/notes",
    "/talks",
    "/about",
    "/career",
    "/projects",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ];
}
