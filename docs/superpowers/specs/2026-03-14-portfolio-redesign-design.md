# Portfolio Redesign + Blog — Design Spec

**Date**: 2026-03-14
**Status**: Approved

## Overview

Redesign of moistcode.github.io from a static HTML portfolio into a hub-style personal site with blog, built on Astro. The site serves two audiences equally: recruiters/hiring managers and developer peers.

## Decisions

| Decision | Choice |
|---|---|
| Primary audience | Both recruiters + developer peers equally |
| Visual direction | Refined Terminal — evolve current dark/monospace aesthetic |
| Site structure | Hub Dashboard — homepage as command center |
| Blog content | Mix of technical deep-dives + personal/career posts |
| Framework | Astro (static site generator, markdown blog, GitHub Pages deploy) |
| Separate /about page | No — all bio/experience/tech lives on homepage |

## Routes

| Route | Purpose |
|---|---|
| `/` | Homepage hub — hero, latest posts, experience, tech stack |
| `/blog` | Blog listing — all posts, filterable by tag |
| `/blog/[slug]` | Individual blog post |

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `bg-primary` | `#0f172a` | Page background |
| `accent` | `#22d3ee` | Primary accent (links, active states, section markers) |
| `text-primary` | `#e2e8f0` | Body text, headings |
| `text-muted` | `#94a3b8` | Secondary text, excerpts |
| `text-subtle` | `#64748b` | Dates, metadata, footer |
| `tag-personal` | `#a78bfa` | Personal/career blog tags |
| `border` | `rgba(34,211,238,0.15)` | Nav border, section dividers |
| `card-bg` | `rgba(34,211,238,0.04)` | Card backgrounds |
| `card-border` | `rgba(34,211,238,0.1)` | Card borders |
| `card-hover-bg` | `rgba(34,211,238,0.07)` | Card hover state |
| `card-hover-border` | `rgba(34,211,238,0.25)` | Card hover border |

## Typography

| Element | Font | Size |
|---|---|---|
| Headings, nav, UI | `'SF Mono', 'Fira Code', 'Cascadia Code', monospace` | Varies |
| Blog body text | `-apple-system, 'Inter', system-ui, sans-serif` | 15px (14px mobile) |
| Code blocks | Same monospace stack | 13px (12px mobile) |

## Navigation

### Desktop (> 640px)
- Left: `~` (cyan) + `tommy pham` — both wrapped in a link to `/`
- Right: `home` | `blog` | `github` | `linkedin` (text links)
- Active page link highlighted in cyan

### Mobile (≤ 640px)
- Left: Small circular avatar (28px, links to `/`)
- Right: `home` | `blog` | GitHub SVG icon | LinkedIn SVG icon
- `~tommy pham` hidden
- Sticky nav on scroll

## Homepage (`/`)

### Hero Section
- Avatar image (72px circle, `assets/images/avatar.png`) + name + title
- Avatar hidden on mobile; name and title remain
- One-liner bio below in muted text
- No tech tag pills in hero (tech stack section handles this)

### Latest Posts Section
- Header: `// latest posts` with `view all →` link to `/blog`
- 3 most recent posts as cards
- **Desktop card layout**: title + excerpt left, date right
- **Mobile card layout**: date + reading time above title (full width)
- Tags below excerpt — cyan for technical, purple (#a78bfa) for personal

### Experience Section
- Header: `// experience`
- Stacked vertical cards matching current site layout:
  - Company logo (clickable, links to company site)
  - Role title
  - Date range in "Month Year - Month Year" format
- Cards sit side-by-side on desktop (`flex: 1 1 auto`), stack on mobile
- Compact padding: 14px 16px desktop, 10px 14px mobile, 4px gap between elements (2px mobile)

### Tech Stack Section
- Header: `// tech stack` with Icons/Text toggle
- Default view: SVG icon grid (existing icons from `assets/icons/`)
- Toggle switches to text pill view
- Toggle state persisted in localStorage
- Icons: 48px containers (42px mobile), 28px icons (24px mobile)

### Footer
- Social links only: github, linkedin, email
- No "built with" text
- Right-aligned

## Blog Listing (`/blog`)

- Header: `// blog` with subtitle description
- Tag filter pills at top: `all` | `engineering` | `react` | `design-systems` | `personal` | `career` | etc.
- Active filter highlighted in cyan with background
- Post cards identical to homepage format but with longer excerpts
- Reading time shown in side meta on desktop, top meta on mobile
- Max-width content area: 720px, centered

## Blog Post (`/blog/[slug]`)

- `← back to blog` link at top
- Article title (24px, 20px mobile)
- Meta line: date · reading time
- Tags below meta
- Body text in sans-serif for readability
- Section headings use `// heading` monospace pattern
- Inline code: cyan text, subtle cyan background/border
- Code blocks: `#1e293b` background, syntax-highlighted with terminal palette
  - Keywords: `#c084fc` (purple)
  - Functions: `#22d3ee` (cyan)
  - Strings: `#86efac` (green)
  - Comments: `#64748b` (gray)
- Previous/next post navigation at bottom

## Content Schema (Astro Content Collections)

```typescript
// src/content/config.ts
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});
```

## Project Structure

```
src/
  content/
    blog/           ← Markdown/MDX posts
    config.ts       ← Content collection schema
  pages/
    index.astro     ← Homepage
    blog/
      index.astro   ← Blog listing
      [...slug].astro ← Post template
  layouts/
    Base.astro      ← Shared shell (nav, footer, meta)
    Post.astro      ← Blog post layout
  components/
    Nav.astro
    Hero.astro
    PostCard.astro
    TechGrid.astro
    ExperienceCard.astro
    Footer.astro
    TagFilter.astro
assets/
  icons/            ← Existing tech + company SVGs
  images/           ← Avatar, company logos
```

## Responsive Breakpoint

Single breakpoint at **640px**:
- `> 640px`: Desktop layout
- `≤ 640px`: Mobile layout

## Existing Assets to Preserve

- `assets/images/avatar.png` — cartoon avatar
- `assets/icons/Hungryroot.svg` — company logo
- `assets/icons/SmugMug.svg` — company logo
- `assets/images/convertly-logo.png` — company logo
- `assets/icons/JavaScript.svg` through `assets/icons/Figma.svg` — 14 tech icons
- `assets/icons/GitHub.svg`, `LinkedIn.svg`, `Email.svg` — social icons
- `assets/favicon/` — existing favicons

## Deployment

- Astro static build → GitHub Pages
- Same repo: `MoistCode/moistcode.github.io`
- GitHub Actions for build/deploy

## Interactive Mockups

Reference mockups created during design process are in `.superpowers/brainstorm/` (not committed):
- `homepage-final-v2.html` — approved homepage with responsive behavior
- `blog-design.html` — approved blog listing + individual post views
