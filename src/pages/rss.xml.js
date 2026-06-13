import rss from '@astrojs/rss';
import { getAllPosts } from '../lib/keystatic-reader';

export async function GET(context) {
  const posts = await getAllPosts();

  return rss({
    title: 'Fashion Blog',
    description: 'Outfit inspiration, style tips, and trending fashion ideas.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.entry.title,
      description: post.entry.description,
      pubDate: new Date(post.entry.publishedDate),
      link: `/posts/${post.slug}/`,
    })),
  });
}
