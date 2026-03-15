# Portfolio Redesign + Blog Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild moistcode.github.io from static HTML to an Astro site with a hub-style homepage and markdown blog.

**Architecture:** Astro static site with content collections for blog posts. Shared Base layout wraps all pages. Components are `.astro` files with scoped styles following the "Refined Terminal" design system (dark navy bg, cyan accents, monospace UI). Existing SVG/image assets are preserved and migrated.

**Tech Stack:** Astro 5.x, TypeScript, Markdown/MDX, GitHub Pages, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-03-14-portfolio-redesign-design.md`

**Mockups (reference):**
- Homepage: `.superpowers/brainstorm/53390-1773535534/homepage-final-v2.html`
- Blog: `.superpowers/brainstorm/53390-1773535534/blog-design.html`

---

## File Structure

```
astro.config.mjs              ← Astro config (site URL, integrations)
package.json                   ← Dependencies
tsconfig.json                  ← TypeScript config
public/
  favicon/                     ← Move from assets/favicon/
  images/
    avatar.png                 ← Move from assets/images/
    convertly-logo.png         ← Move from assets/images/
  icons/
    JavaScript.svg             ← Move all from assets/icons/
    TypeScript.svg
    ... (all existing SVGs)
src/
  styles/
    global.css                 ← Design tokens, CSS reset, shared styles
  content/
    blog/
      hello-world.md           ← Seed post for development
    config.ts                  ← Content collection schema
  layouts/
    Base.astro                 ← Shared shell: nav + footer + head + slot
    Post.astro                 ← Blog post wrapper: extends Base, adds article chrome
  components/
    Nav.astro                  ← Sticky nav with responsive behavior
    Footer.astro               ← Social links footer
    Hero.astro                 ← Avatar + name + title + bio
    PostCard.astro             ← Blog post preview card (used on homepage + listing)
    ExperienceCard.astro       ← Company logo + role + dates
    TechGrid.astro             ← Icon/text toggle grid
    TagFilter.astro            ← Tag pill filter for blog listing
  pages/
    index.astro                ← Homepage: hero + posts + experience + tech
    blog/
      index.astro              ← Blog listing with tag filters
      [...slug].astro          ← Individual blog post
.github/
  workflows/
    deploy.yml                 ← GitHub Actions: build + deploy to Pages
.gitignore                     ← Add .superpowers/, node_modules/, dist/
```

---

## Chunk 1: Project Scaffolding

### Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialize Astro in the repo**

Run from repo root (`/Users/tommypham/Code/moistcode.github.io`):

```bash
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

If prompted about existing files, choose to keep them. We'll handle migration manually.

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, `package-lock.json` generated.

- [ ] **Step 3: Configure Astro for GitHub Pages**

Replace `astro.config.mjs` with:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://moistcode.github.io',
  output: 'static',
});
```

- [ ] **Step 4: Update .gitignore**

Ensure these entries exist:

```
node_modules/
dist/
.superpowers/
.astro/
```

- [ ] **Step 5: Verify build works**

```bash
npm run build
```

Expected: Exit code 0, `dist/` directory created.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore
git commit -m "chore: initialize Astro project"
```

---

### Task 2: Migrate Existing Assets

**Files:**
- Move: `assets/icons/*` → `public/icons/`
- Move: `assets/images/*` → `public/images/`
- Move: `assets/favicon/*` → `public/favicon/`

- [ ] **Step 1: Move assets to Astro's public directory**

```bash
mkdir -p public/icons public/images public/favicon
cp assets/icons/* public/icons/
cp assets/images/* public/images/
cp assets/favicon/* public/favicon/
```

- [ ] **Step 2: Verify assets are accessible**

```bash
npm run build
```

Check that `dist/icons/`, `dist/images/`, `dist/favicon/` contain the files.

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "chore: migrate assets to Astro public directory"
```

---

### Task 3: Global Styles + Design Tokens

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create global stylesheet with design tokens**

```css
/* src/styles/global.css */

