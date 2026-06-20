import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'cloud',
  },

  cloud: {
    project: 'fashionblog/fashion-blog',
  },

  singletons: {
    siteSettings: singleton({
      label: 'Site Settings',
      path: 'src/content/settings/site',
      schema: {
        siteName: fields.text({ label: 'Site Name', defaultValue: 'FASHION EDITORIAL' }),
        tagline: fields.text({ label: 'Tagline', defaultValue: 'CURATED STYLE & FASHION INSIGHTS' }),
        logoImage: fields.image({ label: 'Logo Image', directory: 'public/images/brand', publicPath: '/images/brand/' }),
        
        // 📋 DYNAMIC FOOTER CONFIGURATION (Matches image_779a80.png)
        footerDescription: fields.text({ 
          label: 'Footer Description', 
          defaultValue: 'Premium editorial content exploring contemporary fashion, timeless style, and cultural trends. Curated for the discerning reader.',
          multiline: true 
        }),
        
        // ⚡ LINKS SHOW/HIDE TOGGLES (Hatany/Laganay K Options)
        showHomeLink: fields.checkbox({ label: 'Show Home Link', defaultValue: true }),
        showAllArticlesLink: fields.checkbox({ label: 'Show All Articles Link', defaultValue: true }),
        showCategoriesLink: fields.checkbox({ label: 'Show Categories Link', defaultValue: true }),
        
        showAboutUsPage: fields.checkbox({ label: 'Show About Us Page', defaultValue: true }),
        showContactUsPage: fields.checkbox({ label: 'Show Contact Us Page', defaultValue: true }),
        showPrivacyPolicyPage: fields.checkbox({ label: 'Show Privacy Policy Page', defaultValue: true }),
        showDisclaimerPage: fields.checkbox({ label: 'Show Disclaimer Page', defaultValue: true }),
        showRSSFeed: fields.checkbox({ label: 'Show RSS Feed Link', defaultValue: true }),
        
        showInstagram: fields.checkbox({ label: 'Show Instagram Icon', defaultValue: true }),
        showTwitter: fields.checkbox({ label: 'Show Twitter Icon', defaultValue: true }),
        showPinterest: fields.checkbox({ label: 'Show Pinterest Icon', defaultValue: true }),

        // Purane AdSense aur tracking fields block (Symmetry preserved)
        adsenseEnabled: fields.checkbox({ label: 'AdSense Enabled', defaultValue: false }),
        adsenseClientId: fields.text({ label: 'AdSense Publisher ID', defaultValue: '' }),
        adSlotHeader: fields.text({ label: 'Ad Slot - Header', defaultValue: '' }),
        adSlotContent: fields.text({ label: 'Ad Slot - Content', defaultValue: '' }),
        adSlotSidebar: fields.text({ label: 'Ad Slot - Sidebar', defaultValue: '' }),
        adSlotFooter: fields.text({ label: 'Ad Slot - Footer', defaultValue: '' }),
        ga4Id: fields.text({ label: 'Google Analytics 4 ID', defaultValue: '' }),
        pinterestTag: fields.text({ label: 'Pinterest Tag ID', defaultValue: '' }),
        cloudflareAnalytics: fields.text({ label: 'Cloudflare Analytics Token', defaultValue: '' }),
        instagramUrl: fields.text({ label: 'Instagram URL', defaultValue: 'https://instagram.com' }),
        pinterestUrl: fields.text({ label: 'Pinterest URL', defaultValue: 'https://pinterest.com' }),
        twitterUrl: fields.text({ label: 'Twitter / X URL', defaultValue: 'https://twitter.com' }),
      },
    }),
  },

  collections: {
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description (SEO)', validation: { length: { min: 50, max: 160 } } }),
        publishedDate: fields.date({ label: 'Published Date' }),
        updatedDate: fields.date({ label: 'Updated Date', defaultValue: { kind: 'today' } }),
        author: fields.relationship({ label: 'Author', collection: 'authors' }),
        featuredImage: fields.image({ label: 'Featured Image', directory: 'public/images/posts', publicPath: '/images/posts/' }),
        categories: fields.multiRelationship({ label: 'Categories', collection: 'categories' }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags', itemLabel: (props) => props.value }),
        isDraft: fields.checkbox({ label: 'Draft', defaultValue: true }),
        isFeatured: fields.checkbox({ label: 'Featured Post', defaultValue: false }),
        content: fields.mdx({ label: 'Content', extension: 'mdx', options: { image: { directory: 'public/images/content', publicPath: '/images/content/' } } }),
      },
    }),

    // 📋 NEW PAGES COLLECTION: Manage Legal & Static pages content easily via Editor
    pages: collection({
      label: 'Legal & Static Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Page Title (e.g. Privacy Policy)' } }),
        description: fields.text({ label: 'SEO Description', validation: { length: { min: 30, max: 160 } } }),
        content: fields.mdx({ label: 'Page Content', extension: 'mdx' }),
      },
    }),

    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'src/content/authors/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        bio: fields.text({ label: 'Bio', multiline: true }),
        avatar: fields.image({ label: 'Avatar', directory: 'public/images/authors', publicPath: '/images/authors/' }),
        social: fields.object({
          twitter: fields.text({ label: 'Twitter', defaultValue: '' }),
          instagram: fields.text({ label: 'Instagram', defaultValue: '' }),
          pinterest: fields.text({ label: 'Pinterest', defaultValue: '' }),
        }),
      },
    }),

    categories: collection({
      label: 'Categories',
      slugField: 'name',
      path: 'src/content/categories/*',
      schema: {
        name: fields.slug({ name: { label: 'Category Name' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        parentCategory: fields.relationship({ label: 'Parent Category', collection: 'categories', validation: { isRequired: false } }),
        color: fields.text({ label: 'Color (hex)', defaultValue: '#000000' }),
      },
    }),
  },
});
