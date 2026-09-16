# Notes Nexus — Codebase Analysis (Phase 0)

> Comprehensive technical analysis of the existing repository prior to the v2 architecture rewrite.
> Date of analysis: 2026-09-16.

---

## 1. Inventory

### Framework & Routing Engine
- **Next.js Version**: `16.3.1` (exact lockfile version: `16.3.1`, confirmed in `package.json` line 15 and `package-lock.json`).
- **React Version**: `19.2.8` (React DOM `19.2.8`).
- **Routing Engine**: **App Router exclusively** (`src/app/`). There is no `pages/` directory anywhere in the project.

### Dependency Audit (`package.json`)
The application currently declares 7 runtime dependencies and 4 dev dependencies.

| Package | Declared | Resolved | Used In | Purpose / Status |
| :--- | :--- | :--- | :--- | :--- |
| `next` | `16.3.1` | `16.3.1` | Core | Framework core. Note breaking changes flagged in `AGENTS.md`. |
| `react` | `19.2.8` | `19.2.8` | Core | UI runtime library. |
| `react-dom` | `19.2.8` | `19.2.8` | Core | DOM renderer. |
| `@vercel/analytics` | `^2.0.1` | `2.0.1` | `src/app/layout.js:2,52` | Web vitals and visitor tracking in Vercel. **Active**. |
| `framer-motion` | `^13.1.0` | `13.1.0` | `src/components/AnimateInView.jsx:3`<br>`src/components/AnimateFloat.jsx:3` | Micro-interactions and scroll animations. Adds heavy client-side bundle weight. |
| `lucide-react` | `^1.31.0` | `1.31.0` | `src/app/notes/page.js:6-16`<br>`src/app/pyq/page.js:4`<br>`src/app/about/page.js:4`<br>`src/components/NeoCard.jsx:15` | Icon set. 54 icons imported in `notes/page.js`. Tree-shaking is optimized via `next.config.mjs`. **Active**. |
| `react-icons` | `^5.7.0` | `5.7.0` | `src/app/about/page.js:5` | Only imported for `FaLinkedin` and `FaGithub`. **Redundant dependency** (adds package bloat for two SVG icons). |
| `@tailwindcss/postcss` | `^4` | `4.3.3` | `postcss.config.mjs:3` | **Unused**. Configured in PostCSS, but `src/app/globals.css` does not import `@import "tailwindcss";`. Zero utility classes are used. |
| `tailwindcss` | `^4` | `4.3.3` | Dev tooling | **Unused**. Installed dev dependency with zero active utility styles in the project. |
| `eslint` | `^9` | `9.39.5` | Dev tooling | Flat config linter. |
| `eslint-config-next` | `16.3.1` | `16.3.1` | `eslint.config.mjs:2` | Next.js recommended ESLint rule presets. |

