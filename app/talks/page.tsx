import type { Metadata } from "next";
import { TalkCard } from "@/components/talk-card";
import { talks } from "@/content/talks";

export const metadata: Metadata = {
  title: "Talks",
  description: "登壇・発表まとめ",
};

export default function TalksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Talks</h1>
        <p className="mt-2 text-muted-foreground">
          カンファレンスやミートアップでの登壇・発表一覧です。
        </p>
      </div>
      <div className="space-y-6">
        {talks.map((talk) => (
          <TalkCard key={talk.id} talk={talk} />
        ))}
      </div>
    </div>
  );
}
