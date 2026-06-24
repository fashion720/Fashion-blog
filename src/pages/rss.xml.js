import rss from '@astrojs/rss';
import { getAllPosts, getSiteSettings } from '../lib/keystatic-reader';

// 👑 AUTOMATIC TEXT EXTRACTOR FOR RSS FEED ITEMS
function getPostDescription(rawContent, length = 140) {
  if (!rawContent) return "Explore contemporary style and curated fashion insights inside this editorial.";
  
  const cleanText = rawContent
    .replace(/[#*_`~]/g, '') // Remove formatting characters
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text, remove URL
    .replace(/^[-\s]*\n/gm, '') // Remove linebreaks
    .trim();

  return cleanText.length > length ? `${cleanText.substring(0, length)}...` : cleanText;
}

export async function GET(context) {
  const settings = await getSiteSettings();
  const posts = await getAllPosts();

  // Asynchronously resolve descriptions for all rss feed items
  const rssItems = await Promise.all(
    posts.map(async (post) => {
      const rawContent = await post.entry.content();
      const dynamicDescription = getPostDescription(rawContent, 150);

      return {
        title: post.entry.title,
        pubDate: new Date(post.entry.publishedDate),
        description: dynamicDescription, // ⚡ FIX: Now passes the auto-generated description overview string
        link: `/posts/${post.slug}/`,
      };
    })
  );

  return rss({
    title: settings.siteName || 'Fashion Editorial',
    description: settings.tagline || 'Curated Style & Fashion Insights',
    site: context.site || 'https://fashioneditorial.pages.dev',
    items: rssItems,
  });
}
