// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://example.com', // ← apna domain yahan daalo

  integrations: [
    react(),
    keystatic(), // HAMESHA on — sirf isi se /keystatic panel kaam karta hai
  ],

  // ⚠️ IMPORTANT: 'static' mein Keystatic kaam nahi karta
  // 'hybrid' = blog pages build time par static rahenge
  //            lekin /keystatic route server se chalega
  output: 'hybrid',

  adapter: node({
    mode: 'standalone',
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    domains: ['r2.cloudflarestorage.com'],
  },
});
