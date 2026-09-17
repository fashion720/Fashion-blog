/**
 * Category Hierarchy Utilities
 * Handles parent-child category relationships and nested structures
 */

export interface CategoryItem {
  slug: string;
  entry: {
    name: string;
    description: string;
    parentCategory?: string;
    color: string;
  };
}

export interface MainCategory {
  slug: string;
  name: string;
  description: string;
  color: string;
  children: SubCategory[];
}

export interface SubCategory {
  slug: string;
  name: string;
  description: string;
  color: string;
  parentSlug: string;
}

/**
 * Build a hierarchical category structure from flat category list
 * @param categories - All categories from Keystatic
 * @returns Object with mainCategories and allCategoriesMap
 */
export function buildCategoryHierarchy(categories: CategoryItem[]) {
  const mainCategories: MainCategory[] = [];
  const categoryMap = new Map<string, CategoryItem>();
  const childrenMap = new Map<string, SubCategory[]>();

  // Create lookup map for all categories
  categories.forEach((cat) => {
    categoryMap.set(cat.slug, cat);
  });

  // Build hierarchy: separate main and sub categories
  categories.forEach((cat) => {
    const parentId = cat.entry.parentCategory;

    if (!parentId) {
      // This is a main category
      mainCategories.push({
        slug: cat.slug,
        name: cat.entry.name,
        description: cat.entry.description,
        color: cat.entry.color,
        children: [],
      });
    }
  });

  // Attach children to their parents
  categories.forEach((cat) => {
    const parentId = cat.entry.parentCategory;

    if (parentId) {
      // This is a sub-category
      const parentCategory = mainCategories.find((mc) => mc.slug === parentId);

      if (parentCategory) {
        parentCategory.children.push({
          slug: cat.slug,
          name: cat.entry.name,
          description: cat.entry.description,
          color: cat.entry.color,
          parentSlug: parentId,
        });
      }

      // Also track in childrenMap for quick lookup
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }
      childrenMap.get(parentId)!.push({
        slug: cat.slug,
        name: cat.entry.name,
        description: cat.entry.description,
        color: cat.entry.color,
        parentSlug: parentId,
      });
    }
  });

  return {
    mainCategories,
    categoryMap,
    childrenMap,
  };
}

/**
 * Get all subcategories for a specific parent category
 * @param parentSlug - The slug of the parent category
 * @param categories - All categories from Keystatic
 * @returns Array of subcategories
 */
export function getSubcategoriesByParent(
  parentSlug: string,
  categories: CategoryItem[]
): SubCategory[] {
  return categories
    .filter((cat) => cat.entry.parentCategory === parentSlug)
    .map((cat) => ({
      slug: cat.slug,
      name: cat.entry.name,
      description: cat.entry.description,
      color: cat.entry.color,
      parentSlug: parentSlug,
    }));
}

/**
 * Check if a category is a main category (no parent)
 * @param category - Category item
 * @returns true if it's a main category
 */
export function isMainCategory(category: CategoryItem): boolean {
  return !category.entry.parentCategory;
}

/**
 * Check if a category has children
 * @param categorySlug - The slug of the category to check
 * @param categories - All categories from Keystatic
 * @returns true if it has any children
 */
export function hasChildren(
  categorySlug: string,
  categories: CategoryItem[]
): boolean {
  return categories.some((cat) => cat.entry.parentCategory === categorySlug);
}

/**
 * Get breadcrumb trail for a category (including parents)
 * @param categorySlug - The slug of the category
 * @param categories - All categories from Keystatic
 * @returns Array of categories from root to target
 */
export function getCategoryBreadcrumb(
  categorySlug: string,
  categories: CategoryItem[]
): CategoryItem[] {
  const breadcrumb: CategoryItem[] = [];
  let currentSlug: string | undefined = categorySlug;
  const visited = new Set<string>();

  const categoryMap = new Map<string, CategoryItem>();
  categories.forEach((cat) => {
    categoryMap.set(cat.slug, cat);
  });

  while (currentSlug && !visited.has(currentSlug)) {
    visited.add(currentSlug);
    const category = categoryMap.get(currentSlug);

    if (category) {
      breadcrumb.unshift(category);
      currentSlug = category.entry.parentCategory;
    } else {
      break;
    }
  }

  return breadcrumb;
}

/**
 * Flatten category hierarchy into a single array with nesting info
 * Useful for rendering with indentation or tree structure
 */
export function flattenCategoryHierarchy(categories: CategoryItem[]) {
  interface FlattenedCategory extends SubCategory {
    level: number;
    isMainCategory: boolean;
    hasChildren: boolean;
  }

  const result: FlattenedCategory[] = [];
  const processedSlugs = new Set<string>();

  const processCategory = (categorySlug: string, level: number = 0) => {
    if (processedSlugs.has(categorySlug)) return;
    processedSlugs.add(categorySlug);

    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) return;

    const children = getSubcategoriesByParent(categorySlug, categories);

    result.push({
      slug: categorySlug,
      name: category.entry.name,
      description: category.entry.description,
      color: category.entry.color,
      parentSlug: category.entry.parentCategory || '',
      level,
      isMainCategory: isMainCategory(category),
      hasChildren: children.length > 0,
    });

    // Process children recursively
    children.forEach((child) => {
      processCategory(child.slug, level + 1);
    });
  };

  // Start with main categories
  categories
    .filter((cat) => isMainCategory(cat))
    .forEach((cat) => {
      processCategory(cat.slug, 0);
    });

  return result;
}
