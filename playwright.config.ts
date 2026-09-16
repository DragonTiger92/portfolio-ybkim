import { defineConfig, devices } from "@playwright/test";

const runtime = (globalThis as { process?: { env?: { CI?: string }; platform?: string } }).process;
const isCi = Boolean(runtime?.env?.CI);
const usesSystemEdge = runtime?.platform === "win32" && !isCi;
const localChromiumChannel = usesSystemEdge ? { channel: "msedge" as const } : {};
const webkitProjects = usesSystemEdge
  ? []
  : [
      {
        name: "webkit-smoke",
        testMatch: "**/cross-browser-smoke.spec.ts",
        use: { ...devices["Desktop Safari"] },
      },
    ];

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm preview",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !isCi,
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], ...localChromiumChannel },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"], ...localChromiumChannel },
    },
    ...webkitProjects,
  ],
});
