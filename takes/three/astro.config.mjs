import { defineConfig } from "astro/config";

// Static output, no adapter. The brief fixes this for all takes.
export default defineConfig({
  output: "static",
  site: "https://tortie.sh",
  build: {
    inlineStylesheets: "always",
  },
});
