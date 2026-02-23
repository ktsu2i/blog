import { ExternalLinkIcon, GithubIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        {project.url && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              Site
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </Button>
        )}
        {project.repoUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              GitHub
              <GithubIcon className="size-3.5" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
