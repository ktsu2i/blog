import { format } from "date-fns";
import { ExternalLinkIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Talk } from "@/lib/types";

export function TalkCard({ talk }: { talk: Talk }) {
  const formattedDate = format(new Date(talk.date), "yyyy年M月d日");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{talk.title}</CardTitle>
        <CardDescription>
          {talk.event} / {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{talk.description}</p>
        <div className="aspect-video w-full overflow-hidden rounded-lg border">
          <iframe
            src={talk.embedUrl}
            title={talk.title}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <a
            href={talk.speakerdeckUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            SpeakerDeck で見る
            <ExternalLinkIcon className="size-3.5" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