### Language & Tooling Setup
- **Language**: **Pure JavaScript (ES6+ / JSX)**. There is **no TypeScript** in this repository (`jsconfig.json` only, no `tsconfig.json`, zero `.ts`/`.tsx` files except `opengraph-image.jsx`).
- **Path Aliases**: Configured in `jsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```
- **ESLint**: Configured in `eslint.config.mjs` using the modern ESLint 9 Flat Config API:
  - Extends `eslint-config-next/core-web-vitals`.
  - Global ignores configured for: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`.
- **Prettier**: Not installed or configured (no `.prettierrc`, `.editorconfig`, or formatting scripts).
- **Next Config (`next.config.mjs`)**:
  ```javascript
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    experimental: {
      optimizePackageImports: ['lucide-react']
    }
  };
  export default nextConfig;
  ```
- **Package Name**: Identified as `"name": "tmp-app"` in `package.json:2` (unrenamed boilerplate artifact).

### Directory Tree & Purpose
```text
Notes_Nexus-main/
├── .github/                     # GitHub repository issue and pull request templates
│   ├── ISSUE_TEMPLATE/          # Issue templates (bug report, feature request)
│   └── PULL_REQUEST_TEMPLATE.md # Pull request submission guidelines
├── docs/                        # Project documentation and architectural plans
├── public/                      # Static uncompiled assets (logos, pictures, favicons)
│   ├── favicon.png              # Unoptimized 1563x1563 PNG favicon
│   ├── icon2.png                # Main logo asset (1563x625 PNG)
│   ├── jis.png                  # University building photo (6000x3375 PNG)
│   ├── profilepic1.jpg          # Unused team portrait (Rajdip Garai)
│   ├── profilepic2.jpg          # Unused team portrait (Souvik Das)
│   ├── profilepic3.jpg          # Unused team portrait (Saikat Das)
│   └── profilepic4.jpg          # Unused team portrait (Pritam Bhattacharjee)
├── src/                         # Application source code
│   ├── app/                     # App Router routes, layouts, and global styles
│   │   ├── about/               # About Us & Team view
│   │   │   ├── layout.js        # Server Component defining /about metadata
│   │   │   └── page.js          # Client Component rendering mission and ID badges
│   │   ├── notes/               # Notes Catalog view
│   │   │   ├── layout.js        # Server Component defining /notes metadata
│   │   │   └── page.js          # Client Component with search input and 59 hardcoded subjects
│   │   ├── pyq/                 # Previous Year Questions view
│   │   │   ├── layout.js        # Server Component defining /pyq metadata
│   │   │   └── page.js          # Client Component rendering 8 semester cards
│   │   ├── globals.css          # Vanilla CSS Neo-Brutalist design tokens and utility classes
│   │   ├── layout.js            # Root layout (Google fonts, Navbar, main wrapper, Analytics)
│   │   ├── opengraph-image.jsx  # Edge runtime dynamic Open Graph social card generator
│   │   ├── page.js              # Landing page (Hero section with hardcoded Latest Uploads)
│   │   ├── robots.js            # Robots.txt generator pointing to sitemap
│   │   └── sitemap.js           # Static XML sitemap generator
│   └── components/              # Reusable UI elements and animation wrappers
│       ├── AnimateFloat.jsx     # Framer Motion infinite vertical bobbing animation wrapper
│       ├── AnimateInView.jsx    # Framer Motion scroll-triggered viewport entrance wrapper
│       ├── Navbar.jsx           # Fixed header with mobile drawer toggle and hardcoded links
│       ├── NeoButton.jsx        # Neo-Brutalist button/link primitive
│       └── NeoCard.jsx          # Neo-Brutalist card container primitive
├── .gitignore                   # Standard Next.js git ignore configuration
├── AGENTS.md                    # Environment and Next.js 16 breaking change warnings
├── CLAUDE.md                    # Assistant instruction reference pointing to AGENTS.md
├── CODE_OF_CONDUCT.md           # Contributor Covenant Code of Conduct
├── CONTRIBUTING.md               # Student contribution guide for notes and code
├── LICENSE                      # MIT License (copyright Souvik Das & Rajdip Garai)
├── README.md                    # Public documentation and marketing overview
├── eslint.config.mjs            # Flat ESLint 9 configuration
├── jsconfig.json                # JavaScript path alias configuration
├── next.config.mjs              # Next.js build configuration
├── package.json                 # Dependency definitions and run scripts
├── package-lock.json            # Deterministic dependency lockfile
└── postcss.config.mjs           # PostCSS configuration declaring @tailwindcss/postcss
```

---

## 2. Routing and Pages

| Route | File Path | Type | Render Mode | Data Dependencies | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `src/app/page.js` | Server Component | Static (SSG) | None (hardcoded strings, static image imports) | Landing page with Hero text, CTA buttons, and floating card with hardcoded "Latest Uploads". |
| `/notes` | `src/app/notes/page.js` | Client Component (`"use client"`) | Client Rendered | In-memory `subjects` array (59 items) | Searchable grid of subjects with external Google Drive links. |
| `/pyq` | `src/app/pyq/page.js` | Client Component (`"use client"`) | Client Rendered | In-memory `semesters` array (8 items) | Semester grid with 16 buttons all pointing to dummy `href="#"`. |
| `/about` | `src/app/about/page.js` | Client Component (`"use client"`) | Client Rendered | In-memory `teamMembers` array (4 items) | Who We Are, Our Mission, and ID-badge team cards. |
| `/opengraph-image` | `src/app/opengraph-image.jsx` | Route Handler (`runtime = 'edge'`) | Dynamic Edge Image | Fetches `https://notes-nexus-jisu.vercel.app/jis.png` | Renders 1200x630 dynamic OpenGraph image via `@vercel/og` (`ImageResponse`). |
| `/robots.txt` | `src/app/robots.js` | Route Handler | Static | Hardcoded base URL | Generates crawling rules and sitemap link. |
| `/sitemap.xml` | `src/app/sitemap.js` | Route Handler | Static | Hardcoded 4 static routes | Generates dynamic sitemap with `daily`/`weekly` frequencies. |

### Shared Layouts, Error Handling & Loading
- **Root Layout (`src/app/layout.js`)**:
  - Configures `next/font/google` for `Inter` (`--font-inter`) and `Outfit` (`--font-outfit`).
  - Sets root HTML `<head>` with `/favicon.png`.
  - Wraps children in `<header><Navbar /></header>` and `<main>{children}</main>`.
  - Injects `<Analytics />` from `@vercel/analytics/react`.
  - Sets root `metadata` with `metadataBase: new URL('https://notes-nexus-jisu.vercel.app')` and title template `%s | Notes Nexus`.
- **Sub-Route Layouts**:
  - `src/app/notes/layout.js`: Server Component purely exporting `metadata = { title: 'Notes', description: '...' }`.
  - `src/app/pyq/layout.js`: Server Component purely exporting `metadata = { title: 'Previous Year Questions', description: '...' }`.
  - `src/app/about/layout.js`: Server Component purely exporting `metadata = { title: 'About Us', description: '...' }`.
  - *Architectural Rationale*: Because `src/app/*/page.js` files are marked `"use client"`, they cannot export `metadata`. The authors created redundant parent `layout.js` files solely to bypass this Next.js restriction.
