import { defineConfig } from "astro/config";

// Static output, no adapter. The brief fixes this for all takes.
export default defineConfig({
  output: "static",
  site: "https://tortie.sh",
  redirects: {
    "/compare": "/compare/agent-multiplexers/",
    "/compare/agent-ides": "/compare/agent-multiplexers/",
  },
  build: {
    inlineStylesheets: "always",
  },
});
