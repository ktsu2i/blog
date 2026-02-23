import fs from "fs";
import path from "path";
import type { Post } from "./types";

const zennJsonPath = path.join(process.cwd(), "content/generated/zenn.json");

export function listZennPosts(): Post[] {
  try {
    const raw = fs.readFileSync(zennJsonPath, "utf-8");
    return JSON.parse(raw) as Post[];
  } catch {
    return [];
  }
}
