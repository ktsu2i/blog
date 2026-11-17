import type { Talk } from "../lib/types";
import type { Locale, Localized } from "../i18n/config";

const talks: Localized<Talk, "title" | "event" | "description">[] = [
  {
    id: "levtech-meetup-improvement-loop-engineering",
    date: "2026-11-16",
    speakerdeckUrl:
      "https://speakerdeck.com/bengo4com/20261116-levtech-meetup-improvement-loop-engineering",
    embedUrl:
      "https://speakerdeck.com/player/671cbffe6b964d6e855ddb58a2cd8394?title=false",
    thumbnailUrl:
      "https://files.speakerdeck.com/presentations/671cbffe6b964d6e855ddb58a2cd8394/slide_0.jpg",
    localized: {
      ja: {
        event: "レバテックMeetup Claude Code×開発",
        title: "業務の傍らで進める改善ループエンジニアリング",
        description:
          "日々の業務と並行して、AI エージェントがコードベースを改善し続けるループを作った取り組みについて発表しました。",
      },
      en: {
        event: "Levtech Meetup Claude Code x Development",
        title: "Improvement Loop Engineering Alongside Daily Work",
        description:
          "Presented my work on building a loop in which AI agents keep improving the codebase alongside my daily work.",
      },
    },
  },
  {
    id: "cloudsign-go-conference-mini-2026-sendai",
    date: "2026-02-21",
    speakerdeckUrl:
      "https://speakerdeck.com/bengo4com/20260221-cloudsign-go-concerence-mini-2026-in-sendai",
    embedUrl:
      "https://speakerdeck.com/player/caad8d737da64cecacbeff26a5f0b343?title=false",
    thumbnailUrl:
      "https://files.speakerdeck.com/presentations/caad8d737da64cecacbeff26a5f0b343/slide_0.jpg",
    localized: {
      ja: {
        event: "Go Conference mini in Sendai 2026",
        title: "Go パッケージのサプライチェーン攻撃を防ぐ CI を作ってみた",
        description:
          "静的解析ツール capslock と Claude Code Action を組み合わせて、Go パッケージのサプライチェーン攻撃対策を自動化する方法について発表しました。",
      },
      en: {
        event: "Go Conference mini in Sendai 2026",
        title: "Building a CI to Prevent Supply Chain Attacks on Go Packages",
        description:
          "Presented on automating Go package supply chain attack prevention using capslock and Claude Code Action.",
      },
    },
  },
  {
    id: "cloudsign-coefl-go-benkyokai-2-tsutsui",
    date: "2025-08-22",
    speakerdeckUrl:
      "https://speakerdeck.com/bengo4com/20250822-cloudsign-coefl-go-jp2-tsutsui",
    embedUrl:
      "https://speakerdeck.com/player/41bd3405621a4598963d5753725494d0?title=false",
    thumbnailUrl:
      "https://files.speakerdeck.com/presentations/41bd3405621a4598963d5753725494d0/slide_0.jpg",
    localized: {
      ja: {
        event: "COEFL Go-JP #2",
        title: "Understanding Go GC",
        description:
          "Go におけるガベージコレクターの挙動やアルゴリズムに関して発表しました。",
      },
      en: {
        event: "COEFL Go-JP #2",
        title: "Understanding Go GC",
        description:
          "Presented on Go garbage collector behavior and algorithms.",
      },
    },
  },
];

export function getTalks(locale: Locale): Talk[] {
  return talks.map(({ localized, ...talk }) => ({
    ...talk,
    ...localized[locale],
  }));
}