- **Error Boundaries**: **NONE**. There is no `error.js` or `global-error.js` anywhere in the codebase.
- **Loading States**: **NONE**. There is no `loading.js` anywhere in the codebase.
- **404 Handling**: **NONE**. There is no custom `not-found.js`.

---

## 3. Where the Content Lives

Every single piece of data in Notes Nexus is currently hardcoded into the source code across 5 files.

### 1. Subjects Catalog (`src/app/notes/page.js:18-78`)
- **Data Shape**: `Array<{ title: string, icon: LucideIconComponent, link: string }>`
- **Total Count**: **59 entries**.
- **Drive Link Status**:
  - **15 Valid Google Drive Folders**: Real Google Drive folder IDs.
  - **43 Placeholder Links**: Explicitly set to `https://drive.google.com/drive/folders/demo_link?usp=sharing`.
  - **1 Invalid Link**: `Professional Communication` points to `https://www.google.com`.

### 2. Previous Year Questions (`src/app/pyq/page.js:6-15, 111-153`)
- **Data Shape**: `Array<{ id: number, name: string, color: string }>`
- **Total Count**: **8 entries** (Semesters 1 through 8).
- **Link Status**: **100% Placeholders**. Every single card contains two buttons ("Mid Sem" and "End Sem") pointing to `href="#"`. Total 16 dead buttons.

### 3. "Latest Uploads" Widget (`src/app/page.js:109-116`)
- **Data Shape**: Hardcoded JSX `<li>` list items.
- **Total Count**: **2 entries**:
  1. `Engineering Mathematics-1`
  2. `Machine Learning`
- Duplicated visually inside `src/app/opengraph-image.jsx:105`.

### 4. Navigation Links (`src/components/Navbar.jsx:64-84, 102-124`)
- **Data Shape**: Hardcoded JSX elements, duplicated verbatim across desktop and mobile menu:
  - `HOME` (`/`)
  - `NOTES` (`/notes`)
  - `PYQ` (`/pyq`)
  - `ABOUT` (`/about`)
  - `FEEDBACK` (`https://forms.gle/WfbtFjHj3pS9RyQg9` — Google Forms external link)

### 5. Team Members (`src/app/about/page.js:7-12`)
- **Data Shape**: `Array<{ name: string, linkedin: string, github: string, image: string, color: string }>`
- **Total Count**: **4 entries**:
  1. `Rajdip Garai` (Real LinkedIn, Real GitHub, `image: '/profilepic1.jpg'`)
  2. `Souvik Das` (Real LinkedIn, Real GitHub, `image: '/profilepic2.jpg'`)
  3. `Saikat Das` (Real LinkedIn, Placeholder GitHub `https://github.com`, `image: '/profilepic3.jpg'`)
  4. `Pritam Bhattacharjee` (Placeholder LinkedIn `https://linkedin.com`, Placeholder GitHub `https://github.com`, `image: '/profilepic4.jpg'`)

---

### Content to Migrate: Complete Subject Table

The following 59 records represent the entire academic corpus of Notes Nexus that must be migrated into the Supabase database.

