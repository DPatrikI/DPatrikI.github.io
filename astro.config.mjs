import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://dpatriki.github.io",
  output: "static",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      sourcemap: false,
    },
  },
});
