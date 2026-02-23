import fs from "fs";
import path from "path";
import type { Post } from "./types";

const jsonPath = path.join(process.cwd(), "content/generated/bengo4.json");

export function listBengo4Posts(): Post[] {
  try {
    const raw = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(raw) as Post[];
  } catch {
    return [];
  }
}