| # | Subject Name | Current Link | Link Status | Google Drive Folder ID / Notes |
| :---: | :--- | :--- | :---: | :--- |
| 1 | Engineering Mathematics-1 | `https://drive.google.com/drive/folders/19Qp9sGX4yeSTF9mr0WkV5gc_DAPjXnuC?usp=sharing` | **Valid** | `19Qp9sGX4yeSTF9mr0WkV5gc_DAPjXnuC` |
| 2 | Basic Electronics | `https://drive.google.com/drive/folders/1D2OU-9zE-nkKvH7YRc3seo3byAWWuj3W?usp=sharing` | **Valid** | `1D2OU-9zE-nkKvH7YRc3seo3byAWWuj3W` |
| 3 | Environmental Studies | `https://drive.google.com/drive/folders/1vkFhoYksnMAaQPe0cIaPY-C0rDTtuDBK?usp=sharing` | **Valid** | `1vkFhoYksnMAaQPe0cIaPY-C0rDTtuDBK` |
| 4 | Professional Communication | `https://www.google.com` | **Placeholder** | Needs real folder or R2 upload (`google.com`) |
| 5 | C programming | `https://drive.google.com/drive/folders/14cpebF5l2sjGi_51_JuYwn0RNa5JdEZ4?usp=sharing` | **Valid** | `14cpebF5l2sjGi_51_JuYwn0RNa5JdEZ4` |
| 6 | Engineering Physics | `https://drive.google.com/drive/folders/1PjKnhqgwlWDVfcUkWrhVo59UQlllqhXE?usp=sharing` | **Valid** | `1PjKnhqgwlWDVfcUkWrhVo59UQlllqhXE` |
| 7 | Engineering Chemistry | `https://drive.google.com/drive/folders/1WcYLATUrBVMOr_CAYZmJQCETWgcLKAiO?usp=sharing` | **Valid** | `1WcYLATUrBVMOr_CAYZmJQCETWgcLKAiO` |
| 8 | HTML | `https://drive.google.com/drive/folders/11LerP-u-VO534jLXe7UWhBawhEpINK22?usp=sharing` | **Valid** | `11LerP-u-VO534jLXe7UWhBawhEpINK22` |
| 9 | CSS | `https://drive.google.com/drive/folders/1x5cgIVbjC8NMStu0xnq-v-Moe0RSbyaB?usp=sharing` | **Valid** | `1x5cgIVbjC8NMStu0xnq-v-Moe0RSbyaB` |
| 10 | Java Script | `https://drive.google.com/drive/folders/1Enu4uzASVj2d5jXALZIoAWWtqvVAQFnt?usp=sharing` | **Valid** | `1Enu4uzASVj2d5jXALZIoAWWtqvVAQFnt` |
| 11 | Machine Learning | `https://drive.google.com/drive/folders/1IT4w7Ijl5i6bLYh53RM2xonh47JqPUvE?usp=drive_link` | **Valid** | `1IT4w7Ijl5i6bLYh53RM2xonh47JqPUvE` |
| 12 | Computer Networks | `https://drive.google.com/drive/folders/1og3uY1n3jUXPMCKUGwoEaXz4kZDWHJ0B?usp=sharing` | **Valid** | `1og3uY1n3jUXPMCKUGwoEaXz4kZDWHJ0B` |
| 13 | Aptitude | `https://drive.google.com/drive/folders/1AoOILHs9vFyuMsVuOOHNLR43oAmiTvAi?usp=sharing` | **Valid** | `1AoOILHs9vFyuMsVuOOHNLR43oAmiTvAi` |
| 14 | AI | `https://drive.google.com/drive/folders/1v-M963QwhI8GZaOKXhORRMHUFHp56aS-?usp=sharing` | **Valid** | `1v-M963QwhI8GZaOKXhORRMHUFHp56aS-` |
| 15 | Data Structure | `https://drive.google.com/drive/folders/1-v40NeVyTZizHmuw-d71Fkn65e8Rruen?usp=sharing` | **Valid** | `1-v40NeVyTZizHmuw-d71Fkn65e8Rruen` |
| 16 | Basic Electrical Engineering | `https://drive.google.com/drive/folders/1pALo1iYmINytMzFkzjJHU7yyCpjtHpaM?usp=sharing` | **Valid** | `1pALo1iYmINytMzFkzjJHU7yyCpjtHpaM` |
| 17 | Programming for Problem Solving | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 18 | Engineering Mathematics-II | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 19 | Indian Knowledge System | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 20 | Discrete Mathematics | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 21 | Digital Logic and Electronics | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 22 | Computer Organization and Architecture | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 23 | Design and Analysis of Algorithms | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 24 | Probability and Statistics | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 25 | Operating Systems | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 26 | Formal Language and Automata Theory | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 27 | Object Oriented Programming using Java | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 28 | Principles of Management | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 29 | Database Management Systems | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 30 | Compiler Design | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 31 | Cryptography and Network Security | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 32 | Computer Graphics | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 33 | Economics for Engineers | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 34 | Web and Internet Technology | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 35 | Software Engineering | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 36 | Mobile Computing | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 37 | Natural Language Processing | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 38 | Cloud Computing | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 39 | Cyber Law and Ethics | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 40 | Neural Networks and Deep Learning | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 41 | Advanced Algorithms | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 42 | High Performance Computing | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 43 | Advanced Operating Systems | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 44 | Information and Coding Theory | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 45 | Ad-Hoc and Sensor Networks | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 46 | Data Mining and Data Warehouse | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 47 | Computer Vision | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 48 | Parallel Computing | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 49 | Learning Optimization Techniques | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 50 | HRD & Organizational Behavior | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 51 | Real Time Systems | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 52 | Data Analytics | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 53 | Soft Computing | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 54 | VLSI | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 55 | Bioinformatics | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 56 | Robotics | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 57 | Introduction to IoT | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 58 | Image Processing | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |
| 59 | Optimization Techniques | `https://drive.google.com/drive/folders/demo_link?usp=sharing` | **Placeholder** | `demo_link` |

---

## 4. Design System Audit

### Styling Architecture
- **Methodology**: Neo-Brutalist design language built with **Vanilla CSS variables and classes** (`src/app/globals.css`), heavily augmented by **inline JavaScript style objects** (`style={{ ... }}`) on almost every element.
- **Tailwind Status**: Tailwind CSS 4 is nominally installed, but `@import "tailwindcss";` is omitted from `globals.css`. It does not process or output utility classes.
- **Consistency**: Inconsistent. Layout primitives (flex, grid, margins, padding, text alignment) are mixed haphazardly between `.container`, `.neo-*` CSS classes, and sprawling inline styles.

