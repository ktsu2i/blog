import { rename, rmdir } from "node:fs/promises";
import { defineConfig, fontProviders } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import remarkLinkCard from "remark-link-card-plus";
import remarkXEmbed from "./src/lib/remark-x-embed";
import remarkMermaid from "./src/lib/remark-mermaid";
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
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Geist Sans",
      cssVariable: "--font-geist-sans",
      options: {
        variants: [400, 500, 600, 700].map((weight) => ({
          weight,
          style: "normal",
          src: [
            `@fontsource/geist-sans/files/geist-sans-latin-${weight}-normal.woff2`,
          ],
        })),
      },
      // Geist has narrow CJK punctuation (、。「」 etc.); keep it to Latin only
      unicodeRange: [
        "U+0000-00FF",
        "U+0131",
        "U+0152-0153",
        "U+02BB-02BC",
        "U+02C6",
        "U+02DA",
        "U+02DC",
        "U+0304",
        "U+0308",
        "U+0329",
        "U+2000-206F",
        "U+20AC",
        "U+2122",
        "U+2191",
        "U+2193",
        "U+2212",
        "U+2215",
        "U+FEFF",
        "U+FFFD",
      ],
      // Japanese glyphs come from system fonts; Noto Sans JP as a web font costs ~600KB
      fallbacks: [
        "Hiragino Sans",
        "Hiragino Kaku Gothic ProN",
        "Noto Sans JP",
        "Noto Sans CJK JP",
        "Yu Gothic UI",
        "Meiryo",
        "sans-serif",
      ],
    },
    {
      provider: fontProviders.npm({ remote: false }),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      options: { package: "@fontsource/geist-mono" },
      weights: [400],
      styles: ["normal"],
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],
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
      remarkMermaid,
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
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-src https://speakerdeck.com https://platform.twitter.com https://syndication.twitter.com",
      ],
      scriptDirective: {
        resources: ["'self'", "https://platform.twitter.com"],
      },
      // Shiki and mermaid SVGs emit inline styles that Astro does not hash
      styleDirective: {
        resources: ["'self'", "'unsafe-inline'"],
      },
    },
  },
  image: {
    domains: [
      "res.cloudinary.com",
      "cdn.image.st-hatena.com",
      "files.speakerdeck.com",
    ],
  },
});
