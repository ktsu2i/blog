import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const postSchema = z.object({
  title: z.string(),
  ogTitle: z.string().optional(),
  date: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
  draft: z.boolean().optional().default(false),
});

const postsJa = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts/ja" }),
  schema: postSchema,
});

const postsEn = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts/en" }),
  schema: postSchema,
});

export const collections = { postsJa, postsEn };
