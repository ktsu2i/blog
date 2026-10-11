import { vi } from "vitest";

export { z } from "astro/zod";

export const getCollection = vi.fn();

export function defineCollection<T>(config: T): T {
  return config;
}
