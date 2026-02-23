import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "project-1",
    title: "個人ブログ",
    description:
      "Next.js + MDX で構築した個人ブログ。ローカル記事と Zenn 外部記事を統一フィードで表示。",
    url: "https://example.com",
    repoUrl: "https://github.com/example/blog",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "project-2",
    title: "サンプルプロジェクト",
    description:
      "プレースホルダーのプロジェクトです。実際のプロジェクト情報に置き換えてください。",
    repoUrl: "https://github.com/example/sample",
    tags: ["Go", "REST API"],
  },
  {
    id: "project-3",
    title: "もうひとつのプロジェクト",
    description:
      "プレースホルダーのプロジェクトです。実際のプロジェクト情報に置き換えてください。",
    tags: ["React", "Firebase"],
  },
];