### Design Tokens & Values (Preservation Target)

#### 1. Color Palette
| Token / Variable | Hex Value | Role in Current Site | Notes / Deficiencies |
| :--- | :--- | :--- | :--- |
| `--primary-yellow` | `#FDE047` | Hero banner, primary CTA button, card icons, header tag | Tailwind yellow-300 tone. High contrast with black. |
| `--primary-pink` | `#F472B6` | Secondary button, department badges, active tags | Tailwind pink-400 tone. |
| `--primary-blue` | `#60A5FA` | Semester cards, team avatar cards | Tailwind blue-400 tone. |
| `--bg-color` | `#FDFBF7` | Root body background canvas | Warm off-white / parchment hue. |
| `--black` | `#000000` | Borders, hard drop shadows, typography | Solid 100% black. |
| `--white` | `#FFFFFF` | Card surface, button background, container background | Solid 100% white. |
| *Undefined*: `--primary-green` | `Missing` | Referenced in `pyq/page.js:9,13` and `about/page.js:10` | **Bug**: Evaluates to `transparent`/`unset`. Semesters 3 & 7 have blank headers. Standard Neo-Brutalist green (e.g. `#4ADE80` or `#86EFAC`) should be defined. |
| *Inline*: Text Muted | `#444444` | `src/components/NeoCard.jsx:20` | Secondary description text in cards. |

#### 2. Canvas Dot Pattern
- Defined on `body` in `src/app/globals.css:24-25`:
  - `background-image: radial-gradient(rgba(0, 0, 0, 0.15) 1.5px, transparent 1.5px);`
  - `background-size: 32px 32px;`
- Replicated on OpenGraph canvas (`src/app/opengraph-image.jsx:23-24`):
  - `radial-gradient(rgba(0, 0, 0, 0.15) 2px, transparent 2px)`, size `40px 40px`.

#### 3. Typography
- **Fonts**:
  - Headings / Body Primary: `Outfit` (`--font-outfit`, weights 400–900).
  - Body Secondary: `Inter` (`--font-inter`, weights 400–700).
  - Fallback: `sans-serif`.
- **Scale**:
  - Hero Display Title (`.hero-title`): `4.5rem` (72px), line-height `1.1`, weight `900`, tracking `-2px`.
    - Breakpoint `<= 768px`: `3rem` (48px).
    - Breakpoint `<= 480px`: `2.25rem` (36px).
  - Section Headings (`Browse Notes`, `Meet The Team`): `3.5rem` (56px), weight `900`, tracking `-1px` / `-2px`.
  - Sub-headings (`Who We Are`, `Our Mission`): `2rem` (32px), weight `800`.
  - Card Titles (`NeoCard`, Semester Header): `1.5rem`–`1.75rem` (24px–28px), weight `800`–`900`.
  - Body / Paragraph: `1.25rem` (20px) / `1.2rem` (19.2px), line-height `1.6`–`1.7`, weight `600`.
  - Navigation links: `1.1rem` (17.6px), weight `700` (desktop); `1.5rem` (24px), weight `900` (mobile).
  - Buttons (`.neo-button`): `1rem` (16px) standard, `1.25rem` (20px) hero, uppercase, weight `700`.
  - Avatar Initials (`about/page.js:152`): `6rem` (96px), weight `900`, tracking `-2px`.

#### 4. Borders & Border Radii
- **Borders**:
  - Standard Border: `3px solid var(--black)` (`.neo-border`, `.neo-button`, `.neo-card`).
  - Heavy Border: `4px solid var(--black)` (Hero badge, search input, about panels, card headers).
  - Thin Accent: `2px solid var(--black)` (Small icon badges).
- **Border Radii**:
  - Cards (`.neo-card`): `8px` (`border-radius: 8px; overflow: hidden;`).
  - Buttons (`.neo-button`, `.mobile-menu-btn`): `4px` (`border-radius: 4px;`).
  - Search Input: `0px` (`border-radius: 0;`).
  - Badges & Avatars: `50%` (`border-radius: 50%;`).

#### 5. Shadows (Zero-Blur Hard Offsets)
- Micro (`.mobile-menu-btn`): `2px 2px 0px 0px var(--black)`.
- Standard (`.neo-shadow`): `4px 4px 0px 0px var(--black)`.
- Card Default (`.neo-card`, `.team-card`): `6px 6px 0px 0px var(--black)`.
- Large / Elevated (`.neo-shadow-large`): `8px 8px 0px 0px var(--black)`.
- Card Hover State: `10px 10px 0px 0px var(--black)`.
- Header Shadow: `0 6px 0 0 rgba(0,0,0,1)`.

