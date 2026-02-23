import type { Metadata } from "next";
import { career } from "@/content/career";

export const metadata: Metadata = {
  title: "Career",
  description: "経歴",
};

export default function CareerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Career</h1>
        <p className="mt-2 text-muted-foreground">経歴・職歴</p>
      </div>

      <div className="relative space-y-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-border sm:before:left-[7.5rem]">
        {career.map((entry) => (
          <div
            key={entry.id}
            className="relative grid gap-1 pl-6 sm:grid-cols-[7.5rem_1fr] sm:gap-8 sm:pl-0"
          >
            <div className="absolute left-0 top-2 size-2 rounded-full bg-foreground sm:left-[7rem]" />
            <p className="text-sm font-medium text-muted-foreground sm:text-right">
              {entry.period}
            </p>
            <div className="space-y-1">
              <h3 className="font-semibold">{entry.company}</h3>
              <p className="text-sm text-muted-foreground">{entry.role}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {entry.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
