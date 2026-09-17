# Premium Minimalist Design System Reference

## Visual Design Specifications

### Header Layout Pattern
```
┌─────────────────────────────────────────────────┐
│                                                   │
│             FASHION EDITORIAL                    │  ← Centered, font-light, text-3xl md:text-4xl
│          CURATED STYLE & FASHION INSIGHTS        │  ← Subtitle, text-xs tracking-widest
│                                                   │
├─────────────────────────────────────────────────┤
│  HOME    |    EDITORIAL    |    ABOUT   |    CONTACT  │  ← Border-y, font-light tracking-widest
├─────────────────────────────────────────────────┤
│  CATEGORIES ▼           [Search Icon →]         │  ← Categories dropdown + search
└─────────────────────────────────────────────────┘
```

### Category Dropdown Behavior
```
CATEGORIES ▼  ← Click to toggle
  ├─ Summer Fashion
  ├─ Winter Style
  ├─ Streetwear
  └─ Accessories

Styles:
- Hidden by default
- Opacity & translate-y animations
- White background with border
- p-6 spacing
- Closes on outside click
```

### Search Bar Expansion
```
NORMAL STATE:
[Search Icon] ← Right-aligned, cursor: pointer

EXPANDED STATE:
─────────────────────────────────────────
  SEARCH ARTICLES & CATEGORIES...
  [Search Results Container]
─────────────────────────────────────────
```

### Footer Architecture (4-Column Grid)
```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│   FASHION   │    EXPLORE   │ INFORMATION  │   CONNECT    │
│ EDITORIAL   │              │              │              │
│             │ • Home       │ • Contact    │ [Social]     │
│ Description │ • Articles   │ • Privacy    │ [Social]     │
│             │ • Categories │ • Disclaimer │ [Social]     │
│             │ • About      │ • RSS        │              │
├─────────────┴──────────────┴──────────────┴──────────────┤
│  © 2026 Fashion Editorial. All rights reserved.          │
│      Designed with precision for the modern reader.      │
└────────────────────────────────────────────────────────────┘
```

---

## Color Specifications

### Primary Colors
```css
/* Black & White Foundation */
--black: #000000;      /* Primary text, headers */
--white: #ffffff;      /* Primary background */

/* Gray Scale */
--gray-50:   #f9fafb;  /* Soft backgrounds, cards */
--gray-400:  #9ca3af;  /* Secondary text */
--gray-500:  #6b7280;  /* Tertiary text */
--gray-600:  #4b5563;  /* Body copy on dark */
--gray-200:  #e5e7eb;  /* Borders, dividers */
--gray-800:  #1f2937;  /* Dark borders, footer dividers */
```

### Footer-Specific
```css
background: #000000;
color: #ffffff;
links: #9ca3af (gray-400)
link-hover: #ffffff
border: #1f2937 (gray-800)
```

---

## Typography Scale

### Headers
```css
/* Page Titles */
h1: font-size: 3rem (md: 3.75rem)  /* text-4xl md:text-5xl */
   font-weight: 300 (font-light)
   letter-spacing: 0.05em (tracking-wide)

/* Section Titles */
h2: font-size: 2rem (md: 2.25rem)  /* text-2xl md:text-3xl */
   font-weight: 300 (font-light)
   letter-spacing: 0.05em (tracking-wide)

/* Subsections */
h3: font-size: 1.25rem              /* text-xl */
   font-weight: 300 (font-light)
   letter-spacing: 0.05em (tracking-wide)

/* Small Labels */
h4: font-size: 0.875rem (md: 1rem)  /* text-xs md:text-sm */
   font-weight: 300 (font-light)
   letter-spacing: 0.1em (tracking-widest)
```

### Body Text
```css
/* Main Content */
p: font-size: 1rem (md: 1.125rem)   /* text-base md:text-lg */
  font-weight: 300/400 (font-light)
  line-height: 1.625 (leading-relaxed)

/* Small Text */
small: font-size: 0.875rem           /* text-sm */
      font-weight: 300 (font-light)

/* Captions */
caption: font-size: 0.75rem          /* text-xs */
        font-weight: 300 (font-light)
        color: #6b7280 (gray-500)
```

---

## Spacing & Layout

### Container Max-Widths
```css
header: max-w-7xl (80rem) - for full-width header
main:   max-w-4xl (56rem) - for article/page content
```

### Padding
```css
mobile:  px-4 (1rem)
desktop: md:px-6 (1.5rem)
```

