import { rename, rmdir } from "node:fs/promises";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import remarkLinkCard from "remark-link-card-plus";
import remarkXEmbed from "./src/lib/remark-x-embed";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";

// Astro emits only the root 404 as 404.html; Cloudflare needs en/404.html too
const localizedNotFound = {
  name: "localized-not-found",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      const src = new URL("en/404/", dir);
      await rename(new URL("index.html", src), new URL("en/404.html", dir));
      await rmdir(src);
    },
  },
};

export default defineConfig({
  site: "https://ktsu2i.dev",
  server: { port: 3000 },
  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    mdx(),
    sitemap({ filter: (page) => !page.endsWith("/404/") }),
    localizedNotFound,
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [
      remarkGfm,
      remarkXEmbed,
      [remarkLinkCard, { cache: true, shortenUrl: true }],
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
  },
  image: {
    domains: ["res.cloudinary.com", "cdn.image.st-hatena.com"],
  },
});
