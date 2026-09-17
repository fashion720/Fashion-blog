# Setup & Configuration Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.

### 3. Access Keystatic CMS
```
http://localhost:3000/keystatic
```
(Only available during `npm run dev`, not in production builds)

---

## Configuration Tasks

### A. Contact Form Setup (Required)

The contact form uses **Web3Forms**, a free service for static site form handling.

**Steps:**
1. Go to https://web3forms.com
2. Sign up for free account
3. Create a new form project
4. Copy your **Access Key**
5. Update `/src/pages/contact.astro`:
   ```astro
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```
   Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your actual key

**Testing:**
- Fill out the contact form locally
- Submit and verify email delivery

---

### B. Social Media Links

#### Header Social Links
Update in `/src/components/Header.astro`:
```javascript
// Not visible in header by default (optional to add)
```

#### Footer Social Links
Update in `/src/components/Footer.astro`:
```html
<a href="https://instagram.com/yourhandle" ...>
<a href="https://twitter.com/yourhandle" ...>
<a href="https://pinterest.com/yourprofile" ...>
```

---

### C. Email Addresses

Update these throughout the site:

**In `/src/pages/contact.astro`:**
```
GENERAL INQUIRIES: hello@fashioneditorial.com
COLLABORATIONS: partnerships@fashioneditorial.com
PRESS & MEDIA: press@fashioneditorial.com
LEGAL & PRIVACY: legal@fashioneditorial.com
```

**In `/src/pages/privacy-policy.astro`:**
```
privacy@fashioneditorial.com
```

**In `/src/pages/disclaimer.astro`:**
```
legal@fashioneditorial.com
```

**In `/src/pages/about.astro`:**
```
Keep existing contact email or update to above
```

---

### D. Site Metadata

Update in `/src/layouts/Layout.astro`:
```javascript
const siteName = 'Fashion Editorial';  // Update if needed
```

Update in `astro.config.mjs`:
```javascript
site: 'https://example.com',  // Replace with your domain
```

Update in `/astro.config.mjs` image config:
```javascript
domains: ['r2.cloudflarestorage.com'],  // Add your CDN if using
```

---

### E. Favicon & OG Image

**Favicon:**
- Replace `/public/favicon.svg` with your logo
- Ensure it's properly sized (1024x1024px recommended)

**Open Graph Image:**
- Create `/public/images/og/default.jpg` (1200x630px)
- Used for social media link previews
- Ensure aspect ratio is 1.2:1 (OG standard)

---

### F. Search Feature (Optional Enhancement)

The search bar is currently ready for integration with:

**Option 1: Algolia**
```javascript
// Add search index endpoint
// Implement Algolia client-side search
```

**Option 2: Meilisearch**
```javascript
// Self-hosted or cloud search
// Similar client-side implementation
```

**Option 3: Local Search Index**
```javascript
// Generate JSON index during build
// Fetch and search client-side
```

For now, search shows placeholder message. Update in `/src/components/Header.astro` the `searchInput` event listener to implement your chosen solution.

---

### G. Analytics Setup

Update in `/src/components/Analytics.astro`:
```html
<!-- Add your Google Analytics ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

### H. Category Management

Categories are managed through Keystatic CMS:

1. During dev: `npm run dev` → `/keystatic`
2. Create categories under "Categories" collection
3. Each category can have:
   - Name (slug field)
   - Description
   - Color (hex code - used optionally in future upgrades)

Categories automatically populate:
- Header category dropdown
- Footer popular topics
- Category pages

---

### I. Keystatic Configuration (Production)

For production deployment to GitHub:

1. Update `/keystatic.config.ts`:
```typescript
storage: {
  kind: 'github',
  repo: { 
    owner: 'your-github-username', 
    name: 'your-repo-name' 
  },
}
```

2. Connect to Keystatic Cloud (free tier):
   - Go to https://keystatic.cloud
   - Sign in with GitHub
   - Authorize repo access

3. Set GitHub secrets in your repo:
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`

---

## Building for Production

### Build Command
```bash
npm run build
```

This generates static files in `/dist/` directory.

### Build Output
```
dist/
├── index.html
├── about/
│   └── index.html
├── contact/
│   └── index.html
├── privacy-policy/
│   └── index.html
├── disclaimer/
│   └── index.html
├── posts/
│   ├── index.html
│   └── [slug]/
│       └── index.html
└── _astro/
    └── [assets]
```

### Deployment Options

**Cloudflare Pages (Recommended - Free)**
```bash
# Connect via GitHub
# Auto-deploys on push to main branch
# Zero configuration needed
```

**Vercel**
```bash
# Connect GitHub repo
# Auto-deploys static site
# Add domain in Vercel dashboard
```

**Netlify**
```bash
# Connect GitHub repo
# Configure build command: npm run build
# Publish directory: dist
```

