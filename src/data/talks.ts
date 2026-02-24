import type { Talk } from "../lib/types";

export const talks: Talk[] = [
  {
    id: "cloudsign-go-conference-mini-2026-sendai",
    title: "Go パッケージのサプライチェーン攻撃を防ぐ CI を作ってみた",
    event: "Go Conference mini in Sendai 2026",
    date: "2026-02-21",
    speakerdeckUrl: "https://speakerdeck.com/bengo4com/20260221-cloudsign-go-concerence-mini-2026-in-sendai",
    embedUrl: "https://speakerdeck.com/player/caad8d737da64cecacbeff26a5f0b343?title=false",
    description: "静的解析ツール capslock と Claude Code Action を組み合わせて、Go パッケージのサプライチェーン攻撃対策を自動化する方法について発表しました。",
  },
  {
    id: "cloudsign-coefl-go-benkyokai-2-tsutsui",
    title: "Understanding Go GC",
    event: "COEFL Go-JP #2",
    date: "2025-08-22",
    speakerdeckUrl: "https://speakerdeck.com/bengo4com/20250822-cloudsign-coefl-go-jp2-tsutsui",
    embedUrl: "https://speakerdeck.com/player/41bd3405621a4598963d5753725494d0?title=false",
    description: "Go におけるガベージコレクターの挙動やアルゴリズムに関して発表しました。",
  },
];
