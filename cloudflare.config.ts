import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "blog",
    compatibilityDate: "2026-02-28",
    previewUrls: false,
    observability: {
      enabled: true,
    },
    assets: {
      notFoundHandling: "404-page",
    },
    domains: ["ktsu2i.dev"],
  },
});
