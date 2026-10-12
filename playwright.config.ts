import { defineConfig } from "@playwright/test";
import { version } from "@playwright/test/package.json";

// The browser runs in the official Docker image so screenshots match on any host
const browserPort = 3001;

const desktop = { width: 1280, height: 800 };
const mobile = { width: 375, height: 667 };

export default defineConfig({
  testDir: "tests",
  testMatch: ["vrt/**/*.spec.ts", "a11y/**/*.spec.ts"],
  // Baselines are rendered on Linux regardless of the host OS
  snapshotPathTemplate:
    "{testDir}/{testFileDir}/__screenshots__/{arg}-{projectName}{ext}",
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:4321",
    connectOptions: {
      wsEndpoint: `ws://127.0.0.1:${browserPort}/`,
      exposeNetwork: "<loopback>",
    },
  },
  projects: [
    { name: "desktop-light", use: { viewport: desktop, colorScheme: "light" } },
    { name: "desktop-dark", use: { viewport: desktop, colorScheme: "dark" } },
    { name: "mobile-light", use: { viewport: mobile, colorScheme: "light" } },
    { name: "mobile-dark", use: { viewport: mobile, colorScheme: "dark" } },
  ],
  webServer: [
    {
      // CI downloads dist from the build job; locally always rebuild so a stale preview is never compared
      command: `${process.env.CI ? "" : "astro build && "}astro preview --port 4321 --ignore-lock`,
      url: "http://localhost:4321",
      timeout: 180_000,
    },
    {
      command: `docker run --rm --init -p ${browserPort}:3000 --user pwuser --workdir /home/pwuser mcr.microsoft.com/playwright:v${version}-noble /bin/sh -c "npx -y playwright@${version} run-server --port 3000 --host 0.0.0.0"`,
      url: `http://127.0.0.1:${browserPort}/`,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
      // SIGKILL would leave the container running
      gracefulShutdown: { signal: "SIGTERM", timeout: 10_000 },
    },
  ],
});
