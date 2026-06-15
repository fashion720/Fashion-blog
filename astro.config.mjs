// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import basicAuth from 'basic-auth';

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

  // Cloudflare adapter setup with image configuration
  adapter: cloudflare({
    imageService: 'passthrough', // ✅ FIX: Sharp image error khatam karne ke liye
  }),

  vite: {
    ssr: {
      // ✅ FIX: node:path worker bundle crash khatam karne ke liye
      external: ['node:path', 'node:fs', 'node:crypto'],
    },
    plugins: [
      tailwindcss(),
      // Dev-time Basic Auth middleware for /keystatic
      {
        name: 'vite-plugin-keystatic-basic-auth',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            try {
              const url = req.url || '';
              if (!url.startsWith('/keystatic')) return next();

              const user = process.env.ADMIN_USER;
              const pass = process.env.ADMIN_PASS;
              if (!user || !pass) return next(); // no creds set => allow

              const auth = basicAuth(req) || {};
              if (auth.name === user && auth.pass === pass) return next();

              res.statusCode = 401;
              res.setHeader('WWW-Authenticate', 'Basic realm="Keystatic Admin"');
              res.end('Unauthorized');
            } catch (e) {
              next(e);
            }
          });
        },
      },
    ],
  },

  image: {
    domains: ['r2.cloudflarestorage.com'],
  },
});
