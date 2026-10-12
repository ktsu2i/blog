import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// Strict so that typos like `ogtitle` fail the build instead of being dropped
export const postSchema = z
  .object({
    title: z.string().trim().min(1),
    ogTitle: z.string().trim().min(1).optional(),
    date: z.iso.date(),
    description: z.string().optional().default(""),
    draft: z.boolean().optional().default(false),
  })
  .strict();

function generatePostId({ entry }: { entry: string }): string {
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
