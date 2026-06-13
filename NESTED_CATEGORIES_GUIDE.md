# Nested Parent-Child Categories Architecture Guide

## Overview

Your fashion blog now supports a sophisticated nested category system with parent-child relationships. Main categories (e.g., "TRENDS") can contain sub-categories (e.g., "SPRING", "SUMMER", "AUTUMN", "WINTER"), creating a professional editorial hierarchy.

---

## 📋 Backend Schema (Keystatic)

### Categories Collection Schema

The `keystatic.config.ts` includes the following fields for the **categories** collection:

```typescript
categories: collection({
  label: 'Categories',
  slugField: 'name',
  path: 'src/content/categories/*',
  schema: {
    name: fields.slug({ name: { label: 'Name' } }),
    description: fields.text({ label: 'Description', multiline: true }),
    
    // NEW: Parent Category Relationship Field
    parentCategory: fields.relationship({
      label: 'Parent Category (Leave empty if this is a Main Category)',
      collection: 'categories',
      validation: { isRequired: false }, // Optional - not required
    }),
    
    color: fields.text({
      label: 'Color (hex)',
      defaultValue: '#000000',
    }),
  },
}),
```

### How It Works

1. **Main Categories** - No `parentCategory` set
   - These appear as top-level items in navigation
   - Example: "TRENDS", "STYLE", "COLLECTIONS"
   - Automatically get dropdown indicators if they have children

2. **Sub-Categories** - Have `parentCategory` set to a main category's slug
   - These appear nested under their parent category
   - Example: Under "TRENDS" → "SPRING", "SUMMER", "AUTUMN", "WINTER"
   - Only shown when hovering/expanding the parent

### Posts Collection Update

The `posts` collection's **categories** field already supports this hierarchy:

```typescript
categories: fields.multiRelationship({
  label: 'Categories',
  collection: 'categories', // References the full hierarchy
}),
```

Posts can be assigned to either parent categories or sub-categories (or both).

---

## 🔄 Backend Reader Functions

### New Helper Functions in `keystatic-reader.ts`

#### 1. `getCategoriesHierarchy()`
Returns categories organized by parent-child relationships.

```typescript
export async function getCategoriesHierarchy() {
  // Returns array of main categories with nested children
  // Example:
  // [
  //   {
  //     slug: 'trends',
  //     name: 'TRENDS',
  //     children: [
  //       { slug: 'trends-spring', name: 'Spring' },
  //       { slug: 'trends-summer', name: 'Summer' }
  //     ]
  //   },
  //   { slug: 'style', name: 'STYLE', children: [] }
  // ]
}
```

**Usage:** Perfect for rendering the navigation dropdown with nested items.

#### 2. `getCategoriesFlat()`
Returns all categories in a flat list with hierarchy information.

```typescript
export async function getCategoriesFlat() {
  // Returns flat array with parent-child info
  // Example:
  // [
  //   { slug: 'trends', name: 'TRENDS', isParent: true, level: 0 },
  //   { slug: 'trends-spring', name: 'Spring', isParent: false, level: 1, parentCategory: 'trends' }
  // ]
}
```

**Usage:** Useful for category filtering, breadcrumbs, or category-specific pages.

#### 3. `getAllCategories()` (Existing)
Returns flat list of all categories (unchanged - for backward compatibility).

---

## 🎨 Frontend Implementation

### Header Component (`src/components/Header.astro`)

The header now renders a sophisticated nested dropdown system:

```astro
import { getCategoriesHierarchy } from '../lib/keystatic-reader';

// Fetch hierarchical structure
const categoriesHierarchy = await getCategoriesHierarchy();

// Main categories appear as top-level nav items
// Categories with children show dropdown on hover
// Sub-categories appear nested in the dropdown
```

#### Desktop Navigation Structure

```
TRENDS ▼    STYLE ▼    COLLECTIONS
  ├─ Spring
  ├─ Summer
  ├─ Autumn
  └─ Winter
```

#### Hover Behavior

When user hovers over "TRENDS":

```
┌────────────────────┐
│ All Trends         │
├────────────────────┤
│ Spring             │
│ Summer             │
│ Autumn             │
│ Winter             │
└────────────────────┘
```

#### Mobile Menu Structure

```
HOME
EDITORIAL
ABOUT
CONTACT

CATEGORIES
├─ Trends
│  ├─ Spring
│  ├─ Summer
│  ├─ Autumn
│  └─ Winter
├─ Style
└─ Collections
```

---

## 📝 How to Create Categories in Keystatic

### 1. Create Main Categories (No Parent)

**In Keystatic Admin Panel (`/keystatic`):**

