// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://outfitedits.com',

  // ✅ Clean URLs configuration (bina .html extension ke)
  trailingSlash: 'never',

  integrations: [
    react(),
    keystatic(), // HAMESHA on — sirf isi se /keystatic panel kaam karta hai
    sitemap({
      // Search results and the CMS are not public landing pages.
      filter: (page) => !page.includes('/search') && !page.includes('/keystatic'),
    }),
  ],

  // 'hybrid' = blog pages build time par static rahenge lekin /keystatic route server se chalega
  output: 'hybrid',

  // Cloudflare adapter setup with image configuration and platformProxy enabled
  adapter: cloudflare({
    imageService: 'passthrough', // ✅ Sharp image error fix
    platformProxy: {
      enabled: true, // ✅ Cloudflare variables (GITHUB_TOKEN) bypass fix
    },
  }),

  vite: {
    ssr: {
      // ✅ Node worker bundle crash fix
      external: [
        'node:path',
        'node:fs',
        'node:fs/promises',
        'node:crypto',
        'node:process',
        'node:util'
      ],
    },
    plugins: [
      tailwindcss(),
    ],
  },

  image: {
    domains: ['r2.cloudflarestorage.com'],
  },
});
