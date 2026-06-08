# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (Vite HMR)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint (react-hooks + react-refresh rules)
```

No test suite is configured.

## Environment

Create `.env.local` at the project root before running:

```
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

The Supabase client in `src/lib/supabase.js` will warn (not crash) if these are missing, but all data fetching will silently fail.

## Architecture

**"ABOUT JINI"** — a personal portfolio/blog SPA. No backend code lives here; Supabase is the entire backend.

### Routing (`src/App.jsx`)

Three routes via React Router v7:

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | `Header` is hidden here |
| `/category/:tag` | `CategoryPage` | Lists published posts for a tag |
| `/post/:id` | `PostDetail` | Renders a single post; content is Markdown |

### Data model (Supabase `posts` table)

Columns queried: `id`, `title`, `summary`, `content` (Markdown string), `tag`, `is_published`, `created_at`.

All queries filter `is_published = true`. The six fixed category tags are: `basic`, `Values`, `Favorites`, `Projects`, `Running`, `moments` — these are hardcoded in `FolderShelf.jsx` and `CategoryPage.jsx`.

### Component tree

```
App
├── Header          (shown on all pages except /)
├── Home
│   ├── Cover       (full-viewport hero; owns dark-mode toggle on home)
│   └── FolderShelf → FolderCard ×6  (navigates to /category/:tag)
├── CategoryPage    → PostCard list   (navigates to /post/:id)
└── PostDetail      (renders post.content with react-markdown)
```

### Styling

All styles are in `src/index.css` — a single flat file using CSS custom properties. No CSS modules, no Tailwind. Dark mode is implemented by adding/removing `.dark` on `<body>` and storing the preference in `localStorage`. Both `Cover` and `Header` independently read and write `localStorage.getItem('theme')`.

The parallax/fade effect on the home cover is driven by a scroll listener in `Home.jsx` that computes `opacity`, `translateY`, and `scale` inline styles on the sticky cover wrapper.
