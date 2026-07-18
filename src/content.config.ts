import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postSchema = z.object({
  title: z.string(),
  ogTitle: z.string().optional(),
  date: z.string(),
  description: z.string().optional().default(""),
  draft: z.boolean().optional().default(false),
});

export function generatePostId({ entry }: { entry: string }): string {
  const id = entry.replace(/\.(?:md|mdx)$/, "");
  return id.replace(/(^|\/)\d{8}-(?=[^/]+$)/, "$1");
}

const postsJa = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/posts/ja",
    generateId: generatePostId,
  }),
  schema: postSchema,
});

const postsEn = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/posts/en",
    generateId: generatePostId,
  }),
  schema: postSchema,
});

export const collections = { postsJa, postsEn };