:root {
  --bg-primary: #0f172a;
  --accent: #22d3ee;
  --text-primary: #e2e8f0;
  --text-muted: #94a3b8;
  --text-subtle: #64748b;
  --tag-personal: #a78bfa;
  --border: rgba(34, 211, 238, 0.15);
  --card-bg: rgba(34, 211, 238, 0.04);
  --card-border: rgba(34, 211, 238, 0.1);
  --card-hover-bg: rgba(34, 211, 238, 0.07);
  --card-hover-border: rgba(34, 211, 238, 0.25);
  --code-bg: #1e293b;
  --font-mono: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  --font-sans: -apple-system, 'Inter', system-ui, sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-mono);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global styles and design tokens"
```

---

## Chunk 2: Shared Components + Layout

### Task 4: Nav Component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create Nav component**

Build the Nav component with:
- Desktop: `~` + `tommy pham` (links to `/`), right-side text links (home, blog, github, linkedin)
- Mobile (≤640px): small avatar (28px, links to `/`), home, blog, GitHub SVG icon, LinkedIn SVG icon
- `~tommy pham` hidden on mobile
- Social text links hidden on mobile, replaced by SVG icons
- Sticky positioning
- Active page detection using `Astro.url.pathname`

Reference mockup: `homepage-final-v2.html` nav section.

- [ ] **Step 2: Verify it renders**

Create a temporary `src/pages/index.astro` that imports and renders `<Nav />`. Run `npm run dev` and check localhost.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add Nav component with responsive behavior"
```

---

### Task 5: Footer Component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create Footer component**

Build the Footer with:
- Right-aligned social links: github, linkedin, email
- Links go to actual URLs (github.com/MoistCode, linkedin profile, mailto)
- No "built with" text
- Top border with `var(--border)` color

Reference mockup: `homepage-final-v2.html` footer section.

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer component"
```

---

### Task 6: Base Layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create Base layout**

Build the Base layout that:
- Accepts `title` and `description` props
- Sets `<html lang="en">` with charset, viewport meta
- Imports `global.css`
- Includes favicon links (from `public/favicon/`)
- Includes Open Graph and Twitter meta tags
- Includes structured data (JSON-LD Person schema from current site)
- Renders `<Nav />` at top
- Renders `<slot />` for page content
- Renders `<Footer />` at bottom

- [ ] **Step 2: Update index.astro to use Base layout**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Tommy Pham - Software Engineer" description="Software engineer building seamless, user-focused web experiences.">
  <p>Homepage placeholder</p>
</Base>
```

- [ ] **Step 3: Verify full page renders**

```bash
npm run dev
```

Check: nav visible, footer visible, placeholder content in between. Check mobile responsive nav behavior by resizing.

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: Exit code 0.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro src/pages/index.astro
git commit -m "feat: add Base layout with nav, footer, and meta tags"
```

---

## Chunk 3: Homepage Components

### Task 7: Hero Component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create Hero component**

Build the Hero with:
- Avatar image (`/images/avatar.png`, 72px circle, border with accent color at 0.3 opacity)
- Avatar hidden on mobile (≤640px)
- Name: "Tommy Pham" (h1, 24px, 22px mobile)
- Subtitle: "Senior Software Engineer @ Hungryroot" (cyan)
- Bio paragraph (muted text, max-width 560px)
- Bottom border

Reference mockup: `homepage-final-v2.html` hero section.

- [ ] **Step 2: Add to homepage**

Import and render `<Hero />` in `index.astro`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add Hero component"
```

---

### Task 8: PostCard Component

**Files:**
- Create: `src/components/PostCard.astro`

- [ ] **Step 1: Create PostCard component**

Props: `title`, `description`, `date`, `tags`, `slug`, `readingTime` (optional).

Build the PostCard with:
- Desktop: title + excerpt left, date right (side-by-side)
- Mobile (≤640px): date + reading time above title on its own line, full-width title
- Tags below excerpt — cyan for technical tags, purple (`var(--tag-personal)`) for personal/career tags
- Hover state: border color and background change
- Entire card is a link to `/blog/{slug}`
- Tag color logic: tags containing "personal", "career", "life" use purple; all others use cyan

