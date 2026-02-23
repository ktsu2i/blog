import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description: "自己紹介",
};

const techStack = [
  "TypeScript",
  "Go",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "Git",
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
      </div>

      <div className="flex flex-col items-start gap-8 sm:flex-row">
        <div className="size-32 shrink-0 rounded-full bg-muted" />
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">ktsu2i</h2>
          <p className="leading-relaxed text-muted-foreground">
            ソフトウェアエンジニア。Web 開発を中心に活動しています。
            プレースホルダーのテキストです。実際の自己紹介に置き換えてください。
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Links</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>
            <a
              href="https://github.com/ktsu2i"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://x.com/ktsu2i"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              X (Twitter)
            </a>
          </li>
          <li>
            <a
              href="https://zenn.dev/ktsu2i"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Zenn
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
