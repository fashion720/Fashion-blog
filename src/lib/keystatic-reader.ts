import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

// ─── POSTS ───────────────────────────────────────────────────────────────────

export async function getAllPosts() {
  const posts = await reader.collections.posts.all();
  return posts
    .filter((post) => !post.entry.isDraft)
    .sort(
      (a, b) =>
        new Date(b.entry.publishedDate).getTime() -
        new Date(a.entry.publishedDate).getTime()
    );
}

export async function getFeaturedPosts(limit = 3) {
  const posts = await getAllPosts();
  const featured = posts.filter((post) => post.entry.isFeatured);
  return (featured.length > 0 ? featured : posts).slice(0, limit);
}

export async function getPostBySlug(slug: string) {
  const post = await reader.collections.posts.read(slug);
  if (!post || post.isDraft) return null;
  return { slug, entry: post };
}

// ─── PAGES (STATIC & LEGAL) ──────────────────────────────────────────────────
// ⚡ FIX: Added the missing function that was crashing Footer and [slug].astro

export async function getAllPages() {
  try {
    const pages = await reader.collections.pages.all();
    return pages || [];
  } catch (error) {
    console.error("Error fetching pages from Keystatic:", error);
    return [];
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const page = await reader.collections.pages.read(slug);
    if (!page) return null;
    return { slug, entry: page };
  } catch {
    return null;
  }
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export async function getAllCategories() {
  return reader.collections.categories.all();
}

export async function getPostsByCategory(categorySlug: string) {
  const posts = await getAllPosts();
  return posts.filter((post) => post.entry.categories?.includes(categorySlug));
}

export async function getCategoriesHierarchy() {
  const allCategories = await getAllCategories();

  const mainCategories: typeof allCategories = [];
  const subCategories: typeof allCategories = [];

  allCategories.forEach((category) => {
    if (!category.entry.parentCategory) {
      mainCategories.push(category);
    } else {
      subCategories.push(category);
    }
  });

  return mainCategories.map((mainCat) => {
    const children = subCategories.filter(
      (sub) => sub.entry.parentCategory === mainCat.slug
    );
    return {
      slug: mainCat.slug,
      name: mainCat.entry.name,
      description: mainCat.entry.description,
      color: mainCat.entry.color,
      children: children.map((child) => ({
        slug: child.slug,
        name: child.entry.name,
        description: child.entry.description,
        color: child.entry.color,
      })),
    };
  });
}

export async function getCategoriesFlat() {
  const allCategories = await getAllCategories();
  return allCategories.map((category) => ({
    slug: category.slug,
    name: category.entry.name,
    description: category.entry.description,
    parentCategory: category.entry.parentCategory,
    color: category.entry.color,
    isParent: !category.entry.parentCategory,
    level: category.entry.parentCategory ? 1 : 0,
  }));
}

// ─── AUTHORS ─────────────────────────────────────────────────────────────────

export async function getAllAuthors() {
  return reader.collections.authors.all();
}

export async function getAuthorBySlug(slug: string) {
  return reader.collections.authors.read(slug);
}

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────

export async function getSiteSettings() {
  try {
    const s = await reader.singletons.siteSettings.read();
    if (!s) return defaultSettings();

    return {
      siteName:             s.siteName             || 'FASHION EDITORIAL',
      tagline:              s.tagline              || 'CURATED STYLE & FASHION INSIGHTS',
      logoImage:            s.logoImage            ? `/images/brand/${s.logoImage}` : '',
      
      // ⚡ Added mapping for the new dynamic footer description field
      footerDescription:    s.footerDescription    || '', 
      
      adsenseEnabled:       s.adsenseEnabled       ?? false,
      adsenseClientId:      s.adsenseClientId      || '',
      adSlotHeader:         s.adSlotHeader         || '',
      adSlotContent:        s.adSlotContent        || '',
      adSlotSidebar:        s.adSlotSidebar        || '',
      adSlotFooter:         s.adSlotFooter         || '',
      ga4Id:                s.ga4Id                || '',
      pinterestTag:         s.pinterestTag         || '',
      cloudflareAnalytics:  s.cloudflareAnalytics  || '',
      instagramUrl:         s.instagramUrl         || 'https://instagram.com',
      pinterestUrl:         s.pinterestUrl         || 'https://pinterest.com',
      twitterUrl:           s.twitterUrl           || 'https://twitter.com',
    };
  } catch {
    return defaultSettings();
  }
}

function defaultSettings() {
  return {
    siteName:             'FASHION EDITORIAL',
    tagline:              'CURATED STYLE & FASHION INSIGHTS',
    logoImage:            '',
    footerDescription:    'Premium editorial content exploring contemporary fashion, timeless style, and cultural trends. Curated for the discerning reader.',
    adsenseEnabled:       false,
    adsenseClientId:      '',
    adSlotHeader:         '',
    adSlotContent:        '',
    adSlotSidebar:         '',
    adSlotFooter:         '',
    ga4Id:                '',
    pinterestTag:         '',
    cloudflareAnalytics:  '',
    instagramUrl:         'https://instagram.com',
    pinterestUrl:         'https://pinterest.com',
    twitterUrl:           'https://twitter.com',
  };
}