Reference mockup: `homepage-final-v2.html` post cards and `blog-design.html` listing cards.

- [ ] **Step 2: Commit**

```bash
git add src/components/PostCard.astro
git commit -m "feat: add PostCard component with responsive layout"
```

---

### Task 9: ExperienceCard Component

**Files:**
- Create: `src/components/ExperienceCard.astro`

- [ ] **Step 1: Create ExperienceCard component**

Props: `logo`, `logoAlt`, `companyUrl`, `role`, `dates`.

Build the ExperienceCard with:
- Vertically stacked: company logo (clickable, links to company URL) → role title → date string
- Card style: subtle border, slight background
- Compact: padding 14px 16px desktop, 10px 14px mobile, 4px gap (2px mobile)
- `flex: 1 1 auto` for grid behavior
- Logo height: 28px desktop, 20px mobile

Reference mockup: `homepage-final-v2.html` experience section.

- [ ] **Step 2: Commit**

```bash
git add src/components/ExperienceCard.astro
git commit -m "feat: add ExperienceCard component"
```

---

### Task 10: TechGrid Component

**Files:**
- Create: `src/components/TechGrid.astro`

- [ ] **Step 1: Create TechGrid component**

Build the TechGrid with:
- Icons/Text toggle (preserving behavior from current site)
- Icon view: grid of 48px containers (42px mobile) with 28px SVG icons (24px mobile)
- Text view: flex-wrap pills with tech names
- Toggle state persisted in localStorage
- Client-side JS for toggle (use `<script>` tag in Astro component)
- Data: array of `{ name, icon }` objects for all 14 technologies

Reference mockup: `homepage-final-v2.html` tech stack section + current site's toggle behavior.

- [ ] **Step 2: Commit**

```bash
git add src/components/TechGrid.astro
git commit -m "feat: add TechGrid component with icon/text toggle"
```

---

### Task 11: Assemble Homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build the full homepage**

Import all components and assemble:
1. `<Hero />`
2. Latest Posts section: `// latest posts` header + `view all →` link + 3 `<PostCard />` components (fetched from content collection, sorted by date, limited to 3, excluding drafts)
3. Experience section: `// experience` header + 3 `<ExperienceCard />` components with real data (Hungryroot, SmugMug, Convertly)
4. Tech stack section: `// tech stack` header + `<TechGrid />`

Section headers use the pattern: `<span class="slash">//</span> section name`

Each section wrapped in a `<section>` with consistent padding and top border.

- [ ] **Step 2: Verify full homepage renders**

```bash
npm run dev
```

Check: all sections visible, layout matches mockup, responsive behavior works.

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: Exit code 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble homepage with all components"
```

---

## Chunk 4: Blog System

### Task 12: Content Collection Config

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Define blog collection schema**

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: add blog content collection schema"
```

---

### Task 13: Seed Blog Post

**Files:**
- Create: `src/content/blog/hello-world.md`

- [ ] **Step 1: Create a seed post for development**

```markdown
---
title: "Hello World"
description: "First post on the new blog. Testing the waters."
date: 2026-03-14
tags: ["personal"]
draft: false
---

This is the first post. More to come.
```

- [ ] **Step 2: Verify content collection loads**

```bash
npm run build
```

Expected: Exit code 0, no content collection errors.

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/hello-world.md
git commit -m "feat: add seed blog post"
```

---

### Task 14: TagFilter Component

**Files:**
- Create: `src/components/TagFilter.astro`

- [ ] **Step 1: Create TagFilter component**

Props: `tags` (string array of all unique tags), `activeTag` (current filter, default "all").

Build the TagFilter with:
- "all" pill + one pill per unique tag
- Active pill: cyan text, cyan background (0.1 opacity), cyan border
- Inactive pill: muted text, subtle border
- Hover: border brightens
- Client-side JS: clicking a tag filters the post list (or use URL query params for SSG-friendly filtering)

For static site: use URL-based filtering with `?tag=engineering` query params. The blog listing page reads the param and filters server-side during build. Alternative: client-side JS filtering for immediate response.

Recommend: client-side JS filtering (simpler for static sites, no page reload).

- [ ] **Step 2: Commit**

```bash
git add src/components/TagFilter.astro
git commit -m "feat: add TagFilter component"
```

---

### Task 15: Blog Listing Page

**Files:**
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: Create blog listing page**

Build the blog listing with:
- Uses `Base` layout with title "Blog — Tommy Pham"
- Header: `// blog` + subtitle describing the blog
- `<TagFilter />` with all unique tags extracted from posts
- All non-draft posts rendered as `<PostCard />` components, sorted by date descending
- Max-width 720px content area, centered
- Client-side tag filtering via JS