#### 6. Dynamic Motion & Whimsical Rotations
- Button click feedback:
  - Base: `box-shadow: 4px 4px 0px 0px var(--black);`
  - Hover: `transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px var(--black);`
  - Active: `transform: translate(4px, 4px); box-shadow: 0px 0px 0px 0px var(--black);`
- Card hover feedback:
  - Hover: `transform: translate(-4px, -4px); box-shadow: 10px 10px 0px 0px var(--black);`
- Characteristic Tilts:
  - Hero department badge: `transform: rotate(-2deg);`
  - Hero "NOTES NEXUS" highlight: `transform: rotate(1deg);`
  - Hero right illustration card: `transform: rotate(3deg);`
  - Notes "Notes" heading highlight: `transform: rotate(-2deg);`
  - PYQ "QUESTIONS" heading highlight: `transform: rotate(2deg);`
  - About "NOTES NEXUS" heading highlight: `transform: rotate(-2deg);`

### Reusable Components Audit

| Component | File Path | Props | True Reusability | Verdict & Assessment |
| :--- | :--- | :--- | :---: | :--- |
| `NeoButton` | `src/components/NeoButton.jsx` | `children`, `href`, `variant = 'primary'`, `className`, `...props` | **Yes** | Genuinely reusable primitive. Handles internal `Link` vs `<button>`. Lacks loading/disabled states and accessibility attributes. |
| `NeoCard` | `src/components/NeoCard.jsx` | `title`, `icon: Icon`, `actionLink`, `actionText`, `children` | **No** | Rigid and page-specific. Hardcodes yellow icon header (`160px`), expects `actionLink` to open an external tab. Cannot be reused for notes with internal routes, PYQs, or marketplace cards. |
| `AnimateInView` | `src/components/AnimateInView.jsx` | `children`, `delay`, `direction`, `className`, `duration`, `once`, `style` | **Yes** | Reusable Framer Motion animation wrapper. Forces client-side boundary on any wrapped tree. |
| `AnimateFloat` | `src/components/AnimateFloat.jsx` | `children`, `className`, `style` | **Yes** | Reusable 4-second continuous vertical floating loop. |
| `Navbar` | `src/components/Navbar.jsx` | None | **No** | Page-specific layout header. Hardcodes links, contains duplicate desktop/mobile trees, and relies on an awkward `<div style={{ height: '100px' }} />` offset spacer. |

### Hardcoded Identity & Branding Occurrences
- **Brand Name ("Notes Nexus")**:
  - `package.json:2`: Still `"tmp-app"` (unrenamed).
  - `src/app/layout.js:12,13,15,16,18,28,31,36`: Document titles, metadata creator, OG/Twitter tags.
  - `src/components/Navbar.jsx:48`: `alt="Notes Nexus"`.
  - `src/app/page.js:57,70`: Hero heading and paragraph copy.
  - `src/app/about/page.js:37,72`: Story heading and paragraph copy.
  - `src/app/opengraph-image.jsx:5,72`: OG card alt and title text.
- **University Reference ("JIS University" / "JIS University CSE Dept.")**:
  - `src/app/layout.js:15,16,29,37`: Meta description and keywords.
  - `src/app/page.js:37`: Floating hero badge text.
  - `src/app/page.js:97`: Hero card image `alt="JIS University"`.
  - `src/app/notes/layout.js:3`: Sub-route layout meta description.
  - `src/app/notes/page.js:148`: Card body copy (`Access the complete study materials... from JIS University CSE department`).
  - `src/app/pyq/layout.js:3`: Sub-route layout meta description.
  - `src/app/about/layout.js:3`: Sub-route layout meta description.
  - `src/app/about/page.js:73`: Mission statement text.
  - `src/app/opengraph-image.jsx:45,94`: Badge text and image alt text.
  - `public/jis.png`: Photo asset of the JIS University campus building.

### Responsiveness & Accessibility Assessment
- **Breakpoints**: Only two breakpoints defined in `globals.css`:
  - `max-width: 768px`: Switches navbar to mobile button; stacks hero container.
  - `max-width: 480px`: Scales hero title down to `2.25rem`; sets container padding to `1rem`.
- **Mobile Glitches**:
  - Navbar offset spacer is fixed at `height: '100px'`, but the fixed header rendered height is ~87px.
  - Mobile menu overlay (`.mobile-menu`) has `top: 76px; height: calc(100vh - 76px);`. This does not match the header height, creating a visual tear/overlap on mobile screens.
  - Background scrolling is not locked when mobile menu is open.
