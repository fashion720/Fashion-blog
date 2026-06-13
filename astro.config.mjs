// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // CHANGE THIS to your real domain once you buy it, e.g. https://yourblog.com
  site: 'https://example.com',

  integrations: [
    react(),     // needed for Keystatic admin UI (dev only)
    keystatic(), // /keystatic route only runs in `astro dev`, not in the static build
    sitemap(),
  ],

  // Static output = free hosting on Cloudflare Pages, no server/Node required
  output: 'static',

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    // allow remote images if you ever load from Cloudflare R2 / a CDN
    domains: ['r2.cloudflarestorage.com'],
  },
});
