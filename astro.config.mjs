import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  output: "static",
  site: "https://tortie.sh",
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/404/"),
      serialize(item) {
        if (item.url.includes("/compare/")) {
          return { ...item, changefreq: "weekly", priority: 0.9 };
        }
        if (item.url.includes("/docs/")) {
          return { ...item, changefreq: "weekly", priority: 0.8 };
        }
        return { ...item, changefreq: "weekly", priority: item.url === "https://tortie.sh/" ? 1 : 0.7 };
      },
    }),
  ],
  redirects: {
    "/compare": "/compare/agent-multiplexers/",
    "/compare/agent-ides": "/compare/agent-multiplexers/",
  },
  build: {
    inlineStylesheets: "always",
  },
});
