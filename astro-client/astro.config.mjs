// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";

// Fully static: the site has no API routes and the case studies are prerendered.
export default defineConfig({
  output: "static",
  site: "https://vojmax.dev",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  adapter: vercel(),
});
