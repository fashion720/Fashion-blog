import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },

  // ══════════════════════════════════════════════════════
  // SINGLETON — Global site settings (Logo, Ads, Analytics, Social)
  // Admin Panel mein "Site Settings" ka naam se dikhega
  // ══════════════════════════════════════════════════════
  singletons: {
    siteSettings: singleton({
      label: '⚙️ Site Settings — Logo · Ads · Analytics · Social',
      path: 'src/content/settings/site',
      schema: {

        // ── LOGO & BRANDING ─────────────────────────────
        siteName: fields.text({
          label: '📝 Site Name (text logo)',
          defaultValue: 'FASHION EDITORIAL',
          description: 'Jab logo image upload nahi ki ho tab yeh text show hoga',
        }),
        tagline: fields.text({
          label: '✏️ Tagline (site name ke neeche)',
          defaultValue: 'CURATED STYLE & FASHION INSIGHTS',
        }),
        logoImage: fields.image({
          label: '🖼️ Logo Image (yeh upload karo to text logo replace ho jata hai)',
          description: 'PNG ya SVG upload karo. Empty rakho to sirf text dikhega.',
          directory: 'public/images/brand',
          publicPath: '/images/brand/',
        }),

        // ── GOOGLE ADSENSE ───────────────────────────────
        adsenseEnabled: fields.checkbox({
          label: '📢 Google AdSense ON karo',
          defaultValue: false,
          description: 'Tab ON karo jab AdSense account approve ho jaye',
        }),
        adsenseClientId: fields.text({
          label: '🔑 AdSense Publisher ID',
          defaultValue: '',
          description: 'Format: ca-pub-XXXXXXXXXXXXXXXXXX',
        }),
        adSlotHeader: fields.text({
          label: '📌 Ad Slot — Header (site ke upar horizontal)',
          defaultValue: '',
        }),
        adSlotContent: fields.text({
          label: '📌 Ad Slot — Content ke beech mein',
          defaultValue: '',
        }),
        adSlotSidebar: fields.text({
          label: '📌 Ad Slot — Sidebar rectangle',
          defaultValue: '',
        }),
        adSlotFooter: fields.text({
          label: '📌 Ad Slot — Footer',
          defaultValue: '',
        }),

        // ── ANALYTICS ────────────────────────────────────
        ga4Id: fields.text({
          label: '📊 Google Analytics 4 ID',
          defaultValue: '',
          description: 'Format: G-XXXXXXXXXX',
        }),
        pinterestTag: fields.text({
          label: '📌 Pinterest Tag ID',
          defaultValue: '',
        }),
        cloudflareAnalytics: fields.text({
          label: '☁️ Cloudflare Analytics Token',
          defaultValue: '',
        }),

        // ── SOCIAL LINKS ─────────────────────────────────
        instagramUrl: fields.text({
          label: '📸 Instagram URL',
          defaultValue: 'https://instagram.com',
        }),
        pinterestUrl: fields.text({
          label: '📌 Pinterest URL',
          defaultValue: 'https://pinterest.com',
        }),
        twitterUrl: fields.text({
          label: '🐦 Twitter / X URL',
          defaultValue: 'https://twitter.com',
        }),
      },
    }),
  },

  // ══════════════════════════════════════════════════════
  // COLLECTIONS
  // ══════════════════════════════════════════════════════
  collections: {
    posts: collection({
      label: '📝 Blog Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({
          label: 'Description (SEO)',
          validation: { length: { min: 50, max: 160 } },
        }),
        publishedDate: fields.date({ label: 'Published Date' }),
        updatedDate: fields.date({
          label: 'Updated Date',
          defaultValue: { kind: 'today' },
        }),
        author: fields.relationship({
          label: 'Author',
          collection: 'authors',
        }),
        featuredImage: fields.image({
          label: 'Featured Image',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        categories: fields.multiRelationship({
          label: 'Categories',
          collection: 'categories',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        isDraft: fields.checkbox({
          label: 'Draft (site se hide karo)',
          defaultValue: true,
        }),
        isFeatured: fields.checkbox({
          label: 'Featured Post (homepage par dikhao)',
          defaultValue: false,
        }),
        content: fields.mdx({
          label: 'Content',
          extension: 'mdx',
          options: {
            image: {
              directory: 'public/images/content',
              publicPath: '/images/content/',
            },
          },
        }),
      },
    }),

    authors: collection({
      label: '👤 Authors',
      slugField: 'name',
      path: 'src/content/authors/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        bio: fields.text({ label: 'Bio', multiline: true }),
        avatar: fields.image({
          label: 'Avatar',
          directory: 'public/images/authors',
          publicPath: '/images/authors/',
        }),
        social: fields.object({
          twitter: fields.text({ label: 'Twitter', defaultValue: '' }),
          instagram: fields.text({ label: 'Instagram', defaultValue: '' }),
          pinterest: fields.text({ label: 'Pinterest', defaultValue: '' }),
        }),
      },
    }),

    categories: collection({
      label: '🗂️ Categories',
      slugField: 'name',
      path: 'src/content/categories/*',
      schema: {
        name: fields.slug({ name: { label: 'Category Name' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        parentCategory: fields.relationship({
          label: 'Parent Category (khali rakho agar yeh main category hai)',
          collection: 'categories',
          validation: { isRequired: false },
        }),
        color: fields.text({
          label: 'Color (hex)',
          defaultValue: '#000000',
        }),
      },
    }),
  },
});