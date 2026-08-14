import { defineConfig } from "astro/config";

// Static output, no adapter. Deploys to Vercel as plain files.
export default defineConfig({
  site: "https://tortie.sh",
  output: "static",
  build: {
    inlineStylesheets: "always",
  },
});
