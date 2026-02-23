import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostFrontmatter } from "./types";
import { renderMdx } from "./mdx";

const postsDirectory = path.join(process.cwd(), "content/posts");

export async function listLocalPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory).filter((file) =>
    /\.(mdx|md)$/.test(file)
  );

  const posts: Post[] = [];

  for (const file of files) {
    const filePath = path.join(postsDirectory, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const frontmatter = data as PostFrontmatter;

    if (frontmatter.draft && process.env.NODE_ENV === "production") {
      continue;
    }

    const slug = file.replace(/\.(mdx|md)$/, "");

    posts.push({
      id: slug,
      type: "local",
      source: "local",
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags,
      description: frontmatter.description,
      draft: frontmatter.draft,
    });
  }

  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return posts;
}

export async function getLocalPostBySlug(
  slug: string
): Promise<{ meta: Post; content: string } | null> {
  const extensions = [".mdx", ".md"];
  let filePath: string | null = null;

  for (const ext of extensions) {
    const candidate = path.join(postsDirectory, `${slug}${ext}`);
    if (fs.existsSync(candidate)) {
      filePath = candidate;
      break;
    }
  }

  if (!filePath) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: rawContent } = matter(raw);
  const frontmatter = data as PostFrontmatter;

  const content = await renderMdx(rawContent);

  return {
    meta: {
      id: slug,
      type: "local",
      source: "local",
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags,
      description: frontmatter.description,
      draft: frontmatter.draft,
    },
    content,
  };
}
