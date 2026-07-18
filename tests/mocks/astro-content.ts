import { vi } from "vitest";
import { z } from "astro/zod";

export const getCollection = vi.fn();

export function defineCollection<T>(config: T): T {
  return config;
}

export { z };