1. Click "Categories" in left sidebar
2. Click "Create" button
3. Fill in:
   - **Name:** TRENDS (becomes slug: `trends`)
   - **Description:** "Current fashion trends and seasonal styles"
   - **Parent Category:** (leave empty)
   - **Color:** #FF6B9D (or your brand color)
4. Save

Repeat for other main categories:
- STYLE
- COLLECTIONS
- OCCASIONS
- etc.

### 2. Create Sub-Categories (With Parent)

**In Keystatic Admin Panel:**

1. Click "Categories" in left sidebar
2. Click "Create" button
3. Fill in:
   - **Name:** Spring (becomes slug: `trends-spring`)
   - **Description:** "Spring fashion and trends"
   - **Parent Category:** Select "TRENDS" from dropdown
   - **Color:** #8BC34A (optional - can use for styling)
4. Save

Repeat for each sub-category:

**Under TRENDS:**
- Spring
- Summer
- Autumn
- Winter

**Under STYLE:**
- Classic
- Edgy
- Minimalist
- Maximalist

**Under COLLECTIONS:**
- Designer
- Sustainable
- Vintage
- Contemporary

---

## 🔗 Assigning Posts to Categories

When creating/editing posts in Keystatic:

1. Open the post
2. Find "Categories" field
3. You can select:
   - **Main categories only** - Post appears in "All Trends"
   - **Sub-categories only** - Post appears only in specific season
   - **Both parent and sub** - Post appears in parent AND specific sub-category

**Example:**
- Create post "Spring Fashion Guide"
- Assign to: `trends` AND `trends-spring`
- Result: Post shows in both "TRENDS" and "Spring" category pages

---

## 🔄 Category URLs & Routing

Categories are accessible via standard routes:

```
/category/trends              → All Trends posts
/category/trends-spring       → Spring posts only
/category/style               → All Style posts
/category/style-minimalist    → Minimalist posts
```

**Dynamic Rendering:**
The `[slug].astro` route dynamically fetches posts for any category (parent or sub):

```astro
// src/pages/category/[slug].astro
export async function getStaticPaths() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({
    params: { slug: cat.slug },
    props: { category: cat }
  }));
}
```

---

## 🎯 Frontend Rendering Logic

### Hierarchy Grouping Algorithm

```typescript
// Separate categories into two groups:
const mainCategories = categories.filter(cat => !cat.parentCategory);
const subCategories = categories.filter(cat => cat.parentCategory);

// Map sub-categories to their parents:
const hierarchy = mainCategories.map(main => ({
  ...main,
  children: subCategories.filter(
    sub => sub.parentCategory === main.slug
  )
}));
```

### Dropdown Rendering

**Desktop (CSS Hover):**
- Dropdowns show on `group-hover`
- Smooth 300ms opacity & translate animations
- Z-index layering prevents overlap

**Mobile (Accordion):**
- Parent categories show expand/collapse icon
- Tapping parent reveals sub-categories
- Nested indentation shows hierarchy

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────┐
│   Keystatic CMS (Admin Panel)      │
│  - Create Categories               │
│  - Set Parent Relationships        │
│  - Assign Posts                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   keystatic.config.ts              │
│  - Categories Schema               │
│  - parentCategory field            │
│  - Posts multiRelationship         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   keystatic-reader.ts              │
│  - getCategoriesHierarchy()        │
│  - getCategoriesFlat()             │
│  - getAllCategories()              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Header.astro                     │
│  - Renders nested dropdowns        │
│  - Shows parent-child structure    │
│  - Mobile & desktop layouts        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Frontend Navigation              │
│  - Hover dropdowns (desktop)       │
│  - Accordion menu (mobile)         │
│  - Category page links             │
└─────────────────────────────────────┘
```

---

## 🧪 Testing the System

### Test Scenario 1: Create Hierarchy

1. **Create main category:** "TRENDS" (no parent)
2. **Create sub-categories:** "SPRING", "SUMMER" (parent: TRENDS)
3. **In Header:** "TRENDS" should show dropdown arrow
4. **On hover:** Dropdown shows "All Trends", "SPRING", "SUMMER"

### Test Scenario 2: Create Posts

1. **Create post:** "Spring Fashion 2026"
2. **Assign categories:** both "TRENDS" and "TRENDS-SPRING"
3. **Check URLs:**
   - `/category/trends` - shows post
   - `/category/trends-spring` - shows post

### Test Scenario 3: Mobile Menu

1. Open on mobile
2. Tap "☰" menu button
3. See categories section with parents and children
4. Tap parent category link
5. Tap child category link
6. Both navigate correctly

---

## 🎨 Styling Customization

### Dropdown Styling (in Header.astro)

All dropdown styling uses Tailwind classes:

```astro
<div class="hidden absolute top-full left-0 mt-3 bg-white border border-gray-200 shadow-lg z-40 w-56 opacity-0 transition-all duration-300 translate-y-2 pointer-events-none group-hover:block group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
```

### Customize These Properties:

- **Width:** `w-56` → `w-64` (larger dropdown)
- **Colors:** `bg-white border-gray-200` → custom colors
- **Animation:** `duration-300` → slower/faster
- **Position:** `top-full left-0` → adjust offsets

---

## 📱 Responsive Behavior

### Desktop (md: 768px+)

- Categories display horizontally in header
- Hover reveals dropdowns
- Smooth CSS animations
- Multi-level dropdown visible

### Mobile (< 768px)

- Categories in collapsed menu
- Show parent categories in bold
- Indent child categories
- Tap to navigate

---

## 🔍 Advanced: Custom Filtering

### Get Posts for a Category (Any Level)

```typescript
// Posts for "TRENDS" category (includes SPRING, SUMMER, etc. if assigned)
const trendsPosts = await getPostsByCategory('trends');