Reference mockup: `blog-design.html` listing tab.

- [ ] **Step 2: Verify blog listing renders with seed post**

```bash
npm run dev
```

Navigate to `/blog`. Should show the seed post with tag filter.

- [ ] **Step 3: Build check**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat: add blog listing page with tag filtering"
```

---

### Task 16: Blog Post Layout + Page

**Files:**
- Create: `src/layouts/Post.astro`
- Create: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Create Post layout**

Extends Base layout. Adds:
- `← back to blog` link
- Article title (24px, 20px mobile)
- Meta line: formatted date · reading time
- Tags below meta
- Article body with sans-serif font (`var(--font-sans)`)
- Scoped styles for markdown content:
  - `p`: 15px, line-height 1.8, color `--text-muted` lighter (#cbd5e1)
  - `h2`: monospace, `// heading` pattern with cyan slash
  - `code` inline: cyan text, subtle bg/border
  - `pre`/code blocks: `--code-bg` background, border, rounded, overflow-x scroll
  - `ul`/`ol`: proper indentation and spacing
  - `blockquote`: left border accent, muted bg
  - `a`: cyan color, underline on hover
  - `img`: rounded, max-width 100%
- Previous/next post navigation at bottom

- [ ] **Step 2: Create dynamic route page**

```astro
---
import { getCollection } from 'astro:content';
import Post from '../../layouts/Post.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<Post frontmatter={post.data}>
  <Content />
</Post>
```

- [ ] **Step 3: Verify blog post renders**

```bash
npm run dev
```

Navigate to `/blog/hello-world`. Should show the seed post with full article layout.

- [ ] **Step 4: Calculate reading time**

Add reading time utility. Create `src/utils/reading-time.ts`:

```typescript
export function getReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}
```

Wire into Post layout and PostCard component.

- [ ] **Step 5: Build check**

```bash
npm run build
```

Expected: Exit code 0, `/blog/hello-world/index.html` exists in `dist/`.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/Post.astro src/pages/blog/[...slug].astro src/utils/reading-time.ts
git commit -m "feat: add blog post layout and dynamic routing"
```

---

## Chunk 5: Deployment + Cleanup

### Task 17: GitHub Actions Deploy

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create GitHub Actions workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy workflow"
```

---

### Task 18: Clean Up Old Files

**Files:**
- Remove: `index.html` (old static site)
- Remove: `assets/` directory (moved to `public/`)

- [ ] **Step 1: Remove old static files**

```bash
git rm index.html
git rm -r assets/
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: Exit code 0. Site builds entirely from Astro source.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old static HTML, migration to Astro complete"
```

---

### Task 19: Final Verification

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: Exit code 0.

- [ ] **Step 2: Preview locally**

```bash
npm run preview
```

Open in browser. Check:
- Homepage: hero, latest posts, experience cards with logos, tech grid toggle, footer
- Responsive: resize to mobile, verify nav changes, post card layout, avatar hiding
- Blog listing: `/blog` shows posts with tag filters
- Blog post: `/blog/hello-world` shows article with proper styling
- Navigation: `~tommy pham` and avatar link home, blog link works, back to blog works

- [ ] **Step 3: Verify all links**

- Nav links (home, blog, github, linkedin) work
- Experience card logos link to company sites
- Footer social links work
- Post cards link to individual posts
- "view all →" links to `/blog`
- "← back to blog" links to `/blog`

- [ ] **Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "fix: final polish from verification"
```