- **Accessibility Failures**:
  - **Color Contrast**: Secondary button (`.neo-button.secondary` in `globals.css:80-82`) renders white text (`#FFFFFF`) on pink (`#F472B6`). Contrast ratio is **2.35:1**, a direct failure of WCAG AA (minimum 4.5:1 required).
  - **Focus Indicators**: The subject search input (`src/app/notes/page.js:124`) explicitly sets `outline: 'none'` with no replacement `:focus-visible` styling.
  - **Screen Readers**:
    - Mobile menu button has `aria-label="Toggle menu"` but lacks `aria-expanded` and `aria-controls`.
    - Team social links (`src/app/about/page.js:181-186`) contain raw SVG icons with zero `aria-label` or inner text. Screen readers announce them as anonymous links.
    - Avatar cards show two-letter initials with no alternative text.
  - **Semantic HTML**:
    - Complete absence of `<footer>` tags.
    - Notes page has `<h1>` then jumps directly to `<h3>` inside `NeoCard.jsx:19`, skipping `<h2>`.
    - PYQ action links are `<a href="#" target="_blank">` instead of semantic `<button>` elements.

---

## 5. Assets

| Asset Path | File Size | Pixel Dimensions | Referenced In | Optimization & Performance Assessment |
| :--- | :--- | :--- | :--- | :--- |
| `public/favicon.png` | 97.2 KB | 1563 x 1563 px | `src/app/layout.js:45` | **Severely unoptimized**. A 1.5K PNG favicon wastes nearly 100 KB on initial uncached page visits. Must be replaced with standard 32x32 / 48x48 icon and SVG. |
| `public/icon2.png` | 116.7 KB | 1563 x 625 px | `src/components/Navbar.jsx:6` | Used as the main navbar logo. Rendered at height 60px (`width={250}`). Handled by `next/image` with blur placeholder, but source asset is 6x larger than necessary. |
| `public/jis.png` | 331.1 KB | 6000 x 3375 px | `src/app/page.js:4`<br>`src/app/opengraph-image.jsx:93` | **Severely oversized**. A 6K resolution image scaled down to 450px in the hero card. Also fetched synchronously over HTTP inside `opengraph-image.jsx` during edge social card generation. |
| `public/profilepic1.jpg` | 136.4 KB | 1080 x 1080 px | `src/app/about/page.js:8` | **Dead asset**. Declared in `teamMembers` array but never rendered in the JSX. |
| `public/profilepic2.jpg` | 117.8 KB | 1080 x 1080 px | `src/app/about/page.js:9` | **Dead asset**. Never rendered in the JSX. |
| `public/profilepic3.jpg` | 140.5 KB | 1080 x 1080 px | `src/app/about/page.js:10` | **Dead asset**. Never rendered in the JSX. |
| `public/profilepic4.jpg` | 177.4 KB | 1080 x 1080 px | `src/app/about/page.js:11` | **Dead asset**. Never rendered in the JSX. |

Total `public/` folder size is **1.12 MB**, of which **572 KB (51%)** consists of completely unrendered portrait images.

---

## 6. Problems and Technical Debt

### 🔴 Blocking (Will break or badly complicate the v2 build)
1. **Static In-Memory Content Layer**:
   - `src/app/notes/page.js:18-78`: 59 subjects bundled directly in JavaScript client code.
   - `src/app/pyq/page.js:6-15`: 8 semesters hardcoded with dead `#` links.
   - `src/app/page.js:109-116`: Hardcoded latest uploads.
   - *Impact*: Introducing a Supabase database requires dismantling all 3 pages, migrating data to SQL tables, and replacing arrays with asynchronous server queries.
2. **Total Inversion of Client/Server Boundaries**:
   - Every primary page (`src/app/notes/page.js`, `src/app/pyq/page.js`, `src/app/about/page.js`) is flagged `"use client"`.
   - *Impact*: Blocks server-side data fetching, prevents server action execution, and forces duplicate `layout.js` wrappers purely for static metadata.
3. **Absence of TypeScript**:
   - Entire codebase is vanilla JavaScript with `jsconfig.json`.
   - *Impact*: Building complex v2 features (Supabase Auth, RLS schemas, Cloudflare R2 presigned URLs, moderation queues, marketplace listings) without static types is an extreme regression risk.
4. **Hardcoded Single-Department Architecture**:
   - JIS University CSE Department is baked into layouts, metadata, headings, and card descriptions (`src/app/page.js:37`, `src/app/notes/page.js:148`, `src/app/about/page.js:73`).
   - *Impact*: v2 requires multi-university, multi-department dynamic routing (e.g. `/[university]/[department]/notes`).