// Posts for only "TRENDS-SPRING"
const springPosts = await getPostsByCategory('trends-spring');
```

### Get All Posts in Category + Sub-Categories

```typescript
async function getPostsInCategoryTree(categorySlug: string) {
  const allCategories = await getCategoriesFlat();
  
  // Get this category and all its children
  const category = allCategories.find(c => c.slug === categorySlug);
  const childCategories = allCategories.filter(
    c => c.parentCategory === categorySlug
  );
  
  // Fetch posts for all
  const categories = [category, ...childCategories];
  const allPosts = [];
  
  for (const cat of categories) {
    const posts = await getPostsByCategory(cat.slug);
    allPosts.push(...posts);
  }
  
  return allPosts;
}
```

---

## 📚 Example: Complete Setup

### Step 1: Create Categories in Keystatic

```
MAIN:
- Trends (slug: trends)
- Style (slug: style)
- Collections (slug: collections)

UNDER TRENDS:
- Spring (slug: trends-spring, parent: trends)
- Summer (slug: trends-summer, parent: trends)

UNDER STYLE:
- Classic (slug: style-classic, parent: style)
- Edgy (slug: style-edgy, parent: style)
```

### Step 2: Create Posts

```
Post 1: "Spring Fashion Guide"
- Categories: trends, trends-spring

Post 2: "Classic Wardrobe Essentials"
- Categories: style, style-classic

Post 3: "Current Trends"
- Categories: trends
```

### Step 3: Navigation Works

**Desktop Header:**
```
TRENDS ▼    STYLE ▼    COLLECTIONS
  Spring    Classic
  Summer    Edgy
```

**On /category/trends:** Shows Post 1 & 3  
**On /category/trends-spring:** Shows Post 1 only  
**On /category/style:** Shows Post 2  
**On /category/style-classic:** Shows Post 2 only  

---

## 🐛 Troubleshooting

### Issue: Dropdown not showing children

**Solution:**
1. Verify sub-category has `parentCategory` field set
2. Check that parent category slug matches exactly
3. Rebuild: `npm run build`
4. Clear Keystatic cache: Refresh browser

### Issue: Posts not appearing in sub-category

**Solution:**
1. Edit the post
2. Assign it to BOTH parent AND sub-category
3. Re-publish
4. Verify category URLs work

### Issue: Hierarchy function returning empty

**Solution:**
1. Check `keystatic.config.ts` has `parentCategory` field
2. Ensure `getCategoriesHierarchy()` is imported correctly
3. Run `npm run dev` and check console for errors

---

## 🎓 File Reference

| File | Purpose |
|------|---------|
| `keystatic.config.ts` | Defines parentCategory field in schema |
| `keystatic-reader.ts` | Provides getCategoriesHierarchy() function |
| `src/components/Header.astro` | Renders nested dropdowns |
| `src/pages/category/[slug].astro` | Category page route (unchanged) |

---

## ✅ Verification Checklist

- [ ] `parentCategory` field added to keystatic.config.ts
- [ ] `getCategoriesHierarchy()` function exists in keystatic-reader.ts
- [ ] Header.astro imports `getCategoriesHierarchy`
- [ ] Created at least one main category without parent
- [ ] Created at least one sub-category with parent
- [ ] Desktop dropdown shows nested items
- [ ] Mobile menu shows indented categories
- [ ] Category pages work for both parent and child
- [ ] Posts show in correct categories

---

## 📖 Next Steps

1. **Create Categories:** Use Keystatic admin panel
2. **Test Navigation:** Hover on desktop, tap on mobile
3. **Create Posts:** Assign to categories
4. **Verify URLs:** Test /category/[slug] routes
5. **Customize:** Update colors, styling, animations

Your nested category system is now ready for a sophisticated editorial experience! 🎉
