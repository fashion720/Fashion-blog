import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

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

export async function getAllCategories() {
  return reader.collections.categories.all();
}

export async function getAllAuthors() {
  return reader.collections.authors.all();
}

export async function getAuthorBySlug(slug: string) {
  return reader.collections.authors.read(slug);
}

export async function getPostsByCategory(categorySlug: string) {
  const posts = await getAllPosts();
  return posts.filter((post) =>
    post.entry.categories?.includes(categorySlug)
  );
}

/**
 * Build hierarchical category structure
 * Groups categories into parent-child relationships
 */
export async function getCategoriesHierarchy() {
  const allCategories = await getAllCategories();
  
  // Separate main categories (no parent) and sub-categories (has parent)
  const mainCategories: typeof allCategories = [];
  const subCategories: typeof allCategories = [];
  
  allCategories.forEach((category) => {
    if (!category.entry.parentCategory) {
      mainCategories.push(category);
    } else {
      subCategories.push(category);
    }
  });
  
  // Build hierarchy map with properly extracted fields
  const hierarchy = mainCategories.map((mainCat) => {
    const childrenItems = subCategories.filter(
      (subCat) => subCat.entry.parentCategory === mainCat.slug
    );
    
    return {
      slug: mainCat.slug,
      name: mainCat.entry.name,
      description: mainCat.entry.description,
      color: mainCat.entry.color,
      children: childrenItems.map((child) => ({
        slug: child.slug,
        name: child.entry.name,
        description: child.entry.description,
        color: child.entry.color,
      })),
    };
  });
  
  return hierarchy;
}

/**
 * Get all categories including parents and children (flat list with depth info)
 */
export async function getCategoriesFlat() {
  const allCategories = await getAllCategories();
  
  return allCategories.map((category) => ({
    slug: category.slug,
    name: category.entry.name,
    description: category.entry.description,
    parentCategory: category.entry.parentCategory,
    color: category.entry.color,
    isParent: !category.entry.parentCategory,
    level: category.entry.parentCategory ? 1 : 0, // 0 = main, 1 = sub
  }));
}