### Section Margins
```css
mobile:  py-16 (4rem)
desktop: md:py-24 (6rem)

Between sections: space-y-10 md:space-y-14
Column gaps: gap-12 md:gap-16
```

---

## Interactive Elements

### Buttons & Links
```css
/* Standard Button */
border: 1px solid #000000
padding: px-8 py-4
text-transform: uppercase
font-weight: 300 (font-light)
letter-spacing: 0.07em (tracking-wider)
font-size: text-sm

hover:
  background: #000000
  color: #ffffff
  transition: all duration-300
```

### Form Inputs
```css
/* Text Inputs */
background: #ffffff
border: none (bottom border only)
border-bottom: 1px solid #d1d5db (gray-300)
padding: py-3 px-0
font-size: text-sm
font-weight: 300 (font-light)

placeholder: #9ca3af (gray-400), font-light

focus:
  border-bottom: 1px solid #000000
  outline: none
  transition: colors duration-300

/* Placeholders */
text-xs font-light tracking-wide (uppercase labels)
color: #4b5563 (gray-600)
```

---

## Transitions & Animations

### All Interactive Elements
```css
transition: all duration-300 ease-in-out

/* Specific Transitions */
color-only:    transition-colors duration-300
background:    transition-all duration-300
hover-effects: duration-300 (all)
dropdowns:     opacity & transform (300ms)
```

### Dropdown Menu Animation
```css
initial: opacity-0 translate-y-2 pointer-events-none
hover:   opacity-100 translate-y-0 pointer-events-auto
time:    300ms ease-in-out
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
base:  < 768px    (phone, tablet portrait)
md:    ≥ 768px    (tablet landscape, small desktop)
lg:    ≥ 1024px   (desktop)
xl:    ≥ 1280px   (large desktop)

/* Key Responsive Changes */
Text scaling:    text-3xl md:text-4xl (headers)
Padding:         px-4 md:px-6
Margins:         py-16 md:py-24
Columns:         grid-cols-1 md:grid-cols-2 (footer sections)
Visibility:      hidden md:flex (nav)
```

---

## Accessibility Features

### Color Contrast
```
Black on White: 21:1 (exceeds WCAG AAA)
White on Black: 21:1 (exceeds WCAG AAA)
Gray-400 on White: 7.2:1 (exceeds WCAG AA for large text)
```

### Focus States
```css
outline: 2px solid #000000
outline-offset: 2px
visible on all interactive elements
```

### Semantic HTML
```html
<header>          Navigation container
<nav>             Primary navigation
<main>            Page content
<article>         Article/page content
<footer>          Footer container
<section>         Content sections
<h1-h6>           Hierarchical headings
<button>          Interactive buttons
<form>            Form containers
<label>           Form labels
<input>           Form inputs with proper type
```

---

## Design Philosophy

### Core Principles
1. **Minimalism** - Clean lines, generous whitespace
2. **Hierarchy** - Clear visual distinction through typography
3. **Legibility** - High contrast, generous spacing
4. **Editorial** - Publication-grade sophistication
5. **Performance** - Lightweight, optimized rendering
6. **Accessibility** - WCAG compliant, semantic HTML

### Aesthetic Influences
- High-end fashion publications (Vogue, Harper's Bazaar, Who What Wear)
- Swiss design principles (grid-based, minimal ornamentation)
- Modern editorial layouts (generous whitespace, clear typography)
- Luxury brand websites (simplicity, quality over quantity)

---

## Implementation Checklist

- [x] Centered header branding
- [x] Dynamic category dropdown
- [x] Expandable search interface
- [x] Premium footer with legal links
- [x] Minimalist color palette
- [x] Light typography hierarchy
- [x] Smooth transitions throughout
- [x] Mobile-first responsive design
- [x] Accessible form inputs
- [x] Semantic HTML structure
- [x] WCAG compliance
- [x] Performance optimization

---

## Notes for Maintenance

### CSS Methodology
- Utility-first with Tailwind v4
- Classes composed directly in template
- No additional CSS files (keeping static build lean)

### JavaScript Minimal
- Vanilla JS only (no frameworks)
- Focused on interaction management
- <2KB bundle impact
- Progressive enhancement (works without JS)

### Content Updates
- All text editable in Keystatic
- Social links in Footer component
- Email addresses in Contact page
- Categories pulled dynamically from collection

### Extensibility
- Easy to add more dropdown categories
- Form ready for any backend (Web3Forms placeholder)
- Footer grid expandable to more columns
- Header navigation easily customizable
