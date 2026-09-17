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
  trailingSlash: 'ignore',

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
    // ✅ FIX: the auto-generated _routes.json only ever lists "/keystatic/*",
    // which Cloudflare Pages does NOT match against the bare "/keystatic"
    // URL (no trailing slash). That's why the admin panel 404'd. Adding the
    // exact path here forces Cloudflare to also invoke the Function for it.
    routes: {
      extend: {
        // Keystatic injects these routes at build time. Explicitly route both
        // the bare admin URL and all admin/API paths through the SSR function
        // on Cloudflare Pages.
        include: [
          { pattern: '/keystatic' },
          { pattern: '/keystatic/*' },
          { pattern: '/api/keystatic' },
          { pattern: '/api/keystatic/*' },
        ],
      },
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
