import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  globalSetup: "./scripts/visual-test-environment.mjs",
  fullyParallel: true,
  forbidOnly: true,
  failOnFlakyTests: true,
  retries: 1,
  workers: 2,
  outputDir: "visual-results",
  reporter: [["list"], ["html", { outputFolder: "visual-report", open: "never" }]],
  snapshotPathTemplate: "{testDir}/baselines/{projectName}/{arg}{ext}",
  updateSnapshots: "none",
  expect: {
    toHaveScreenshot: { animations: "disabled", caret: "hide", threshold: 0.2, maxDiffPixels: 0 },
  },
  use: {
    browserName: "chromium",
    baseURL: "http://127.0.0.1:4321",
    deviceScaleFactor: 1,
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm preview:test",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "desktop-light",
      use: { viewport: { width: 1440, height: 900 }, colorScheme: "light" },
    },
    { name: "desktop-dark", use: { viewport: { width: 1440, height: 900 }, colorScheme: "dark" } },
    {
      name: "mobile-light",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        colorScheme: "light",
      },
    },
    {
      name: "mobile-dark",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        colorScheme: "dark",
      },
    },
  ],
});
