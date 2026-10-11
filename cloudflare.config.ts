import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "blog",
    compatibilityDate: "2026-02-28",
    previewUrls: false,
    observability: {
      enabled: true,
    },
    domains: ["ktsu2i.dev"],
  },
});
