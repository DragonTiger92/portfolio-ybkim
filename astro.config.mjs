import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://portfolio-ybkim.pages.dev",
  trailingSlash: "always",
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
