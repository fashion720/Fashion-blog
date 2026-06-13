# Quick Start - 5 Minutes to Launch

## 1. Install & Run (1 min)
```bash
npm install
npm run dev
```
Open http://localhost:3000

## 2. Essential Configuration (3 min)

### Contact Form Setup
1. Go to https://web3forms.com → Sign up (free)
2. Get your Access Key
3. In `src/pages/contact.astro`, find line with:
   ```astro
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```
4. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your key

### Update Email Addresses (Global Find & Replace)
Search and replace in your editor:
- `hello@fashioneditorial.com` → your email
- `partnerships@fashioneditorial.com` → partnerships email
- `press@fashioneditorial.com` → press email
- `legal@fashioneditorial.com` → legal email

### Update Social Links
In `src/components/Footer.astro`, update:
```html
href="https://instagram.com/yourhandle"
href="https://twitter.com/yourhandle"
href="https://pinterest.com/yourprofile"
```

## 3. Site Configuration (1 min)

### In `astro.config.mjs`
```javascript
site: 'https://yourdomain.com',  // Update to your domain
```

### Images
- Place your logo at: `/public/favicon.svg`
- Place OG image at: `/public/images/og/default.jpg`

## 4. Build & Deploy (depends on host)

### Build
```bash
npm run build
```

### Deploy (Choose one)

**Cloudflare Pages (Recommended)**
1. Connect GitHub repo in Cloudflare Pages dashboard
2. Auto-deploys on push

**Vercel**
1. Connect GitHub repo
2. Auto-deploys on push

**Netlify**
1. Connect GitHub repo
2. Set build: `npm run build`
3. Publish folder: `dist`

## Files Changed Summary

**Updated Components:**
- ✅ `src/components/Header.astro` - Centered branding, dropdown, search
- ✅ `src/components/Footer.astro` - Premium footer with legal links

**Updated Pages:**
- ✅ `src/pages/about.astro` - Premium design
- ✅ `src/pages/contact.astro` - Full contact suite with form

**New Pages:**
- ✅ `src/pages/privacy-policy.astro` - Full privacy policy
- ✅ `src/pages/disclaimer.astro` - Affiliate/ad disclosure

## Key Features

✨ **Premium Minimalist Design**
- Centered brand header
- Elegant typography (light weights)
- High-contrast monochromatic colors
- Smooth 300ms transitions

🎯 **Advanced Navigation**
- Dynamic category dropdown
- Expandable search bar
- Mobile-friendly menu
- Clear call-to-action buttons

⚖️ **Legal Compliance**
- Privacy Policy (GDPR & CCPA)
- Affiliate Disclaimer
- Ad network disclosure
- Professional contact channels

📱 **Responsive Design**
- Mobile-first approach
- Works on all devices
- Tablet optimized
- Desktop elegant

## Testing Checklist

- [ ] Contact form submits successfully
- [ ] Category dropdown opens/closes
- [ ] Search icon toggles search bar
- [ ] Mobile menu works on small screens
- [ ] All links work (header, footer, pages)
- [ ] Social media links open in new tabs
- [ ] Pages look good on mobile (< 768px)
- [ ] No console errors

## Common Customizations

### Add New Navigation Item
In `src/components/Header.astro`:
```javascript
const primaryNavItems = [
  // ... existing items
  { label: 'NEW PAGE', href: '/new-page', lowercase: false },
];
```

### Change Site Title
In Header and Footer components, search for "FASHION EDITORIAL" and replace.

### Modify Footer Links
In `src/components/Footer.astro`, update the link URLs in the grid sections.

### Add More Contact Categories
In `src/pages/contact.astro`, add new email sections in the left column and new `<option>` values in the subject dropdown.

## Documentation Files

For more details, see:
- 📖 `SETUP_GUIDE.md` - Full configuration guide
- 🎨 `DESIGN_REFERENCE.md` - Design system specs
- 📋 `REFACTOR_SUMMARY.md` - Technical overview
- ✅ `IMPLEMENTATION_COMPLETE.md` - Completion checklist

## Support

**Issues?** See `SETUP_GUIDE.md` Troubleshooting section.

**Need documentation?** Check official links:
- Astro: https://docs.astro.build
- Tailwind: https://tailwindcss.com/docs
- Web3Forms: https://web3forms.com/docs

## You're Ready! 🚀

Your premium fashion blog is ready to launch. Follow the 4 steps above and you'll be live in minutes.

Next: Run `npm run dev` and start testing!
