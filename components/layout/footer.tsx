import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://github.com/ktsu2i"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <Separator orientation="vertical" className="h-4" />
            <a
              href="https://x.com/ktsu2i"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              X
            </a>
            <Separator orientation="vertical" className="h-4" />
            <a
              href="https://zenn.dev/ktsu2i"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Zenn
            </a>
            <Separator orientation="vertical" className="h-4" />
            <Link
              href="/feed.xml"
              className="hover:text-foreground transition-colors"
            >
              RSS
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ktsu2i.dev
          </p>
        </div>
      </div>
    </footer>
  );
}