**Static Hosting (any provider)**
```bash
# Upload contents of /dist/ to your web server
# Ensure .html files are served with proper MIME type
```

---

## Testing Checklist

Before going live, verify:

- [ ] Contact form submits successfully
- [ ] Social media links open in new tabs
- [ ] Email addresses are correct and clickable
- [ ] All pages load without errors
- [ ] Responsive design on mobile (< 768px)
- [ ] Responsive design on tablet (768-1024px)
- [ ] Responsive design on desktop (> 1024px)
- [ ] Category dropdown opens/closes smoothly
- [ ] Search icon toggles search bar
- [ ] Mobile menu opens/closes on small screens
- [ ] All navigation links work
- [ ] Footer links all functional
- [ ] Privacy Policy fully readable
- [ ] Disclaimer fully readable
- [ ] About page displays correctly
- [ ] Favicon appears in browser tab
- [ ] OG image preview works (share on social)
- [ ] CSS styling loads completely
- [ ] No console JavaScript errors
- [ ] Load time is acceptable (< 3s)

---

## Development Notes

### File Locations Quick Reference
```
src/
├── components/
│   ├── Header.astro       ← Navigation, search, dropdown
│   ├── Footer.astro       ← Footer with legal links
│   ├── Analytics.astro    ← GA tracking (update ID)
│   └── [other components] ← Keep unchanged
├── pages/
│   ├── about.astro        ← About page
│   ├── contact.astro      ← Contact form
│   ├── privacy-policy.astro ← Privacy policy
│   ├── disclaimer.astro   ← Disclaimer/affiliate
│   └── [other pages]      ← Keep unchanged
├── layouts/
│   └── Layout.astro       ← Main wrapper (update siteName if needed)
├── styles/
│   └── global.css         ← Global Tailwind imports
└── lib/
    └── keystatic-reader.ts ← Keep unchanged
```

### Code Style
- Use Tailwind utility classes in templates
- Use semantic HTML elements
- Keep components focused and single-purpose
- Write vanilla JavaScript (no frameworks) for interactivity
- Use font-light (weight-300) for body, medium weights for emphasis

### Performance Tips
- Keep images optimized (use WebP where possible)
- Leverage Astro's automatic code splitting
- Use `loading="lazy"` on below-fold images
- Keep component JavaScript minimal
- Test with Lighthouse in DevTools

---

## Troubleshooting

### Build Fails
**Issue:** Build command fails with errors
**Solution:** 
```bash
# Clear cache and reinstall
rm -r node_modules dist
npm install
npm run build
```

### Search Not Working
**Issue:** Search bar shows placeholder only
**Solution:** Implement search backend (Algolia/Meilisearch) per instructions in Section F

### Contact Form Not Sending
**Issue:** Form submission fails silently
**Solution:**
1. Verify Web3Forms access key is correct
2. Check browser console for errors
3. Ensure email in contact form is valid

### Keystatic Not Connecting
**Issue:** Can't access `/keystatic` admin panel
**Solution:**
1. Verify `npm run dev` is running (not production build)
2. Check browser console for CORS errors
3. Ensure JavaScript is enabled
4. Try clearing browser cache

### Style Issues on Deployment
**Issue:** Styles look different on live site
**Solution:**
1. Ensure Tailwind CSS is built correctly: `npm run build`
2. Check that CSS file is properly loaded (DevTools Network tab)
3. Clear browser cache and hard refresh
4. Verify production environment isn't stripping styles

---

## Support & Resources

### Official Documentation
- **Astro:** https://docs.astro.build
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Keystatic:** https://keystatic.com/docs
- **Web3Forms:** https://web3forms.com/docs

### Community
- Astro Discord: https://astro.build/chat
- Tailwind Discord: https://tailwindcss.com/discord
- Stack Overflow: Search [astro] or [tailwindcss] tags

---

## Next Steps After Setup

1. ✅ Complete setup tasks (A-H)
2. ✅ Test all forms and links locally
3. ✅ Run `npm run build` and verify no errors
4. ✅ Deploy to hosting platform
5. ✅ Test live site thoroughly
6. ✅ Set up domain and SSL (automatic on most platforms)
7. ✅ Monitor with analytics
8. ✅ Share and promote content

---

## Maintenance Tasks

### Monthly
- Review contact form submissions
- Check for broken links
- Monitor analytics

### Quarterly
- Update content and styling if needed
- Backup content
- Review search analytics

### Annually
- Update dependencies: `npm update`
- Audit for security vulnerabilities: `npm audit`
- Review performance with Lighthouse
- Update privacy policy if needed

---

## Version Info

- **Node.js:** v18+ recommended
- **npm:** v9+
- **Astro:** ^4.16.0
- **Tailwind:** ^4.0.0
- **React:** ^18.3.1 (for Keystatic admin UI)

Verify your versions:
```bash
node --version
npm --version
```
