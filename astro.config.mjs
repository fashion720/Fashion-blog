// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://outfitedits.com', // ← Aapka live pages url yahan set kar diya hai

  // ✅ FIX: Trailing slash consistent rakhne ke liye — duplicate URL issue (with/without slash) khatam
  trailingSlash: 'always',

  integrations: [
    react(),
    keystatic(), // HAMESHA on — sirf isi se /keystatic panel kaam karta hai
    sitemap(), // sitemap-index.xml generate karega Search Console ke liye
  ],

  // ⚠️ IMPORTANT: 'static' mein Keystatic kaam nahi karta
  // 'hybrid' = blog pages build time par static rahenge lekin /keystatic route server se chalega
  output: 'hybrid',

  // Cloudflare adapter setup with image configuration and platformProxy enabled
  adapter: cloudflare({
    imageService: 'passthrough', // ✅ FIX: Sharp image error khatam karne ke liye
    platformProxy: {
      enabled: true, // ✅ FIX: Server side par Cloudflare variables (GITHUB_TOKEN) ko Keystatic tak pohnchane ke liye
    },
  }),

  vite: {
    ssr: {
      // ✅ FIX: node:path, node:fs/promises aur baqi saare worker bundle crash khatam karne ke liye
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
      tailwindcss(), // Dev-time basicAuth plugin yahan se bilkul saaf kar diya hai taake browser crash na ho
    ],
  },

  image: {
    domains: ['r2.cloudflarestorage.com'],
  },
});
