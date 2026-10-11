import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Astro's tsconfig sets jsx: preserve, so compile JSX for React here
  oxc: {
    jsx: { runtime: "automatic", importSource: "react" },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Astro virtual module; tests control collections via this mock
      "astro:content": fileURLToPath(
        new URL("./tests/mocks/astro-content.ts", import.meta.url),
      ),
    },
  },
  test: {
    // Tests sit next to their sources; route tests live in src/pages/__tests__
    // because Astro treats every other file under src/pages as a route
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        // Vendored by the shadcn CLI
        "src/components/ui/**",
      ],
      reporter: ["text", "json-summary", "lcovonly"],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