### 🟡 Should Fix (Real problems to remediate during v2)
1. **Ghost Dependencies & Dead Code**:
   - Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss` in `package.json:21,24` and `postcss.config.mjs:3`) is running in PostCSS but completely absent from `globals.css`.
   - `react-icons` in `package.json:18` is pulled in solely for two icons in `about/page.js`.
   - `public/profilepic[1-4].jpg` (572 KB) are dead disk files.
2. **Missing CSS Variable `--primary-green`**:
   - Referenced in `src/app/pyq/page.js:9,13` and `src/app/about/page.js:10`, but not declared in `globals.css:1-8`. Renders transparent.
3. **Severe Accessibility & Contrast Violations**:
   - White text on `--primary-pink` button (`globals.css:80-82`) has a contrast ratio of only 2.35:1.
   - Search input (`notes/page.js:124`) strips outline with no focus ring.
   - Screen readers cannot read team social links or mobile toggle status.
4. **Edge OpenGraph Generator Fragility**:
   - `src/app/opengraph-image.jsx:93` contains `<img src="https://notes-nexus-jisu.vercel.app/jis.png" />`. Hardcoding the live production domain causes social card generation to fail in preview/local environments and adds unnecessary network latency.
5. **No Error Boundaries or Loading Indicators**:
   - Zero `error.js`, `loading.js`, or `not-found.js` files across the app.
6. **Hardcoded Metadata Domain**:
   - `src/app/layout.js:10`, `src/app/robots.js:2`, `src/app/sitemap.js:2` hardcode `https://notes-nexus-jisu.vercel.app`.

### 🟢 Nice to Have (Cosmetic / Minor)
1. **Sprawling Inline Styles**:
   - Almost all styling in `page.js`, `Navbar.jsx`, and `NeoCard.jsx` is written as inline `style={{ ... }}` objects.
2. **Redundant Navigation Code**:
   - Links in `Navbar.jsx` are duplicated verbatim between desktop and mobile JSX trees.
3. **Hardcoded Rotation Values**:
   - Inline `transform: 'rotate(-2deg)'` scattered across files instead of shared utility classes.

---

## 7. Reuse Assessment

| File / Component | Verdict | Justification |
| :--- | :---: | :--- |
| `src/app/layout.js` | **Keep with refactor** | Retain font configuration (`Inter`, `Outfit`) and root HTML structure; refactor base URL to environment variables and inject Auth/Session provider. |
| `src/app/globals.css` | **Keep with refactor** | Retain core Neo-Brutalist design tokens (colors, shadows, borders, radii); fix missing `--primary-green`; resolve contrast on secondary buttons; configure Tailwind CSS properly or clean up PostCSS. |
| `src/components/Navbar.jsx` | **Rewrite** | Must support user login state, dynamic navigation, marketplace links, accessible mobile drawer, and eliminate the 100px spacer hack. |
| `src/components/NeoButton.jsx` | **Keep with refactor** | Strong Neo-Brutalist base styling; convert to TypeScript, add variant types, loading spinners, and disabled states. |
| `src/components/NeoCard.jsx` | **Rewrite** | Currently rigid and hardcodes yellow header and external links; replace with a polymorphic NeoCard supporting notes, PYQs, marketplace items, and moderation cards. |
| `src/components/AnimateInView.jsx` | **Keep with refactor** | Useful scroll animation wrapper; convert to TypeScript and optimize to prevent unnecessary client re-renders. |
| `src/components/AnimateFloat.jsx` | **Keep as is** | Minimal, self-contained micro-interaction component for subtle floating elements. |
| `src/app/page.js` | **Rewrite** | Replace hardcoded CSE department copy and static uploads with dynamic university selectors, real stats, and database-driven uploads. |
| `src/app/notes/page.js` | **Rewrite** | Convert from a 59-subject client component into a Server Component with dynamic database queries, semester/branch filtering, and links to internal PDF viewers. |
| `src/app/notes/layout.js` | **Delete** | Unnecessary layout wrapper originally created solely to export metadata for a client page. |
| `src/app/pyq/page.js` | **Rewrite** | Replace 8 static cards pointing to `#` with dynamic database-driven past paper listings filtered by semester and exam type. |
| `src/app/pyq/layout.js` | **Delete** | Redundant metadata wrapper file. |
| `src/app/about/page.js` | **Keep with refactor** | Retain the popular "ID Badge" Neo-Brutalist visual design; fix unrendered profile photos, add missing social icon accessibility labels, and generalize mission copy. |
| `src/app/about/layout.js` | **Keep as is** | Clean, functional metadata layout. |
| `src/app/opengraph-image.jsx` | **Keep with refactor** | Retain dynamic edge OG rendering; replace hardcoded production image URL and CSE text with dynamic parameters. |
| `src/app/robots.js` | **Keep with refactor** | Parameterize base domain using `process.env.NEXT_PUBLIC_SITE_URL`. |
| `src/app/sitemap.js` | **Rewrite** | Replace 4 static entries with dynamic sitemap generation querying all published subjects and documents from Supabase. |
| `public/favicon.png` | **Rewrite (Replace)** | Replace 1563x1563 (97 KB) raster PNG with lightweight 32x32 / 48x48 icon and SVG favicon. |
| `public/icon2.png` | **Keep with refactor** | Downscale image dimensions to ~500x200 to reduce asset footprint while retaining logo design. |
| `public/jis.png` | **Keep with refactor** | Compress and downscale from 6K (6000x3375, 331 KB) to 900x600 WebP/PNG. |
| `public/profilepic[1-4].jpg` | **Delete** | Remove 572 KB of dead, unreferenced image files from the repository. |
