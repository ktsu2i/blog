import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    ogTitle: z.string().optional(),
    date: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { posts };
