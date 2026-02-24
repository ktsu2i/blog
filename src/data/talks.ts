import type { Talk } from "../lib/types";

export const talks: Talk[] = [
  {
    id: "talk-1",
    title: "サンプルトーク: モダンフロントエンド開発",
    event: "Tech Conference 2025",
    date: "2025-06-15",
    speakerdeckUrl: "https://speakerdeck.com/example/modern-frontend",
    embedUrl: "https://speakerdeck.com/player/example-embed-id",
    description:
      "モダンフロントエンド開発のベストプラクティスについて発表しました。",
  },
  {
    id: "talk-2",
    title: "サンプルトーク: Go で作る CLI ツール",
    event: "Go Meetup Tokyo",
    date: "2025-03-20",
    speakerdeckUrl: "https://speakerdeck.com/example/go-cli-tools",
    embedUrl: "https://speakerdeck.com/player/example-embed-id-2",
    description: "Go 言語を使った CLI ツールの設計と実装について紹介しました。",
  },
];
